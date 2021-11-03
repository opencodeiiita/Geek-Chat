const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const avatarsDirectory = path.join(__dirname, '../public/avtars'),
    uploadsDirectory = path.join(__dirname, '../public/uploads');

function getAvatarIndex() {
    return fs.readdirSync(avatarsDirectory).length + 1;
}

router.post('/image', (req, res) => {
    if (!req.files || !req.files.image) return res.json({ success: false });

    const image = req.files.image;
    const pieces = image.name.split('.');
    const filename = `${new Date().getTime()}.${pieces[pieces.length - 1]}`;

    image.mv(path.join(uploadsDirectory, filename));
    return res.json({ success: true, link: `/uploads/${filename}` });
});

router.post('/newAvatar', (req, res) => {
    if (!req.files || !req.files.avatar) return res.status(400).send(null);

    const avatar = req.files.avatar;
    const pieces = avatar.name.split('.');
    const filename = `${getAvatarIndex()}.${pieces[pieces.length - 1]}`;

    avatar.mv(path.join(avatarsDirectory, filename));
    res.send(filename);
});

module.exports = router;
