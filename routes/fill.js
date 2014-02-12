/*
 * Заполнение БД тестовыми данными
 * В качестве источника использован CSV файл с обувью проекта CityBoots
 * При разборе использован модуль Node-CSV http://www.adaltas.com/projects/node-csv/from.html
 */

var db = require('../libs/db'),
    Goods = db.Goods;

exports.index = function(req, res){

    Goods.remove({}, function (err) {
        if (err) {
            console.error('Error truncating database', err);
        } else {
            console.info('Database truncated');
        }
    });

    //http://cityboots.ru/export.google.merchants.php
    console.log('Downloading CSV file');
    var http = require('http');
    http.get("http://cityboots.ru/export.google.merchants.php",function (data) {
        console.log("HTTP Responce code: " + data.statusCode);
        var csvString = '';
        data.on('data',function (chunk) {
            csvString += chunk;
        }).on('end', function () {
            console.log('CSV File recieved: ' + csvString.length);
            var csv = require('csv');
            csv().from.string(csvString, { delimiter: "\t"  })
            .to.array( function(data){
                for(var i = 1; i <= 1000; i++) {
                    if(typeof data[i] == 'undefined') continue;
                    console.log(i);
                    var modelData = data[i];
                    var good = new Goods({
                        name: modelData[1] + ' ' + modelData[2],
                        price: modelData[11],
                        img: modelData[7].substr(modelData[7].lastIndexOf('/') + 1)
                    });
                    good.save();
                }
                res.send('OK!');
            });
        });
    }).on('error', function (e) {
        console.log("Error getting CSV file: " + e.message);
    });
};