const EventEmitter = require('events');
class OrderEvent extends EventEmitter {}
const emmiter = new OrderEvent();
emmiter.setMaxListeners(0);
module.exports = emmiter;
