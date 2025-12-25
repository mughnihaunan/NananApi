# 🚀 Nanan API

Modern REST API services for developers. Fast, reliable, and easy to use.

## 📌 Base URL

```
https://api.mhaunan.me
```

## ✨ Features

- 🎯 **No Authentication Required** - Start using immediately
- ⚡ **Fast Response Time** - Optimized for performance
- 📦 **Multiple Services** - Downloader & Search endpoints
- 🔄 **RESTful Design** - Clean and intuitive API structure
- 📚 **Well Documented** - Complete API documentation available

## 🛠️ Available Endpoints

### 📥 Media Downloader

#### YouTube MP3
Download YouTube videos as MP3 audio files.

```http
GET /api/downloader/youtube-mp3?url={youtube_url}
```

**Example:**
```bash
curl "https://api.mhaunan.me/api/downloader/youtube-mp3?url=https://youtube.com/watch?v=xxxxx"
```

#### YouTube MP4
Download YouTube videos as MP4 files.

```http
GET /api/downloader/youtube-mp4?url={youtube_url}
```

**Example:**
```bash
curl "https://api.mhaunan.me/api/downloader/youtube-mp4?url=https://youtube.com/watch?v=xxxxx"
```

#### Blue Archive Voice
Get random or specific Blue Archive character voice files.

```http
GET /api/downloader/bluearchive-voice?character={character_name}
```

**Example:**
```bash
curl "https://api.mhaunan.me/api/downloader/bluearchive-voice?character=Hina"
```

#### MyInstants Sound Effects
Search and download sound effects from MyInstants.

```http
GET /api/downloader/myinstants?query={search_term}
```

**Example:**
```bash
curl "https://api.mhaunan.me/api/downloader/myinstants?query=bruh"
```

### 🔍 Search Services

#### Pinterest Search
Search for images on Pinterest.

```http
GET /api/search/pinterest?text={search_query}
```

**Example:**
```bash
curl "https://api.mhaunan.me/api/search/pinterest?text=anime+wallpaper"
```

## 📖 Documentation

Full API documentation is available at: [https://api.mhaunan.me/docs](https://api.mhaunan.me/docs)

## 🚦 Response Format

All endpoints return JSON responses in the following format:

### Success Response
```json
{
  "status": true,
  "creator": "Nanan",
  "result": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": false,
  "code": 503,
  "message": "Error description",
  "creator": "Nanan"
}
```

## 💻 Usage Examples

### JavaScript (Fetch API)
```javascript
fetch('https://api.mhaunan.me/api/downloader/youtube-mp3?url=https://youtube.com/watch?v=xxxxx')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Python (Requests)
```python
import requests

url = "https://api.mhaunan.me/api/downloader/youtube-mp3"
params = {"url": "https://youtube.com/watch?v=xxxxx"}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

### cURL
```bash
curl -X GET "https://api.mhaunan.me/api/search/pinterest?text=nature" \
  -H "Accept: application/json"
```

## 📊 API Statistics

- ✅ **Uptime:** 99.9%
- ⚡ **Response Time:** < 100ms
- 🎯 **Endpoints:** 6+ active endpoints
- 🆓 **Cost:** Free to use

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the MIT License.

## 🌟 Support

If you find this API useful, please consider giving it a star ⭐

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ by Nanan Team**
