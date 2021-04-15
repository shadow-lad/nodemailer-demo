const express = require("express");
const morgan = require("morgan");
const nodemailer = require("nodemailer");

const exphbs = require("express-handlebars"); // for templating

const hbs = exphbs.create({
	defaultLayout: "main",
	extname: "hbs",
});

const PORT = process.env.PORT || 8080;
const app = express();

var transporter = null;

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
	res.render("home");
});

app.post("/", (req, res) => {
	const to = req.body.email;
	const from = transporter.transporter.auth.user;
	transporter
		.sendMail({
			from,
			to,
			subject: "Hello 🙋",
			text: "Welcome to Nodemailer!",
			html: "<h1>Welcome to Nodemailer!</h1>",
		})
		.then((info) => {
			const link = nodemailer.getTestMessageUrl(info);
			res.render("home", { link });
		});
});

nodemailer
	.createTestAccount()
	.then((account) => {
		transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false,
			auth: {
				user: account.user,
				pass: account.pass,
			},
		});

		app.listen(PORT, () => {
			console.log(`Started to listen to server on port: ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("An error occurred when started the server", err);
	});
