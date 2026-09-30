jest.mock('../models/userModel')
const User = require('../models/userModel')
const { register, login } = require('../controllers/authController')

// faux objet res : status() renvoie res pour permettre res.status(400).json(...)
const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const validBody = { name: 'Lucas', email: 'lucas@test.com', password: 'Abcdef1!' }

beforeEach(() => jest.resetAllMocks())

describe('register', () => {
  test('400 si des champs sont manquants', async () => {
    const res = mockRes()
    await register({ body: { email: 'a@b.com' } }, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('400 si le mot de passe est trop faible', async () => {
    const res = mockRes()
    await register({ body: { ...validBody, password: 'abc' } }, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test("400 si l'email est invalide", async () => {
    const res = mockRes()
    await register({ body: { ...validBody, email: 'pas-un-email' } }, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test("400 si l'email est déjà utilisé", async () => {
    User.findOne.mockResolvedValue({ _id: '1' })
    const res = mockRes()
    await register({ body: validBody }, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('201 et token si tout est valide', async () => {
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue({ _id: '1', name: 'Lucas', email: 'lucas@test.com' })
    const res = mockRes()

    await register({ body: validBody }, res)

    expect(res.status).toHaveBeenCalledWith(201)
    const payload = res.json.mock.calls[0][0]
    expect(payload.token).toEqual(expect.any(String))
    expect(payload.user.password).toBeUndefined()
  })
})

describe('login', () => {
  const mockFind = (user) =>
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) })

  test('400 si email ou mot de passe manquant', async () => {
    const res = mockRes()
    await login({ body: { email: 'a@b.com' } }, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('401 si utilisateur inconnu', async () => {
    mockFind(null)
    const res = mockRes()
    await login({ body: validBody }, res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  test('401 si mauvais mot de passe', async () => {
    mockFind({ _id: '1', comparePassword: jest.fn().mockResolvedValue(false) })
    const res = mockRes()
    await login({ body: validBody }, res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  test('200 et token si identifiants corrects', async () => {
    mockFind({
      _id: '1',
      name: 'Lucas',
      email: 'lucas@test.com',
      comparePassword: jest.fn().mockResolvedValue(true),
    })
    const res = mockRes()

    await login({ body: validBody }, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json.mock.calls[0][0].token).toEqual(expect.any(String))
  })
})