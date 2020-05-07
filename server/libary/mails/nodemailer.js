const nodemailer = require('nodemailer');
class MailClient {
	constructor(oauth) {
		this.mail = {};
		this.oauth = oauth;
		this.htmlData = '';
		this.body = '';
		this.from = '';
	}

	subject(subject) {
		this.subject = subject;
		return this;
	}

	to(to) {
		this.to = to;
		return this;
	}
	from(from) {
		this.from = from;
		return this;
	}

	html(mailTemplate, data = {}) {
		this.htmlData = {
			emailTemplate: mailTemplate,
			data,
		};
		return this;
	}

	body(data) {
		this.body = data;
		return this;
	}

	send() {
		try {
			if (typeof this.htmlData === 'object') {
				const ejs = require('ejs');
				const filePath = `/views/mails/${this.htmlData.emailTemplate}.ejs`;
				ejs.renderFile(appRoot + filePath, this.htmlData.data, (err, data) => {
					console.log(err);
					const transporter = nodemailer.createTransport(this.oauth);
					const mailOptions = {
						to: this.to,
						from: process.env.FROM_EMAIL || this.from,
						subject: this.subject,
						html: data,
					};
					return new Promise((Resolve, Reject) => {
						transporter.sendMail(mailOptions, function (error, info) {
							if (error) {
								console.log('i am check error ', error);
								Reject(error);
							} else {
								console.log('Email sent: ' + info.response);
								Resolve(info.response);
							}
						});
					});
				});
			} else {
				const transporter = nodemailer.createTransport(this.oauth);
				const mailOptions = {
					to: this.to,
					subject: this.subject,
					html: this.body,
				};
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						// eslint-disable-next-line no-console
						console.log('i am check error ', error);
					} else {
						// eslint-disable-next-line no-console
						console.log('Email sent: ' + info.response);
					}
				});
			}
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(err);
			return;
		}
	}
}

module.exports = MailClient;
