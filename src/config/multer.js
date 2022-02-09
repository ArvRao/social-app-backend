const multer = require("multer");
const path = require("path");

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, next) => {
        let ext = path.extname(file.originalname);

        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            // next(error, acceptFile)
            next(
                new Error("File type not supported. Please use .jpg, .jpeg, or .png"),
                false
            );
            return;
        }
        // accept file if no errors
        next(null, true);
    },
});