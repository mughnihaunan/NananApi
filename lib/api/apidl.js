//―――――――――――――――――――――――――――――――――――――――――― ┏  Modules ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

const cheerio = require("cheerio")
const axios = require("axios")
const qs = require("qs")
const fetch = require('node-fetch')
const FormData = require('form-data')
const request = require("request")
var export_data = require("./export");
const { rest } = require("lodash")
const e = require("connect-flash")


//―――――――――――――――――――――――――――――――――――――――――― ┏  Funtion ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

function parseFileSize(size) {
	return parseFloat(size) * (/GB/i.test(size)
		? 1000000
		: /MB/i.test(size)
			? 1000
			: /KB/i.test(size)
				? 1
				: /bytes?/i.test(size)
					? 0.001
					: /B/i.test(size)
						? 0.1
						: 0);
}

function pinterest(querry) {
	return new Promise(async (resolve, reject) => {
		axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
			headers: {
				"cookie": "_auth=1; _b=\"AXOtdcLOEbxD+qMFO7SaKFUCRcmtAznLCZY9V3z9tcTqWH7bPo637K4f9xlJCfn3rl4=\"; _pinterest_sess=TWc9PSZWcnpkblM5U1pkNkZ0dzZ6NUc5WDZqZEpGd2pVY3A0Y2VJOGg0a0J0c2JFWVpQalhWeG5iTTRJTmI5R08zZVNhRUZ4SmsvMG1CbjBWUWpLWVFDcWNnNUhYL3NHT1EvN3RBMkFYVUU0T0dIRldqVVBrenVpbGo5Q1lONHRlMzBxQTBjRGFSZnFBcTdDQVgrWVJwM0JtN3VRNEQyeUpsdDYreXpYTktRVjlxb0xNanBodUR1VFN4c2JUek1DajJXbTVuLzNCUDVwMmRlZW5VZVpBeFQ5ZC9oc2RnTGpEMmg4M0Y2N2RJeVo2aGNBYllUYjRnM05VeERzZXVRUVVYNnNyMGpBNUdmQ1dmM2s2M0txUHRuZTBHVFJEMEE1SnIyY2FTTm9DUEVTeWxKb3V0SW13bkV3TldyOUdrdUZaWGpzWmdaT0JlVnhWb29xWTZOTnNVM1NQSzViMkFUTjBpRitRRVMxaUFxMEJqell1bVduTDJid2l3a012RUgxQWhZT1M3STViSVkxV0dSb1p0NTBYcXlqRU5nPT0ma25kRitQYjZJNTVPb2tyVnVxSWlleEdTTkFRPQ==; _ir=0"
			}
		}).then(({ data }) => {
			const $ = cheerio.load(data)
			const result = [];
			const hasil = [];
			$('div > a').get().map(b => {
				const link = $(b).find('img').attr('src');
				result.push(link);
			});
			result.forEach(v => {
				if (v && v.includes('236')) {
					hasil.push(v.replace(/236/g, '736'));
				}
			});
			hasil.shift();
			resolve(hasil)

		})
	})
}


//―――――――――――――――――――――――――――――――――――――――――― ┏  Blue Archive Voice Downloader ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

