const express = require('express');
const router = express.Router();
const {
	UserController,
	DriverController,
	ProductController,
	ShopController,
	CategoryController,
	AddressController,
} = require('../src/Controller/v1/index');
const { userSignup } = require('../src/Request');
const {
	UserAuth,
	cross,
	Language,
	AuthSkip,
} = require('../src/middleware/index');
const Apiresponse = require('../libary/ApiResponse');
const user = new UserController();

router.use([cross, Language, AuthSkip, UserAuth]);
router.get('/', function (req, res) {
	res.send(' v1 APi Hello world ');
});

router.post('/user', userSignup, Apiresponse(user.addUser));
router.post('/user/login/', Apiresponse(user.loginUser));
router.post('/user/verify', Apiresponse(user.verifyOtp));
router.post('/user/soical-login', Apiresponse(user.soicalLogin));
router.put('/user/edit/', Apiresponse(user.updateProfile));
router.post('/change-password', Apiresponse(user.changePassword));
router.post('/forgot-password', Apiresponse(user.forgotPassword));
router.post('/logout', Apiresponse(user.logout));
router.get('/app-information', Apiresponse(user.appInfo));
router.get('/shop/listing', Apiresponse(ShopController.getShop));
router.post('/order', Apiresponse(ShopController.orderFurit));
router.get('/order', Apiresponse(ShopController.myOrders));
router.get(
	'/application/category',
	Apiresponse(CategoryController.appCategory)
);
router.get(
	'/category/:app_category_id([0-9]+)?',
	Apiresponse(CategoryController.categories)
);
router.get(
	'/sub-category/:category_id([0-9]+)',
	Apiresponse(CategoryController.subCategories)
);
router.get('/membership-plan', Apiresponse(CategoryController.memberShipPlan));
router.get('/payment-types', Apiresponse(CategoryController.paymentType));
router.get('/coupens', Apiresponse(CategoryController.coupons));
router.get('/gifts', Apiresponse(CategoryController.gifts));
router.get(
	'/order-details/:order_id([0-9]+)',
	Apiresponse(ShopController.orderDetails)
);
router.post('/do-payment', Apiresponse(ShopController.doPayment));
router.post('/accept-order', Apiresponse(ProductController.OrderAccept));
router.post('/complete-order', Apiresponse(DriverController.CompleteOrders));
router.post('/track-driver', Apiresponse(DriverController.TrackDriver));
router.get('/home', Apiresponse(ShopController.home));
router.get(
	'/product/:product_id([0-9]+)',
	Apiresponse(ProductController.productDetails)
);
router
	.route('/products')
	.get(Apiresponse(ProductController.getProduct))
	.post(Apiresponse(ProductController.addProduct))
	.put(Apiresponse(ProductController.updateProduct))
	.delete(Apiresponse(ProductController.deleteProduct));
router
	.route('/user/address')
	.get(Apiresponse(AddressController.allAddress))
	.post(Apiresponse(AddressController.addAddress))
	.put(Apiresponse(AddressController.updateAddress))
	.delete(Apiresponse(AddressController.deleteAddress));
router.get(
	'/user/address/:address_id([0-9]+)',
	Apiresponse(AddressController.details)
);
router.get(
	'/user/address/default',
	Apiresponse(AddressController.defaultAddress)
);
router
	.route('/rating')
	.get(Apiresponse(ShopController.getReview))
	.post(Apiresponse(ShopController.giveRating));

module.exports = router;
