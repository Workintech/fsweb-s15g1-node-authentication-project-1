// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  durum 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  durum 422
  {
    "mesaj": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  durum 422
  {
    "mesaj": "Şifre 3 karakterden fazla olmalı"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  durum 200
  {
    "mesaj": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  durum 401
  {
    "mesaj": "Geçersiz kriter"
  }
 */


/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  durum 200
  {
    "mesaj": "çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  durum 200
  {
    "mesaj": "oturum bulunamadı"
  }
 */

 
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
