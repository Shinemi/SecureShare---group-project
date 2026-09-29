const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../middlewares/multerMiddleware')
const { uploadImage, createImage } = require('../controllers/uploadController')

router.post('/create', authMiddleware, createImage)
router.post('/:idImage', authMiddleware, upload, uploadImage)

module.exports = router