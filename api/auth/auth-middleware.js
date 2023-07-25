const bcrypt = require('bcryptjs');
const User = require('../users/users-model');
const { HASH_ROUND } = require('../../config/config');
/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli(req, res, next) {
  if (!req.session || !req.session.user) {
    res.status(401).json({ "message": "Geçemezsiniz!" })
  } else {
    next();
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req, res, next) {
  const { username } = req.body;
  const [user] = await User.goreBul({ username: username })
  if (user) {
    res.status(422).json({ "message": "Username kullaniliyor" });
  } else {
    next();
  }
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req, res, next) {
  const { username } = req.body;
  const [user] = await User.goreBul({ username: username })
  if (!user) {
    res.status(401).json({ "message": "Geçersiz kriter" })
  } else {
    req.user = user;
    next();
  }
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req, res, next) {
  const { password } = req.body;
  if (!password || password.length < 3) {
    res.status(422).json({ "message": "Şifre 3 karakterden fazla olmalı" })
  } else {
    const hashedPassword = bcrypt.hashSync(password, HASH_ROUND);
    req.hashedPassword = hashedPassword;
    next();
  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  sinirli,
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi
}