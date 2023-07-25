// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
const bcrypt = require('bcryptjs');
const { usernameBostami, sifreGecerlimi, usernameVarmi } = require('./auth-middleware');
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const router = require('express').Router();
const User = require('../users/users-model');

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */
router.post('/register', usernameBostami, sifreGecerlimi, async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await User.ekle({ username: username, password: req.hashedPassword })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
});


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */
router.post('/login', usernameVarmi, (req, res, next) => {
  const { password } = req.body;
  try {
    if (req.user && bcrypt.compareSync(password, req.user.password)) {
      req.session.user = req.user;
      console.log(req.session.user);
      res.status(200).json({ message: `Hoşgeldin ${req.user.username}` });
    } else {
      res.status(401).json({ "message": "Geçersiz kriter!" });
    }
  } catch (error) {
    console.log(error);
    next(error)
  }
});

/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */
router.get('/logout', (req, res, next) => {
  if (req.session && req.session.user) {
    req.session.destroy(error => {
      if (error) {
        next({ message: 'Oturum termine edilirken hata oluştu' });
      } else {
        //res.set('Set-Cookie', `cikolatacips=; Path=/; Expires=Mon, 01 Jan 1970 00:00:19 GMT`)
        res.json({ "message": "Çıkış yapildi" });
      }
    })
  } else {
    res.status(400).json({ "message": "Oturum bulunamadı!" });
  }
})

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
module.exports = router