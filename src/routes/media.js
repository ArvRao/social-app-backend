const router = require("express").Router();
const upload = require("../config/multer")
const {
    uploadMedia,
} = require("../controllers/media.controller");

// Back in frontend: attribute name: 'image'
router.post("/profilepic", upload.single('image'), uploadMedia)

module.exports = router;