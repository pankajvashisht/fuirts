const express = require('express');
const router = express.Router();
const {
	adminController,
	GiftController,
	MemberShipController,
	CategoryController,
} = require('../src/Controller/admin/index');
const { cross, AdminAuth } = require('../src/middleware/index');
const response = require('../libary/Response');
const { login } = require('../src/Request/adminRequest');
let admin = new adminController();

router.use([cross, AdminAuth]);
router.get('/', function (req, res) {
	res.json(' APi workings ');
});
router.post('/login', login, admin.login);
router.post('/send-push', response(admin.Notification));
router.get('/dashboard', response(admin.dashboard));
router.put('/update-status', response(admin.updateData));
router
	.route('/users/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.allUser))
	.post(response(admin.addUser))
	.put(response(admin.addUser))
	.delete(response(admin.deleteData));

router
	.route('/gifts/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(GiftController.allGifts))
	.post(response(GiftController.addGifts))
	.put(response(GiftController.addGifts))
	.delete(response(admin.deleteData));

router
	.route('/membership-plan/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(MemberShipController.allMemberShip))
	.post(response(MemberShipController.addMemberShipPlan))
	.put(response(MemberShipController.addMemberShipPlan))
	.delete(response(admin.deleteData));
router
	.route('/payment-types/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(MemberShipController.allPaymentsTypes))
	.post(response(MemberShipController.addPaymentTypes))
	.put(response(MemberShipController.addPaymentTypes))
	.delete(response(admin.deleteData));

router
	.route('/category/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(CategoryController.allCategory))
	.post(response(CategoryController.addCategory))
	.put(response(CategoryController.addCategory))
	.delete(response(admin.deleteData));

router
	.route('/sub-category/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(CategoryController.allSubCategories))
	.post(response(CategoryController.addSubCategory))
	.put(response(CategoryController.addSubCategory))
	.delete(response(admin.deleteData));

router
	.route('/driver/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.allUser))
	.post(response(admin.addUser))
	.put(response(admin.addUser))
	.delete(response(admin.deleteData));
router
	.route('/farmer/:offset([0-9]+)?/:limit([0-9]+)?')
	.get(response(admin.allFarmer))
	.delete(response(admin.deleteData));

router.get(
	'/products/:offset([0-9]+)?/:limit([0-9]+)?',
	response(admin.getProducts)
);
router.get(
	'/orders/:offset([0-9]+)?/:limit([0-9]+)?',
	response(admin.getOrders)
);
router.post('/admin-profile', response(admin.adminProfile));

router
	.route('/appInfo/')
	.get(response(admin.appInfo))
	.put(response(admin.updateData));

module.exports = router;
