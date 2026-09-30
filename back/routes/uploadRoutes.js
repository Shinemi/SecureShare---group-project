const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const upload = require('../middlewares/multerMiddleware')
const { createImage, getImage } = require('../controllers/uploadController')

router.post('/create', authMiddleware, upload, createImage)
router.get('/get', authMiddleware, getImage)

module.exports = router