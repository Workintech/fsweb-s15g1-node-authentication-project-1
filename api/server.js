const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

/**
  Kullanıcı oturumlarını desteklemek için `express-session` paketini kullanın!
  Kullanıcıların gizliliğini ihlal etmemek için, kullanıcılar giriş yapana kadar onlara cookie göndermeyin. 
  'saveUninitialized' öğesini false yaparak bunu sağlayabilirsiniz
  ve `req.session` nesnesini, kullanıcı giriş yapana kadar değiştirmeyin.

  Kimlik doğrulaması yapan kullanıcıların sunucuda kalıcı bir oturumu ve istemci tarafında bir cookiesi olmalıdır,
  Cookienin adı "cikolatacips" olmalıdır.

  Oturum memory'de tutulabilir (Production ortamı için uygun olmaz)
  veya "connect-session-knex" gibi bir oturum deposu kullanabilirsiniz.
 */

const server = express();

const authRouter = require("../api/auth/auth-router");
const userRouter = require("../api/users/users-router");

server.use(helmet());
server.use(express.json());
server.use(cors());

const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

server.use(
  session({
    name: "cikolatacips",
    secret: "secret_cikolatacips",
    cookie: {
      maxAge: 1000 * 60 * 60, //1 saat,ms cinsindendir
      secure: false, //http üzerinden iletilsin diye .env den alırız.
      httpOnly: false,
    },
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      knex: require("../data/db-config"),
      tablename: "sessions", //Kullanılacak tablo adı varsayılan session.
      sidfieldname: "sid", //Oturum kimliklerini depolamak için kullanılacak tablodaki alan adı
      createtable: true, //oturumlar için tablo otomatik olarak oluşturulmalı mı yoksa oluşturulmamalı mı
      clearInterval: 1000 * 60 * 60, //süresi dolmuş oturumları temizleme (milisaniye)
      disableDbCleanup: false,
    }),
  })
);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use("/api/users", userRouter);
server.use("/api/auth", authRouter);

server.use((err, req, res, next) => {
  // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
