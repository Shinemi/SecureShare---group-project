const fs = require('fs')
const os = require('os')
const path = require('path')
const sharp = require('sharp')
sharp.cache(false) // évite que Sharp garde les fichiers ouverts (verrou sous Windows)

// uuid v14 est un module ESM que Jest (CommonJS) ne sait pas charger : on le remplace
// par crypto.randomUUID(), qui produit le même format d'identifiant
jest.mock('uuid', () => ({ v4: () => require('crypto').randomUUID() }))
jest.mock('../models/imageModel', () => jest.fn())
const Image = require('../models/imageModel')
const { createImage, getImage } = require('../controllers/uploadController')

// faux objet res : status() renvoie res pour permettre res.status(400).json(...)
const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

const makeImage = (width, height) =>
  sharp({ create: { width, height, channels: 3, background: '#ff0000' } })
    .png()
    .toBuffer()

const makeReq = async (overrides = {}) => ({
  body: { title: 'Mon titre', description: 'Ma description' },
  file: { buffer: await makeImage(1600, 1000) },
  user: { _id: 'user123' },
  ...overrides,
})

// Le contrôleur écrit dans <cwd>/uploads/image : on se place dans un dossier temporaire
// pour ne pas polluer le vrai dossier uploads du projet.
let tmpDir
let originalCwd

beforeAll(() => {
  originalCwd = process.cwd()
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'secureshare-'))
  process.chdir(tmpDir)
})

afterAll(() => {
  process.chdir(originalCwd)
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
  } catch {
    // le dossier temporaire sera nettoyé par l'OS, ça ne doit pas faire échouer les tests
  }
})

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  // new Image(data) renvoie un objet dont save() renvoie le document enregistré
  Image.mockImplementation((data) => ({
    save: jest.fn().mockResolvedValue({ _id: 'img1', ...data }),
  }))
})

afterEach(() => console.error.mockRestore())

describe('createImage', () => {
  test('400 si le titre ou la description est manquant', async () => {
    const res = mockRes()
    await createImage(await makeReq({ body: { title: 'Titre seul' } }), res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test("400 si aucune image n'est envoyée", async () => {
    const res = mockRes()
    await createImage(await makeReq({ file: undefined }), res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test("401 si l'utilisateur n'est pas authentifié", async () => {
    const res = mockRes()
    await createImage(await makeReq({ user: undefined }), res)
    expect(res.status).toHaveBeenCalledWith(401)
  })

  test('201 : image redimensionnée à 800 px, convertie en webp et enregistrée', async () => {
    const res = mockRes()
    await createImage(await makeReq(), res)

    expect(res.status).toHaveBeenCalledWith(201)

    // le chemin enregistré en base est de la forme /uploads/image/<uuid>.webp
    const saved = res.json.mock.calls[0][0]
    expect(saved.image).toMatch(/^\/uploads\/image\/[0-9a-f-]{36}\.webp$/)
    expect(saved.title).toBe('Mon titre')

    // le fichier existe vraiment sur le disque, avec les bonnes caractéristiques
    const file = path.join(tmpDir, saved.image)
    expect(fs.existsSync(file)).toBe(true)
    const meta = await sharp(file).metadata()
    expect(meta.format).toBe('webp')
    expect(meta.width).toBe(800)
    expect(meta.height).toBe(500) // ratio 1600x1000 conservé
  })

  test("n'agrandit pas une image plus petite que 800 px", async () => {
    const res = mockRes()
    await createImage(await makeReq({ file: { buffer: await makeImage(400, 300) } }), res)

    const saved = res.json.mock.calls[0][0]
    const meta = await sharp(path.join(tmpDir, saved.image)).metadata()
    expect(meta.width).toBe(400)
  })

  test('deux uploads identiques reçoivent des noms de fichiers différents', async () => {
    const res1 = mockRes()
    const res2 = mockRes()
    await createImage(await makeReq(), res1)
    await createImage(await makeReq(), res2)

    expect(res1.json.mock.calls[0][0].image).not.toBe(res2.json.mock.calls[0][0].image)
  })

  test("500 si le fichier envoyé n'est pas une image valide", async () => {
    const res = mockRes()
    await createImage(await makeReq({ file: { buffer: Buffer.from('pas une image') } }), res)
    expect(res.status).toHaveBeenCalledWith(500)
  })
})

describe('getImage', () => {
  test('renvoie la liste des images', async () => {
    const images = [{ _id: '1' }, { _id: '2' }]
    Image.find = jest.fn().mockResolvedValue(images)
    const res = mockRes()

    await getImage({}, res)

    expect(res.json).toHaveBeenCalledWith(images)
  })

  test('500 si la base de données échoue', async () => {
    Image.find = jest.fn().mockRejectedValue(new Error('db down'))
    const res = mockRes()

    await getImage({}, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})