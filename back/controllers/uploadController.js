const sharp = require('sharp')
const path = require('path')
const fs = require('fs/promises')
const Image = require('../models/imageModel')
const { v4: uuidv4 } = require('uuid')

exports.createImage = async (req, res) => {
    try {
        const { title, description } = req.body

        // Vérification des données
        if (!title || !description) {
            return res.status(400).json({
                message: 'Title and description are required'
            })
        }

        // Vérification du fichier
        if (!req.file) {
            return res.status(400).json({
                message: 'Image is required'
            })
        }

        if (!req.user?._id) {
            return res.status(401).json({ 
                message: 'User not authenticated' 
            }) 
        }

        // Dossier de destination
        const uploadFolder = path.join(
            process.cwd(),
            'uploads',
            'image'
        )

        await fs.mkdir(uploadFolder, {
            recursive: true
        })

        // Nom unique
        const filename = `${uuidv4()}.webp`

        const outputPath = path.join(
            uploadFolder,
            filename
        )

        // Traitement + sauvegarde de l'image
        await sharp(req.file.buffer)
            .resize({
                width: 800,
                withoutEnlargement: true
            })
            .webp({
                quality: 80
            })
            .toFile(outputPath)

        // Chemin qui sera enregistré en BDD
        const imagePath = `/uploads/image/${filename}`

        // Création en BDD
        const image = new Image({
            title,
            description,
            image: imagePath,
            idUser: req.user._id
        })

        const newImage = await image.save()

        return res.status(201).json(newImage)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

exports.getImage = async (req, res) => {
    try {
        
        const img = await Image.find()
        res.json(img)

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}