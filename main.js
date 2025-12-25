const express = require('express'),
	cors = require('cors'),
	secure = require('ssl-express-www');
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;

const mainrouter = require("./routes/mainrouter.js"),
	apirouter = require("./routes/api.js");

app.enable('trust proxy');
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(express.static("public"));
app.set("views", __dirname + "/view");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', mainrouter);
app.use('/api', apirouter);

app.listen(PORT, '0.0.0.0', (error) => {
	if (!error)
		console.log("APP LISTEN TO PORT " + PORT + " on all interfaces (0.0.0.0)")
	else
		console.log("ERROR OCCURRED:", error)
});

module.exports = app
