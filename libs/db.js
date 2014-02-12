/**
 * Модуль подлючения к базе данных, также описывает модель данных
 * Используется модуль Mongoose
 * Created by InTheWeb on 10.02.14.
 */
var mongoose    = require('mongoose');
var config      = require('./config');
var crypto = require("crypto");

//Подключение к базе данных
mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;
db.on('error', function (err) {
    console.error('db connection error:', err.message);
});
db.once('open', function callback () {
    console.info("Connected to DB!");
});

// Описываем модели
var Schema = mongoose.Schema;
var goodsSchema = new Schema({
    id: {
        type: String,
        default: function () {
            return crypto.randomBytes(10).toString('hex')
        },
        index: true
    },
    name: String,
    price: Number,
    img: String,
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: null, index: true },
    stock: Number
});
var Goods = mongoose.model('Goods', goodsSchema);
module.exports.Goods = Goods;
