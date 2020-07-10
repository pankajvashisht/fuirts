const skipRoutes = {
	'': 'GET',
	'user/soical-login': 'POST',
	'app-information': 'GET',
	'forgot-password': 'POST',
	'user/login': 'POST',
	user: 'POST',
	'application/category': 'GET',
	category: 'GET',
	'sub-category': 'GET',
	'shop/listing': 'GET',
	'membership-plan': 'GET',
	'payment-types': 'GET',
	coupens: 'GET',
	gifts: 'GET',
	product: 'GET',
	rating: 'GET',
	home: 'GET',
	'shop/product': 'GET',
	'stripe-connect': 'GET',
	'user/soical-check': 'POST',
};
const AuthSkip = (Req, res, next) => {
	res.auth = true;
	const url = makeUrl(Req);
	if (
		(!Req.headers.hasOwnProperty('authorization_key') ||
			Req.headers.authorization_key.length === 0) &&
		skipRoutes.hasOwnProperty(url)
	) {
		if (Req.method === skipRoutes[url] || skipRoutes[url] === 'ALL') {
			res.auth = false;
		}
	}
	next();
};

const makeUrl = (Req) => {
	let url = Req.path.split('/');
	url.shift();
	if (url.indexOf(Req.lang) !== -1) {
		url.pop();
	}
	if (!isNaN(url[url.length - 1])) {
		url.pop();
	}
	return (url = url.join('/'));
};

module.exports = AuthSkip;