function bluearchivevoice(characterName) {
	return new Promise(async (resolve, reject) => {
		try {
			if (!characterName) {
				return resolve({
					status: false,
					message: "Character name is required"
				});
			}

			// Format character name untuk pencarian
			const formattedName = characterName.charAt(0).toUpperCase() + characterName.slice(1).toLowerCase();
			
			// URL untuk scraping category dialog dengan filefrom parameter
			const baseUrl = `https://bluearchive.wiki/wiki/Category:Character_dialog?filefrom=${formattedName.toLowerCase()}`;
			
			console.log(`Fetching voice files for character: ${formattedName}`);
			console.log(`Using URL: ${baseUrl}`);
			
			const voiceFiles = [];
			let pageCount = 0;
			const maxPages = 5; // Kurangi karena sekarang lebih targeted
			let nextPageUrl = baseUrl;
			
			// Function untuk scrape satu halaman
			const scrapePage = async (url) => {
				const response = await axios.get(url, {
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
					}
				});

				const $ = cheerio.load(response.data);
				let foundFiles = [];

				// Scrape semua file audio dari kategori
				$('#mw-category-media .gallerybox').each((i, elem) => {
					const $elem = $(elem);
					const fileLink = $elem.find('.gallerytext a').attr('href');
					const fileName = $elem.find('.gallerytext a').attr('title');
					
					if (fileName && fileLink && fileName.includes('.ogg')) {
						// Check apakah file ini milik karakter yang dicari
						const namePattern = new RegExp(formattedName, 'i');
						if (namePattern.test(fileName)) {
							foundFiles.push({
								fileName: fileName,
								fileUrl: 'https://bluearchive.wiki' + fileLink,
								title: fileName.replace(/File:|\.ogg/g, '').trim()
							});
						}
						
						// Check apakah kita sudah melewati karakter yang dicari
						// Jika filename dimulai dengan huruf yang lebih besar dari karakter yang dicari
						// dan kita sudah menemukan beberapa files, stop scraping
						const firstChar = fileName.replace('File:', '').charAt(0).toLowerCase();
						const searchChar = formattedName.charAt(0).toLowerCase();
						if (firstChar > searchChar && foundFiles.length > 0) {
							return false; // stop iteration
						}
					}
				});

				// Jika tidak ada file ditemukan di galeri, coba dengan approach yang berbeda
				if (foundFiles.length === 0) {
					$('a[href*="/wiki/File:"]').each((i, elem) => {
						const $elem = $(elem);
						const href = $elem.attr('href');
						const title = $elem.attr('title') || $elem.text();
						
						if (href && title && title.includes('.ogg')) {
							const namePattern = new RegExp(formattedName, 'i');
							if (namePattern.test(title)) {
								foundFiles.push({
									fileName: title,
									fileUrl: 'https://bluearchive.wiki' + href,
									title: title.replace(/File:|\.ogg/g, '').trim()
								});
							}
							
							// Check apakah sudah melewati karakter yang dicari
							const firstChar = title.replace('File:', '').charAt(0).toLowerCase();
							const searchChar = formattedName.charAt(0).toLowerCase();
							if (firstChar > searchChar && foundFiles.length > 0) {
								return false; // stop iteration
							}
						}
					});
				}

				// Cari link halaman selanjutnya
				let nextUrl = null;
				const nextLink = $('#mw-category-media + div a').filter(function() {
					return $(this).text().includes('next 200');
				}).attr('href');
				
				if (nextLink) {
					nextUrl = 'https://bluearchive.wiki' + nextLink;
				}

				return { files: foundFiles, nextUrl: nextUrl };
			};

			// Scrape halaman pertama dan halaman-halaman berikutnya
			let shouldStop = false;
			while (nextPageUrl && pageCount < maxPages && !shouldStop) {
				try {
					console.log(`Scraping page ${pageCount + 1}: ${nextPageUrl}`);
					const pageResult = await scrapePage(nextPageUrl);
					
					// Tambahkan files yang ditemukan
					voiceFiles.push(...pageResult.files);
					
					// Check apakah kita sudah melewati karakter yang dicari
					// dengan melihat file terakhir di halaman ini
					if (pageResult.files.length === 0 && pageCount > 0) {
						// Jika tidak ada file yang cocok di halaman ini, mungkin sudah melewati
						console.log(`No matching files found on page ${pageCount + 1}, stopping search`);
						shouldStop = true;
					}
					
					// Update untuk halaman selanjutnya
					nextPageUrl = pageResult.nextUrl;
					pageCount++;
					
					// Jika sudah menemukan cukup file untuk karakter ini, bisa berhenti
					if (voiceFiles.length >= 30) {
						console.log(`Found enough files (${voiceFiles.length}) for ${formattedName}, stopping pagination`);
						break;
					}
					
					// Delay kecil untuk tidak overload server
					await new Promise(resolve => setTimeout(resolve, 300));
					
				} catch (pageError) {
					console.error(`Error scraping page ${pageCount + 1}:`, pageError.message);
					break;
				}
			}

			if (voiceFiles.length === 0) {
				return resolve({
					status: false,
					message: `No voice files found for character: ${formattedName}`,
					available_hint: "Try checking the character name spelling or use characters like: Ako, Hina, Shiroko, etc."
				});
			}

			// Pilih file random
			const randomIndex = Math.floor(Math.random() * voiceFiles.length);
			const selectedVoice = voiceFiles[randomIndex];

			// Ambil direct download link
			const filePageResponse = await axios.get(selectedVoice.fileUrl, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
				}
			});

			const $filePage = cheerio.load(filePageResponse.data);
			let directUrl = null;
			
			// Method 1: Cari di .fullMedia atau .fullImageLink
			directUrl = $filePage('.fullMedia a').attr('href') || $filePage('.fullImageLink a').attr('href');
			
			// Method 2: Cari link yang berisi .ogg
			if (!directUrl) {
				$filePage('a').each((i, elem) => {
					const href = $filePage(elem).attr('href');
					if (href && href.includes('.ogg') && href.includes('static.wikitide.net')) {
						directUrl = href;
						return false; // break loop
					}
				});
			}
			
			// Method 3: Cari di source audio/video tag
			if (!directUrl) {
				directUrl = $filePage('audio source').attr('src') || $filePage('video source').attr('src');
			}

			// Pastikan URL lengkap dan fix format
			if (directUrl) {
				// Jika URL sudah lengkap (dimulai dengan http), gunakan langsung
				if (directUrl.startsWith('http')) {
					// Fix double slash jika ada
					directUrl = directUrl.replace(/([^:]\/)\/+/g, "$1");
				} else if (directUrl.startsWith('//')) {
					// Handle protocol-relative URLs
					directUrl = 'https:' + directUrl;
				} else {
					// Jika relative URL, tambahkan base URL
					directUrl = directUrl.startsWith('/') 
						? 'https://bluearchive.wiki' + directUrl 
						: 'https://bluearchive.wiki/' + directUrl;
				}
			} else {
				// Jika masih tidak ada, coba construct manual dari filename
				const fileName = selectedVoice.fileName.replace('File:', '');
				// Blue Archive wiki menggunakan static.wikitide.net untuk file hosting
				// Format biasanya: https://static.wikitide.net/bluearchivewiki/[hash]/[hash]/filename
				directUrl = `https://static.wikitide.net/bluearchivewiki/${encodeURIComponent(fileName)}`;
			}

			const result = {
			
				status: true,
				character: formattedName,
				voice_file: selectedVoice.fileName,
				file_page: selectedVoice.fileUrl,
				direct_url: directUrl,
				title: selectedVoice.title,
				total_voices_found: voiceFiles.length,
				pages_scraped: pageCount,
				message: `Random voice selected from ${voiceFiles.length} files found across ${pageCount} pages`
			};

			console.log(`Found ${voiceFiles.length} voice files for ${formattedName} across ${pageCount} pages`);
			resolve(result);

		} catch (error) {
			console.error('Error in bluearchivevoice:', error.message);
			resolve({
				status: false,
				message: "Failed to fetch voice files",
				error: error.message
			});
		}
	});
}

