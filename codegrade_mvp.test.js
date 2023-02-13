const request = require('supertest')
const server = require('./api/server')
const db = require('./data/db-config')
const setCookie = require('set-cookie-parser')
const bcrypt = require('bcryptjs')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

it('[0] sanity check', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  describe('[POST] /api/auth/login', () => {
    it('[1] geçerli kriterlerle doğru mesajı içeriyor', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      expect(res.body.message).toMatch(/geldin bob/i)
    }, 750)
    it('[2] kriterler geçerliyse "cikolatacips" cookiesi seçiliyor', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      const cookies = setCookie.parse(res, { map: true })
      expect(cookies.cikolatacips).toMatchObject({ name: 'cikolatacips' })
    }, 750)
    it('[3] kriterler geçersizse cookie seçilmiyor (saveUninitialized=false)', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: 'lady gaga' })
      const cookies = setCookie.parse(res, { map: true })
      expect(cookies).toEqual({}) // no SET-COOKIE
    }, 750)
    it('[4] kriterler geçersizken doğru mesaj döndürülüyor', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bobsy', password: '1234' })
      expect(res.body.message).toMatch(/ersiz kriter/i)
      res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '12345' })
      expect(res.body.message).toMatch(/ersiz kriter/i)
    }, 750)
  })
  describe('[POST] /api/auth/register', () => {
    it('[5] veritabanında yeni kullanıcı oluşturulabiliyor', async () => {
      await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
      const sue = await db('users').where('username', 'sue').first()
      expect(sue).toMatchObject({ username: 'sue' })
    }, 750)
    it('[6] kullanıcı parolaları başarılı kriptolanıyor', async () => {
      await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
      const sue = await db('users').where('username', 'sue').first()
      expect(bcrypt.compareSync('1234', sue.password)).toBeTruthy()
    }, 750)
    it('[7] kayıtta cookie seçilmiyor (saveUninitialized=false)', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
      const cookies = setCookie.parse(res, { map: true })
      expect(cookies).toEqual({}) // no SET-COOKIE
    }, 750)
    it('[8] kullanıcı nesnesi cevap veriliyor (user_id ve username)', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'sue', password: '1234' })
      expect(res.body).toMatchObject({ user_id: 2, username: 'sue' })
    }, 750)
    it('[9] username kullanımdaysa doğru mesaj', async () => {
      const res = await request(server).post('/api/auth/register').send({ username: 'bob', password: '1234' })
      expect(res.status).toBe(422)
      expect(res.body.message).toMatch(/Username kullaniliyor/i)
    }, 750)
    it('[10] kısa şifre girildiyse doğru mesaj ve durum kodu', async () => {
      let res = await request(server).post('/api/auth/register').send({ username: 'sue' })
      expect(res.status).toBe(422)
      expect(res.body.message).toMatch(/ 3 karakterden fazla/i)
      res = await request(server).post('/api/auth/register').send({ username: 'sue', password: '1' })
      expect(res.status).toBe(422)
      expect(res.body.message).toMatch(/ 3 karakterden fazla/i)
    }, 750)
  })
  describe('[GET] /api/auth/logout', () => {
    it('[11] oturum varsa yok ediliyor "cikolatacips" cookiesi artık etkisiz', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      const { cikolatacips } = setCookie.parse(res, { map: true })
      res = await request(server).get('/api/auth/logout')
        .set('Cookie', `${cikolatacips.name}=${cikolatacips.value}`)
      expect(res.body.message).toMatch(/yapildi/i)
      res = await request(server).get('/api/users')
        .set('Cookie', `${cikolatacips.name}=${cikolatacips.value}`)
      expect(res.body.message).toMatch(/Geçemezsiniz!/i)
    }, 750)
    it('[12] kullanıcı giriş yapmdıysa doğru mesaj', async () => {
      let res = await request(server).get('/api/auth/logout')
      expect(res.body.message).toMatch(/Oturum bulunamadı!/i)
    }, 750)
  })
  describe('[GET] /api/users', () => {
    it('[13] kullanıcı giriş yapmadıysa doğru mesaj ve durum kodu', async () => {
      const res = await request(server).get('/api/users')
      expect(res.status).toBe(401)
      expect(res.body.message).toMatch(/Geçemezsiniz!/i)
    }, 750)
    it('[14] oturumla eşleşen bir "cikolatacips" cookiesi varsa ', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'bob', password: '1234' })
      const { cikolatacips } = setCookie.parse(res, { map: true })
      res = await request(server).get('/api/users')
        .set('Cookie', `${cikolatacips.name}=${cikolatacips.value}`)
      expect(res.body).toMatchObject([{ user_id: 1, username: 'bob' }])
    }, 750)
  })
})
