const setLanguage = (Request, Res, next) => {
	const { lang = 'en' } = Request.query;
	Request.lang = lang;
	global._Lang = lang;
	return next();
};

module.exports = setLanguage;
