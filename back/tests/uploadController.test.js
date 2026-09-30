const sharp = require('sharp')
const { processImage } = require('../services/imageService')

const makeImage = (width, height) =>
  sharp({ create: { width, height, channels: 3, background: '#ff0000' } })
    .png()
    .toBuffer()

describe('processImage', () => {
  test('redimensionne à 800 px de large et convertit en webp', async () => {
    const { buffer, filename } = await processImage(await makeImage(1600, 1000))
    const meta = await sharp(buffer).metadata()

    expect(meta.format).toBe('webp')
    expect(meta.width).toBe(800)
    expect(meta.height).toBe(500)
    expect(filename).toMatch(/^[0-9a-f-]{36}\.webp$/)
  })

  test("n'agrandit pas une image plus petite que 800 px", async () => {
    const { buffer } = await processImage(await makeImage(400, 300))
    expect((await sharp(buffer).metadata()).width).toBe(400)
  })

  test('génère des noms de fichiers uniques', async () => {
    const input = await makeImage(100, 100)
    const a = await processImage(input)
    const b = await processImage(input)
    expect(a.filename).not.toBe(b.filename)
  })

  test("rejette un fichier qui n'est pas une image", async () => {
    await expect(processImage(Buffer.from('pas une image'))).rejects.toThrow()
  })
})