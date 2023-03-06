/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
const db = require("../../data/db-config");

function bul() {
  return db("users").select("user_id", "username");
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
function goreBul(filtre) {
  return db("users").where(filtre);
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
function idyeGoreBul(user_id) {
  return db("users").where("user_id", user_id).first();
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
async function ekle(user) {
  const [id] = await db("users").insert(user);
  const newUser = await idyeGoreBul(id);
  return { user_id: newUser.user_id, username: newUser.username };
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
};
