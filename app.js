var express = require('express');
var path = require('path'); // модуль для парсинга пути
var config = require('./libs/config');
var db = require('./libs/db');
var Goods = db.Goods;
var app = express();

//Config
app.set('port', process.env.PORT || 3000); //рабочий порт
app.set('views', path.join(__dirname, 'views')); //директория с шаблонами
app.set('view engine', 'hjs'); //шаблонизатор - Hogan
app.use(express.favicon()); // отдаем стандартную фавиконку
app.use(express.logger('dev')); // выводим все запросы со статусами в консоль
app.use(express.json()); // стандартный модуль, для парсинга JSON в запросах
app.use(express.urlencoded()); //разбор urlencoded-запросов
app.use(app.router); //модуль расширенного обработчиков путей
app.use(express.static(path.join(__dirname, "public"))); //запуск статического файлового сервера
app.use(require('less-middleware')({ src: __dirname + '/public' }));

//Маршрутизация
app.get('/', function(req,res){

    Goods.find().sort('modifiedAt').limit(20).exec(function (err, models) {
        console.log(models);
        res.render('index', { models: models });
    });

});
app.get('/new/:name/:price', function(req,res) {
    var good = new Goods({
        name: req.params.name,
        price: req.params.price,
        modifiedAt: Date.now()
    });
    good.save();
    var id = good._id;
    res.render('index', { title: 'OK: ' + id });
});
app.get('/api', function (req, res) {
    res.send('API is running');
});

app.get('/fill', function(req, res) {
    var fill = require('./routes/fill');
    fill.index(req,res);
});

//Запуск сервера
app.listen(config.get('port'), function(){
    console.info('Express server listening on port ' + config.get('port'));
});