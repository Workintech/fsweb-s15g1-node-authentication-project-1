/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  durum 401
  {
    "mesaj": "Geçemezsiniz!"
  }
*/
function sinirli() {

}

/*
  req.body de verilen username halihazırda veritabanında varsa

  durum 422
  {
    "mesaj": "Username kullaniliyor"
  }
*/
function usernameBostami() {

}

/*
  req.body de verilen username veritabanında yoksa

  durum 401
  {
    "mesaj": "Geçersiz kriter"
  }
*/
function usernameVarmi() {

}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  durum 422
  {
    "mesaj": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi() {

}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
