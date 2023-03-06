/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
const db = require("../../data/db-config");

async function bul() {

  let allUsers = await db("users");
  let responseListUsers = allUsers.map((user) => {
    return { user_id: user.user_id, username: user.username }
  });
  return responseListUsers
};

/** 
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */   //örnek filtre:{username:hilal,password:1234}
async function goreBul(filtre) {
  let filteredUserList = await db("users").where(filtre).map((user) => {
    return { user_id: user.user, username: user.username }
  });
  return filteredUserList;

}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  let user = await db("users").where("user_id", user_id).first();
  return { user_id: user.user_id, username: user.username };


}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  let insertedUserId = await db("users").insert(user);
  let insertedUser = await idyeGoreBul(insertedUserId);
  return insertedUser;
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  bul, goreBul, idyeGoreBul, ekle

}