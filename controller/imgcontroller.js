const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const imageModel = require('../model/imgmodel');

router.get('/', (req, res) => {
    imageModel.find().exec((err, users) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('index', { title: 'Image upload', users: users });
        }
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var uploads = multer({
    storage: storage
}).single('image');

router.post('/basicInfo', uploads, (req, res) => {
    
    var imagedata = new imageModel({
        username: req.body.username,
        image: req.file.filename
    });

    var savedata = imagedata.save();
    if (savedata) {
        res.redirect('/');
    } else {
        res.json({ message: err.message });
    }
});

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    imageModel.findById(id, (err, users) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('edit', { title: 'Update image', users: users });
        }
    });
});

router.post('/updateInfo/:id', uploads, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    imageModel.findByIdAndUpdate(id, {
        username: req.body.username,
        image: new_image
    }, (err, users) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.redirect('/');
        }
    })
});

router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    imageModel.findByIdAndRemove(id, (err, users) => {
        if (users.image != '') {
            try {
                fs.unlinkSync('./uploads/' + users.image)
            } catch (err) {
                console.log(err);
            }
        }

        if (err) {
            res.json({ message: err.message });
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;