//―――――――――――――――――――――――――――――――――――――――――― ┏  MyInstants Sound Downloader ┓ ―――――――――――――――――――――――――――――――――――――――――― \\

function myinstants(query) {
	return new Promise(async (resolve, reject) => {
		try {
			if (!query) {
				return resolve({
					status: false,
					message: "Search query is required"
				});
			}

			// Format query untuk pencarian
			const searchQuery = encodeURIComponent(query.trim());
			const searchUrl = `https://www.myinstants.com/search/?name=${searchQuery}`;
			
			console.log(`Searching MyInstants for: ${query}`);
			console.log(`Search URL: ${searchUrl}`);
			
			const response = await axios.get(searchUrl, {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'Accept-Language': 'en-US,en;q=0.5',
					'Accept-Encoding': 'gzip, deflate',
					'Connection': 'keep-alive'
				}
			});

			const $ = cheerio.load(response.data);
			const audioFiles = [];

			// Scrape audio files dari hasil pencarian
			$('.instant').each((i, elem) => {
				const $elem = $(elem);
				
				// Ambil title
				const title = $elem.find('.instant-link').text().trim() || 
							  $elem.find('a').attr('title') || 
							  $elem.find('.sound-title').text().trim() ||
							  $elem.find('a').text().trim();
				
				// Ambil URL halaman detail
				const detailUrl = $elem.find('.instant-link').attr('href') || 
								  $elem.find('a').attr('href');
				
				// Ambil direct audio URL dari data attributes atau onclick
				let audioUrl = null;
				
				// Method 1: Cari di onclick attribute untuk play button
				const onClickAttr = $elem.find('button[onclick*="play"]').attr('onclick') || '';
				const audioMatch = onClickAttr.match(/play\(['"]([^'"]+)['"]\)/);
				if (audioMatch) {
					audioUrl = audioMatch[1];
				}
				
				// Method 2: Cari di data attributes
				if (!audioUrl) {
					audioUrl = $elem.find('button[data-url]').attr('data-url') || 
							   $elem.find('.small-button[data-url]').attr('data-url') ||
							   $elem.find('[data-filename]').attr('data-filename');
				}
				
				// Method 3: Cari audio tag atau download link
				if (!audioUrl) {
					const audioTag = $elem.find('audio source').attr('src') || $elem.find('audio').attr('src');
					if (audioTag) {
						audioUrl = audioTag;
					} else {
						// Cari link download
						const downloadLink = $elem.find('a[href*=".mp3"], a[href*="media/sounds"]').attr('href');
						if (downloadLink) {
							audioUrl = downloadLink;
						}
					}
				}
				
				// Method 4: Generate potential MP3 URL dari detail URL
				if (!audioUrl && detailUrl) {
					const urlMatch = detailUrl.match(/\/instant\/([^\/]+)/);
					if (urlMatch) {
						const instantId = urlMatch[1];
						// Generate possible MP3 URL
						audioUrl = `/media/sounds/${instantId.replace(/-\d+$/, '')}.mp3`;
					}
				}

				if (title && detailUrl) {
					// Pastikan URL lengkap
					let fullDetailUrl = detailUrl;
					if (detailUrl && !detailUrl.startsWith('http')) {
						fullDetailUrl = 'https://www.myinstants.com' + detailUrl;
					}
					
					let fullAudioUrl = audioUrl;
					if (audioUrl && !audioUrl.startsWith('http')) {
						if (audioUrl.startsWith('//')) {
							fullAudioUrl = 'https:' + audioUrl;
						} else if (audioUrl.startsWith('/')) {
							fullAudioUrl = 'https://www.myinstants.com' + audioUrl;
						} else {
							fullAudioUrl = 'https://www.myinstants.com/' + audioUrl;
						}
					}

					audioFiles.push({
						title: title,
						detail_url: fullDetailUrl,
						audio_url: fullAudioUrl,
						source: 'MyInstants'
					});
				}
			});

			// Jika tidak menemukan audio dari pencarian langsung, coba scrape individual pages
			if (audioFiles.length === 0) {
				console.log('No direct audio found, trying to scrape individual pages...');
				
				const detailPages = [];
				$('.instant-link, a[href*="/instant/"]').each((i, elem) => {
					if (i < 5) { // Limit ke 5 halaman pertama
						const href = $(elem).attr('href');
						if (href) {
							const fullUrl = href.startsWith('http') ? href : 'https://www.myinstants.com' + href;
							detailPages.push({
								url: fullUrl,
								title: $(elem).text().trim() || $(elem).attr('title') || 'Unknown'
							});
						}
					}
				});

				// Scrape audio dari halaman detail
				for (const page of detailPages) {
					try {
						const pageResponse = await axios.get(page.url, {
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
							}
						});

						const $page = cheerio.load(pageResponse.data);
						
						// Cari audio URL di halaman detail dengan berbagai metode
						let audioUrl = null;
						
						// Method 1: Cari di onclick button play
						const playButton = $page('button[onclick*="play"]').attr('onclick');
						if (playButton) {
							const match = playButton.match(/play\('([^']+)'\)/);
							if (match) {
								audioUrl = match[1];
							}
						}
						
						// Method 2: Cari button download MP3
						if (!audioUrl) {
							const downloadButton = $page('a[href*=".mp3"], a[href*="media/sounds"]').attr('href');
							if (downloadButton) {
								audioUrl = downloadButton;
							}
						}
						
						// Method 3: Cari di data-url attributes
						if (!audioUrl) {
							audioUrl = $page('button[data-url]').attr('data-url') || 
									   $page('.small-button[data-url]').attr('data-url') ||
									   $page('[data-filename]').attr('data-filename');
						}
						
						// Method 4: Cari audio tag
						if (!audioUrl) {
							audioUrl = $page('audio source').attr('src') || $page('audio').attr('src');
						}
						
						// Method 5: Cari dalam script atau meta tags
						if (!audioUrl) {
							const scripts = $page('script').html() || '';
							// Cari pattern untuk MP3 files
							const scriptMatch = scripts.match(/["']([^"']*(?:media\/sounds|\.mp3)[^"']*)["']/);
							if (scriptMatch) {
								audioUrl = scriptMatch[1];
							}
						}
						
						// Method 6: Cari dalam seluruh HTML untuk pattern MP3
						if (!audioUrl) {
							const fullHtml = $page.html();
							const htmlMatch = fullHtml.match(/(?:media\/sounds\/[^"'\s]+\.mp3)/);
							if (htmlMatch) {
								audioUrl = htmlMatch[0];
							}
						}
						
						// Method 7: Generate URL dari page URL jika masih tidak ditemukan
						if (!audioUrl && page.url) {
							// Extract ID dari URL seperti /instant/alamak-sakura-miko-52341/
							const urlMatch = page.url.match(/\/instant\/([^\/]+)/);
							if (urlMatch) {
								const instantId = urlMatch[1];
								// Coba beberapa pattern umum MyInstants
								const possibleUrls = [
									`/media/sounds/${instantId}.mp3`,
									`/media/sounds/${instantId.replace(/-\d+$/, '')}.mp3`,
									`/media/sounds/${instantId.split('-').slice(0, -1).join('-')}.mp3`
								];
								
								for (const url of possibleUrls) {
									// Test apakah URL ini ada dengan HEAD request
									try {
										await axios.head('https://www.myinstants.com' + url);
										audioUrl = url;
										break;
									} catch (e) {
										// Continue ke URL berikutnya
									}
								}
							}
						}

						if (audioUrl) {
							// Pastikan URL lengkap
							if (!audioUrl.startsWith('http')) {
								if (audioUrl.startsWith('//')) {
									audioUrl = 'https:' + audioUrl;
								} else if (audioUrl.startsWith('/')) {
									audioUrl = 'https://www.myinstants.com' + audioUrl;
								} else {
									audioUrl = 'https://www.myinstants.com/' + audioUrl;
								}
							}

							audioFiles.push({
								title: page.title,
								detail_url: page.url,
								audio_url: audioUrl,
								source: 'MyInstants'
							});
						}

						// Delay untuk tidak overload server
						await new Promise(resolve => setTimeout(resolve, 200));
						
					} catch (pageError) {
						console.error(`Error scraping page ${page.url}:`, pageError.message);
						continue;
					}
				}
			}

			if (audioFiles.length === 0) {
				return resolve({
					status: false,
					message: `No audio files found for query: ${query}`,
					suggestion: "Try different keywords or check spelling"
				});
			}

			// Pilih audio random dan format response sesuai permintaan
			const randomIndex = Math.floor(Math.random() * audioFiles.length);
			const selectedAudio = audioFiles[randomIndex];

			// Generate ID dari URL atau title
			let audioId = selectedAudio.detail_url ? 
				selectedAudio.detail_url.split('/').pop() : 
				selectedAudio.title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 10000);

			// Pastikan audio_url tidak kosong, jika kosong coba generate
			let mp3Url = selectedAudio.audio_url;
			if (!mp3Url && selectedAudio.detail_url) {
				const urlMatch = selectedAudio.detail_url.match(/\/instant\/([^\/]+)/);
				if (urlMatch) {
					const instantId = urlMatch[1];
					mp3Url = `https://www.myinstants.com/media/sounds/${instantId.replace(/-\d+$/, '')}.mp3`;
				}
			}

			const result = {
				status: true,
				query: query,
				data: [{
					id: audioId,
					title: selectedAudio.title,
					url: selectedAudio.detail_url,
					mp3: mp3Url
				}],
				total_found: audioFiles.length,
				message: `Found ${audioFiles.length} audio files, returned random result for "${query}"`
			};

			console.log(`Found ${audioFiles.length} audio files for query: ${query}`);
			console.log(`Selected audio MP3 URL: ${mp3Url}`);
			resolve(result);

		} catch (error) {
			console.error('Error in myinstants:', error.message);
			resolve({
				status: false,
				message: "Failed to fetch audio from MyInstants",
				error: error.message
			});
		}
	});
}


module.exports.pinterest = pinterest
module.exports.bluearchivevoice = bluearchivevoice
module.exports.myinstants = myinstants
