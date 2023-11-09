import express = require("express");
import { Request, Response } from "express"
import { dataSource } from "./app-data-source"
import path = require("path");
import { Record } from "./entity/record";
import { toBinary } from "./to-binary";
import expressSession = require('express-session');
import cookieParser = require("cookie-parser");
import qs = require("qs");
import { In } from "typeorm";

const PASSWORD = toBinary('я аліна а ти')

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })

const app = express()
app.use(express.json())
app.use(cookieParser('keyboard cat'));
app.use(expressSession({ secret: 'keyboard cat' }));
app.use('/client', express.static(path.resolve(__dirname, '..', 'client')));
app.use('/images', express.static(path.resolve(__dirname, '..', 'images')));
app.use('/app', (req: Request, res: Response, next: express.NextFunction) => {
  if (req.session['isAuthorised']) {
    next();
  } else {
    res.redirect(`/password?next=${req.originalUrl}`);
  }
});

app.set('query parser', (str) => {
  return qs.parse(str, { comma: true });
});

app.get('/api/login', (req: Request, res: Response) => {
  if (req.headers['authorization'] === PASSWORD) {
    req.session['isAuthorised'] = true;
    const next = req.session['next-after-password'];
    delete req.session['next-after-password'];
    res.status(200).send({ next });
  } else {
    res.status(401).send();
  }
})

app.get('/api/log', (req: Request, res: Response) => {
  dataSource.getRepository(Record).find().then((records) => {
    res.send(records);
  });
});

function getApp(req: Request, res: Response) {
  res.sendFile('index.html', {root: path.resolve('./client/app/')}, (err) => {
    res.end();
    if (err) throw(err);
  });
}

app.get('/app', getApp);
app.get('/app/details/*', getApp);

app.get('/app/unlock/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  let ids = []
  let redirect = '/app'
  if (id == '797f8a71-8627-4a74-863d-9527a8aa5134') {
    ids = [3, 4]
  } else if (id == 'cdb1019d-38c2-4228-a9aa-de18fd71dbc8') {
    ids = [5, 6];
  } else if (id == '4e7d75fb-6997-4d2f-9cc4-750c5aefd674') {
    ids = [7, 8];
  } else if (id == '4d7e7fb9-11be-4232-9113-767005312278') {
    ids = [9, 10];
  } else if (id == '7d2f83e2-d671-4585-81f6-88f133a52595') {
    ids = [11, 12, 13];
  } else if (id =='7f575b16-9bba-476c-bc76-5bb30ba183c3') {
    ids = [14, 15, 16];
  }
  
  const recordRepository = dataSource.getRepository(Record);
  recordRepository.find({ where: { id: In(ids) } }).then((records) => {
    records.forEach((record) => {
      record.unlocked = true;
    });
    recordRepository.save(records).then(() => {
      res.redirect(redirect);
    });
  });
});

app.get(['/'], (req: Request, res: Response) => {
  res.redirect('/app');
});


app.get('/password', (req: Request, res: Response) => {
  const fileDirectory = path.resolve('./client/un-authorised/');
  req.session['next-after-password'] = req.query.next;

  res.sendFile('index.html', {root: fileDirectory}, (err) => {
    res.end();

    if (err) throw(err);
  });
})

app.get('/favicon.ico', (req: Request, res: Response) => {
  res.sendFile('favicon.ico', {root: path.resolve('./client/')}, (err) => {
    res.end();
    if (err) throw(err);
  });
})

app.listen(3000)