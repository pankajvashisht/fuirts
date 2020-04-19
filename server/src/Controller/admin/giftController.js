const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const app = require('../../../libary/CommanMethod');
let apis = new ApiController();
let DB = new Db();

module.exports = {
	allGifts: async (Request) => {
		let offset = Request.params.offset || 1;
		const limit = Request.params.limit || 20;
		const types = Request.query.types || 1;
		offset = (offset - 1) * limit;
		let conditions = `where is_free = ${types}`;
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` and name like '%${q}%'`;
		}
		const query = `select * from coupons ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from coupons ${conditions}`;
		const result = {
			pagination: await apis.Paginations(total, offset, limit),
			result: await DB.first(query),
		};
		return result;
	},
	addGifts: async (Request) => {
		const { body } = Request;
		if (body.start_time) {
			body.start_time = app.UnixTimeStamp(body.start_time);
		}
		if (body.end_time) {
			body.end_time = app.UnixTimeStamp(body.end_time);
		}
		return await DB.save('coupons', body);
	},
};
