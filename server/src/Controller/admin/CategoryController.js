const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const app = require('../../../libary/CommanMethod');
let apis = new ApiController();
let DB = new Db();

module.exports = {
	allCategory: async (Request) => {
		let offset = Request.params.offset || 1;
		const limit = Request.params.limit || 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` where name like '%${q}%'`;
		}
		const query = `select * from categories ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from categories ${conditions}`;
		const result = {
			pagination: await apis.Paginations(total, offset, limit),
			result: app.addUrl(await DB.first(query), 'image'),
		};
		return result;
	},
	addCategory: async (Request) => {
		const { body } = Request;
		delete body.image;
		if (Request.files && Request.files.image) {
			body.image = await app.upload_pic_with_await(Request.files.image);
		}
		return await DB.save('categories', body);
	},
	allSubCategories: async (Request) => {
		let offset = Request.params.offset || 1;
		const limit = Request.params.limit || 20;
		const category_id = Request.query.category_id || 0;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` where sub_categories.name like '%${q}%' or categories.name like '%${q}%' `;
		}
		if (parseInt(category_id) !== 0) {
			if (conditions) {
				conditions += ` and category_id = ${category_id}`;
			} else {
				conditions += ` where category_id = ${category_id}`;
			}
		}
		const query = `select sub_categories.*,categories.name as category_name  from sub_categories join categories on (sub_categories.category_id = categories.id)  ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from sub_categories join categories on (sub_categories.category_id = categories.id) ${conditions}`;
		const result = {
			pagination: await apis.Paginations(total, offset, limit),
			result: app.addUrl(await DB.first(query), 'image'),
		};
		return result;
	},
	addSubCategory: async (Request) => {
		const { body } = Request;
		delete body.image;
		if (Request.files && Request.files.image) {
			body.image = await app.upload_pic_with_await(Request.files.image);
		}
		return await DB.save('sub_categories', body);
	},
};
