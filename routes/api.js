__path = process.cwd()
const express = require('express')
const axios = require('axios')
const fetch = require('node-fetch')
const translate = require('translate-google')
const fs = require('fs')
const Jimp = require('jimp')
const FormData = require('form-data')
const baseUrl = 'https://tools.betabotz.org'
const { toanime, tozombie } = require(__path + "/lib/turnimg.js")
const request = require('request')
const { openai } = require(__path + "/lib/openai.js")
const dylux = require('api-dylux')
const textto = require('soundoftext-js')
const googleIt = require('google-it')
const { shortText } = require("limit-text-js")
const TinyURL = require('tinyurl');
const emoji = require("emoji-api");
const isUrl = require("is-url")
const { ytMp4, ytMp3 } = require(__path + '/lib/y2mate')
const BitlyClient = require('bitly').BitlyClient
const { fetchJson, getBuffer } = require(__path + '/lib/myfunc')
const isNumber = require('is-number');
const router = express.Router()
const ryzen = require("../lib/listdl")
const apidl = require("../lib/api/apidl")
var error = __path + '/view/error.html'
let creator = 'Nanan'
loghandler = {
	error: {
		status: false,
		code: 503,
		message: "service got error, try again in 10 seconds",
		creator: creator
	},
	noturl: {
		status: false,
		code: 503,
		message: "enter paramater url",
		creator: creator
	},
	nottext: {
		status: false,
		code: 503,
		message: "enter parameter text",
		creator: creator
	},
	notquery: {
		status: false,
		code: 503,
		message: "enter parameter query",
		creator: creator
	},
	notusername: {
		status: false,
		code: 503,
		message: "enter parameter username",
		creator: creator
	}
}
/**router.get('/testing', (req, res, next) => {
	res.json({
		status: true,
		code: 200,
		creator: creator
	})
})**/
// *** AI ***
router.get('/ai/ryzenai', async (req, res, next) => {
	let text = req.query.text
	if (!text) return res.json(loghandler.nottext)
	openai(text, 'Date.now()')
		.then(async data => {
			res.json({
				status: true,
				code: 200,
				result: data,
				creator: creator
			})
		}).catch(e => {
			console.error(e);
		})
})

router.get('/search/pinterest', async (req, res, next) => {
	var text1 = req.query.text
	if (!text1) return res.json({ status: false, creator: `${creator}`, message: "[!] masukan parameter text" })
	ryzen.pinterest(text1).then((data) => {
		if (!data[0]) return res.json(loghandler.notfound)
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	}).catch((err) => {
		res.json(loghandler.notfound)
	})
})


// ***Random Images***
router.get('/random/dinokuning', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/dinokuning.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/dino.jpg', data)
			res.sendFile(__path + '/tmp/dino.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/patrick', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/patrick.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/amongus', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/among.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/animegif', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/animegif.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/animestick', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/animestick.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/dadu', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/dadu.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/doge', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/doge.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/kawanspongebob', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/kawanspongebob.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/manusialidi', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/manusialidi.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/mukalu', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/mukalu.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/paimon', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/paimon.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/patrickgif', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/patrickgif.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/rabbit', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/rabbit.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/random', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/random.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/spongebob', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/sticker/spongebob.json`))
		.then(response => response.json())
		.then(async data => {
			let hasil = data[Math.floor(Math.random() * data.length)]
			let buffer = hasil;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/images.jpg', data)
			res.sendFile(__path + '/tmp/images.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/china', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/china.json`))
		.then(response => response.json())
		.then(async data => {
			let result = data[Math.floor(Math.random() * data.length)]
			let buffer = result;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/chika.jpg', data)
			res.sendFile(__path + '/tmp/chika.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/vietnam', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/vietnam.json`))
		.then(response => response.json())
		.then(async data => {
			let result = data[Math.floor(Math.random() * data.length)]
			let buffer = result;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/chika.jpg', data)
			res.sendFile(__path + '/tmp/chika.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/thailand', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/thailand.json`))
		.then(response => response.json())
		.then(async data => {
			let result = data[Math.floor(Math.random() * data.length)]
			let buffer = result;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/chika.jpg', data)
			res.sendFile(__path + '/tmp/chika.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/indonesia', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/indonesia.json`))
		.then(response => response.json())
		.then(async data => {
			let result = data[Math.floor(Math.random() * data.length)]
			let buffer = result;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/chika.jpg', data)
			res.sendFile(__path + '/tmp/chika.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/korea', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/korea.json`))
		.then(response => response.json())
		.then(async data => {
			let result = data[Math.floor(Math.random() * data.length)]
			let buffer = result;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/chika.jpg', data)
			res.sendFile(__path + '/tmp/chika.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/japan', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/japan.json`))
		.then(response => response.json())
		.then(async data => {
			let result = data[Math.floor(Math.random() * data.length)]
			let buffer = result;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/chika.jpg', data)
			res.sendFile(__path + '/tmp/chika.jpg')
		}).catch(e => {
			console.error(e)
		})
})
router.get('/random/malaysia', async (req, res) => {
	fetch(encodeURI(`https://raw.githubusercontent.com/Kira-Master/database/main/cecan/malaysia.json`))
		.then(response => response.json())
		.then(async data => {
			let result = data[Math.floor(Math.random() * data.length)]
			let buffer = result;
			data = await fetch(buffer).then(v => v.buffer())
			await fs.writeFileSync(__path + '/tmp/chika.jpg', data)
			res.sendFile(__path + '/tmp/chika.jpg')
		}).catch(e => {
			console.error(e)
		})
})
// ***TOOLS***
// Blue Archive Voice Downloader
router.get('/downloader/bluearchive-voice', async (req, res, next) => {
	var character = req.query.character
	if (!character) return res.json({
		status: false,
		creator: `${creator}`,
		message: "[!] enter character parameter!",
		example: "/api/downloader/bluearchive-voice?character=Ako"
	})

	apidl.bluearchivevoice(character).then(data => {
		if (!data.status) {
			return res.json({
				status: false,
				creator: `${creator}`,
				message: data.message,
				hint: data.available_hint || "Check character name spelling"
			})
		}
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	})
		.catch(e => {
			console.error('Blue Archive Voice Error:', e)
			res.json({
				status: false,
				creator: `${creator}`,
				message: "Failed to fetch Blue Archive voice",
				error: e.message
			})
		})
})

// MyInstants Audio Search & Download
router.get('/downloader/myinstants', async (req, res, next) => {
	var query = req.query.query
	if (!query) return res.json({
		status: false,
		creator: `${creator}`,
		message: "[!] enter query parameter!",
		example: "/api/downloader/myinstants?query=bruh"
	})

	apidl.myinstants(query).then(data => {
		if (!data.status) {
			return res.json({
				status: false,
				creator: `${creator}`,
				message: data.message,
				suggestion: data.suggestion || "Try different keywords"
			})
		}
		res.json({
			status: true,
			creator: `${creator}`,
			result: data
		})
	})
		.catch(e => {
			console.error('MyInstants Error:', e)
			res.json({
				status: false,
				creator: `${creator}`,
				message: "Failed to fetch audio from MyInstants",
				error: e.message
			})
		})
})

module.exports = router
