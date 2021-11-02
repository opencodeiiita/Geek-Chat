const express= require("express")
const router =express.Router();
const path=require("path");
const fs = require('fs')
const multer  = require('multer');
let uniqueSuffix;
let cnt = fs.readdirSync('./public/avtars').length + 1;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/avtars')
  },
  filename: function (req, file, cb) {
    cnt = fs.readdirSync('./public/avtars').length + 1;
    let extn = file.originalname.split('.');
    uniqueSuffix = cnt + '.'+extn[extn.length - 1];
    cb(null, uniqueSuffix );
    
  }
});
const upload = multer({ storage: storage })

router.post('/image', (req, res) => {
    if (!req.files) {
      return res.json({success:false})
    }
    const image = req.files.image;
    const len = image.name.split('.').length-1;
    const name = (new Date().getTime()) + '.' + image.name.split('.')[len]
    image.mv(path.join(__dirname, "public/uploads", name))
    return res.json({success:true, link: `/uploads/`+name});
  })
  
  router.post('/newAvatar', upload.single('avatar'), function (req, res, next) {
      res.send(uniqueSuffix.toString());
  })
  
module.exports=router