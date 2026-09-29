const sharp = require('sharp')
const path = require('path')
const fs = require('fs/promises')
const Image = require('../models/imageModel')
const { v4: uuidv4 } = require('uuid')

exports.createImage = async (req, res) => {
    try {
        const { title, description, img } = req.body

        if (!title || !description || !img) {
            return res.status(404).json({ message: 'You must provide title, description and img' })
        }

        const image = new Image({
            title,
            description,
            img,
            idUser: req.user._id
        })

        const newImage = await image.save()
        res.status(201).json(newImage)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file)
            return res.status(404).json({ message: "Image not found" })

        const filename = `${uuidv4()}.webp`

        const outputPath = path.join(__dirname, '../uploads', filename)

        await sharp(req.file.buffer)
            .resize({
                width: 1200,
                withoutEnlargement: true
            })
            .webp({
                quality: 80
            })
            .toFile(outputPath)


        const uploadFolder = path.join(
            process.cwd(),
            'upload',
            'image'
        )

        await fs.mkdir(uploadFolder, {
            recursive: true
        })

        return res.status(201).json({
            message: 'Image enregistrée avec succès',
            filename
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: 'Error updating the image'
        })
    }
}