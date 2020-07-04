const UserController = require('./UserController');
const ProductController = require('./ProductController');
const ShopController = require('./ShopController');
const DriverController = require('./DriverController');
const PaymentController = require('./PaymentController');
const CategoryController = require('./CategoryController');
const AddressController = require('./AddressController');
const NotificationController = require('./NotificationController');
const OrderController = require('./OrderController');
const ApiController = require('./ApiController');
const Helper = new ApiController();
module.exports = {
	UserController,
	ProductController,
	DriverController,
	ShopController,
	PaymentController,
	CategoryController,
	AddressController,
	NotificationController,
	Helper,
	OrderController,
};
