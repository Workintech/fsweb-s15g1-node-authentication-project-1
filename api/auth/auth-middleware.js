/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
const model = require("../users/users-model");
const bcrypt = require("bcryptjs")

function sinirli(req, res, next) {
  try {
    if (req.session && req.session.user_id) {
      next();
    } else {
      next({
        status: 401,
        message: "Geçemezsiniz!"
      })
    }
  } catch (error) {
    next(error);

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
  try {
    const userExist = await model.goreBul({ username: req.body.username });
    if (userExist && userExist.length > 0) {
      next({
        status: 422,
        message: "Username kullaniliyor"
      })
    } else {
      next();
    }
  } catch (error) {
    next(error);

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
  try {
    let hashedPassword = bcrypt.hashSync(req.body.password);
    const userExist = await model.goreBul({ username: req.body.username, password: req.body.password });
    if (!userExist || userExist.length == 0) {
      next({
        status: 401,
        message: "Geçersiz kriter"
      })
    } else {
      req.user = userExist;
      next();
    }
  } catch (error) {
    next(error);

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
  try {
    if (!req.body.password || req.body.password.length < 3) {
      next({
        status: 422,
        message: "Şifre 3 karakterden fazla olmalı"
      })
    } else {
      next();
    }
  } catch (error) {
    next(error);

  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = { sifreGecerlimi, usernameVarmi, usernameBostami, sinirli }