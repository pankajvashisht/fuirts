const EventEmitter = require('events');

class OrderEvent extends EventEmitter {}
module.exports = new OrderEvent();
