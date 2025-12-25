const youtubedl = require('youtube-dl-exec');
const axios = require('axios');

/**
 * YouTube Downloader using yt-dlp (most reliable method)
 * No dependency on ytdl-core which often breaks
 */

// Extract video ID
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Format size
function formatSize(bytes) {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Get video info and download URLs using yt-dlp
async function ytMp4(url) {
    try {
        const videoId = extractVideoId(url);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        // Get video info with all formats
        const info = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
        });

        // Filter video formats (with audio)
        const videoFormats = info.formats.filter(f =>
            f.vcodec !== 'none' &&
            f.acodec !== 'none' &&
            f.ext === 'mp4'
        );

        // Get different quality options
        const format720 = videoFormats.find(f => f.height === 720);
        const format480 = videoFormats.find(f => f.height === 480);
        const format360 = videoFormats.find(f => f.height === 360);
        const bestFormat = videoFormats[0];

        const downloads = {};

        if (format720) {
            downloads['720p'] = {
                quality: '720p',
                download_url: `/api/downloader/youtube-stream?videoId=${videoId}&quality=720&type=mp4`,
                direct_url: format720.url,
                size: formatSize(format720.filesize || format720.filesize_approx)
            };
        }

        if (format480) {
            downloads['480p'] = {
                quality: '480p',
                download_url: `/api/downloader/youtube-stream?videoId=${videoId}&quality=480&type=mp4`,
                direct_url: format480.url,
                size: formatSize(format480.filesize || format480.filesize_approx)
            };
        }

        if (format360) {
            downloads['360p'] = {
                quality: '360p',
                download_url: `/api/downloader/youtube-stream?videoId=${videoId}&quality=360&type=mp4`,
                direct_url: format360.url,
                size: formatSize(format360.filesize || format360.filesize_approx)
            };
        }

        if (bestFormat && !downloads['720p']) {
            downloads['best'] = {
                quality: bestFormat.height ? `${bestFormat.height}p` : 'best',
                download_url: `/api/downloader/youtube-stream?videoId=${videoId}&quality=best&type=mp4`,
                direct_url: bestFormat.url,
                size: formatSize(bestFormat.filesize || bestFormat.filesize_approx)
            };
        }

        return {
            title: info.title,
            videoId: videoId,
            thumbnail: info.thumbnail,
            duration: info.duration,
            views: info.view_count?.toString() || 'Unknown',
            channel: info.uploader || info.channel,
            uploadDate: info.upload_date || 'Unknown',
            description: info.description || '',
            downloads: downloads
        };
    } catch (error) {
        console.error('ytMp4 Error:', error.message);
        throw error;
    }
}

// Get audio info and download URLs
async function ytMp3(url) {
    try {
        const videoId = extractVideoId(url);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        // Get video info with all formats
        const info = await youtubedl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
        });

        // Filter audio-only formats
        const audioFormats = info.formats.filter(f =>
            f.acodec !== 'none' &&
            f.vcodec === 'none'
        );

        // Sort by audio quality
        audioFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0));

        const bestAudio = audioFormats[0];
        const mediumAudio = audioFormats.find(f => f.abr && f.abr >= 128);

        const downloads = {};
        if (bestAudio) {
            downloads['high'] = {
                quality: bestAudio.abr ? `${bestAudio.abr}kbps` : 'high',
                download_url: `/api/downloader/youtube-stream?videoId=${videoId}&quality=best&type=mp3`,
                direct_url: bestAudio.url,
                size: formatSize(bestAudio.filesize || bestAudio.filesize_approx)
            };
        }

        if (mediumAudio && mediumAudio !== bestAudio) {
            downloads['medium'] = {
                quality: mediumAudio.abr ? `${mediumAudio.abr}kbps` : 'medium',
                download_url: `/api/downloader/youtube-stream?videoId=${videoId}&quality=128&type=mp3`,
                direct_url: mediumAudio.url,
                size: formatSize(mediumAudio.filesize || mediumAudio.filesize_approx)
            };
        }

        return {
            title: info.title,
            videoId: videoId,
            thumbnail: info.thumbnail,
            duration: info.duration,
            views: info.view_count?.toString() || 'Unknown',
            channel: info.uploader || info.channel,
            uploadDate: info.upload_date || 'Unknown',
            description: info.description || '',
            downloads: downloads
        };
    } catch (error) {
        console.error('ytMp3 Error:', error.message);
        throw error;
    }
}

// Stream function for download endpoint
async function streamYouTube(videoId, quality, type = 'mp4') {
    try {
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        // Get download URL using yt-dlp
        const format = type === 'mp4'
            ? (quality === 'best' ? 'best[ext=mp4]' : `best[height<=${quality}][ext=mp4]`)
            : (quality === 'best' ? 'bestaudio' : `bestaudio[abr<=${quality}]`);

        const info = await youtubedl(url, {
            dumpSingleJson: true,
            format: format,
            noCheckCertificates: true,
            noWarnings: true
        });

        // Get the direct URL
        const downloadUrl = info.url || info.formats[0]?.url;

        if (!downloadUrl) {
            throw new Error('Could not get download URL');
        }

        return {
            downloadUrl: downloadUrl,
            title: info.title,
            contentType: type === 'mp3' ? 'audio/mpeg' : 'video/mp4',
            filename: `${info.title.replace(/[^\w\s]/gi, '')}.${type}`
        };
    } catch (error) {
        throw error;
    }
}

module.exports = { ytMp4, ytMp3, streamYouTube };