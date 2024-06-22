const ru = require('./ru')
const en = require('./en')

const lang = (lang) => {
	switch (lang) {
		case 'en':
			return en;
		case 'ru':
			return ru;
		default:
			return ru;
	}
}

module.exports = lang