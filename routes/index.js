const express= require("express")
const router = express.Router();
const path = require("path");
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const { usersArr, currentUserData } = require("../utils/users");

router.get("/", (req, res) => {
    // rendering main.html
    res.sendFile(path.join(__dirname , "../views/index.html"));
});

router.post("/", async(req, res) => {
    // RECAPTCHA SERVER SIDE
   if (!req.body['g-recaptcha-response'])
      return res.sendFile(path.join(__dirname , "../views/index.html"));
    // Secret key
    const secretKey = '6Lc20uYcAAAAANeXi5yv3q_YTMsN3J8NTHUcpmD5';
    // Verify URL
    const query = stringify({
      secret: secretKey,
      response: req.body['g-recaptcha-response'],
      remoteip: req.connection.remoteAddress
    });
    const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
    // Make a request to verifyURL
    const body = await fetch(verifyURL).then(resp => resp.json());
    // If not successful
   if (body.success !== undefined && !body.success)  return res.sendFile(path.join(__dirname, " ../views/index.html"));
    // If successful
    // return res.json({ success: true, msg: 'Captcha passed' });

    let { usrnm, room, profilePhoto } = currentUserData;

    currentUserData.usrnm = req.body.usrnm;
    currentUserData.room = req.body.room;
    currentUserData.profilePhoto = req.body.imageUrl;

    if (
      usersArr.find((user) => {
        if (user.name === usrnm && user.room === room) return true;
      })
    ) {
      return res.sendFile(path.join(__dirname , "../views/index.html"));
    }
    if (/\s/g.test(usrnm)) {
      return res.sendFile(path.join(__dirname , "../views/index.html"));
    }
    res.sendFile(path.join(__dirname , "../views/main.html"));
  });

module.exports=router;