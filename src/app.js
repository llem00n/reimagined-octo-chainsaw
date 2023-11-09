"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app_data_source_1 = require("./app-data-source");
var path = require("path");
var record_1 = require("./entity/record");
var to_binary_1 = require("./to-binary");
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");
var qs = require("qs");
var typeorm_1 = require("typeorm");
var PASSWORD = (0, to_binary_1.toBinary)('я аліна а ти');
app_data_source_1.dataSource
    .initialize()
    .then(function () {
    console.log("Data Source has been initialized!");
})
    .catch(function (err) {
    console.error("Error during Data Source initialization:", err);
});
var app = express();
app.use(express.json());
app.use(cookieParser('keyboard cat'));
app.use(expressSession({ secret: 'keyboard cat' }));
app.use('/client', express.static(path.resolve(__dirname, '..', 'client')));
app.use('/images', express.static(path.resolve(__dirname, '..', 'images')));
app.use('/app', function (req, res, next) {
    if (req.session['isAuthorised']) {
        next();
    }
    else {
        res.redirect("/password?next=".concat(req.originalUrl));
    }
});
app.set('query parser', function (str) {
    return qs.parse(str, { comma: true });
});
app.get('/api/login', function (req, res) {
    if (req.headers['authorization'] === PASSWORD) {
        req.session['isAuthorised'] = true;
        var next = req.session['next-after-password'];
        delete req.session['next-after-password'];
        res.status(200).send({ next: next });
    }
    else {
        res.status(401).send();
    }
});
app.get('/api/log', function (req, res) {
    app_data_source_1.dataSource.getRepository(record_1.Record).find().then(function (records) {
        res.send(records);
    });
});
function getApp(req, res) {
    res.sendFile('index.html', { root: path.resolve('./client/app/') }, function (err) {
        res.end();
        if (err)
            throw (err);
    });
}
app.get('/app', getApp);
app.get('/app/details/*', getApp);
app.get('/app/unlock/:id', function (req, res) {
    var id = req.params.id;
    var ids = [];
    var redirect = '/app';
    if (id == '797f8a71-8627-4a74-863d-9527a8aa5134') {
        ids = [3, 4];
    }
    else if (id == 'cdb1019d-38c2-4228-a9aa-de18fd71dbc8') {
        ids = [5, 6];
    }
    else if (id == '4e7d75fb-6997-4d2f-9cc4-750c5aefd674') {
        ids = [7, 8];
    }
    else if (id == '4d7e7fb9-11be-4232-9113-767005312278') {
        ids = [9, 10];
    }
    else if (id == '7d2f83e2-d671-4585-81f6-88f133a52595') {
        ids = [11, 12, 13];
    }
    else if (id == '7f575b16-9bba-476c-bc76-5bb30ba183c3') {
        ids = [14, 15, 16];
    }
    var recordRepository = app_data_source_1.dataSource.getRepository(record_1.Record);
    recordRepository.find({ where: { id: (0, typeorm_1.In)(ids) } }).then(function (records) {
        records.forEach(function (record) {
            record.unlocked = true;
        });
        recordRepository.save(records).then(function () {
            res.redirect(redirect);
        });
    });
});
app.get(['/'], function (req, res) {
    res.redirect('/app');
});
app.get('/password', function (req, res) {
    var fileDirectory = path.resolve('./client/un-authorised/');
    req.session['next-after-password'] = req.query.next;
    res.sendFile('index.html', { root: fileDirectory }, function (err) {
        res.end();
        if (err)
            throw (err);
    });
});
app.get('/favicon.ico', function (req, res) {
    res.sendFile('favicon.ico', { root: path.resolve('./client/') }, function (err) {
        res.end();
        if (err)
            throw (err);
    });
});
app.listen(3000);
