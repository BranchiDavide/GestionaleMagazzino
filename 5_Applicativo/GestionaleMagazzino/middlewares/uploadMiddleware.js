const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

function uploadImg(uploadPath) {
    return (req, res, next) => {
        fs.mkdirSync(uploadPath, {recursive: true});
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadPath);
            },
            filename: function (req, file, cb) {
                let fileName = crypto.randomUUID() + path.extname(file.originalname);
                cb(null, fileName);
            }
        });
        const imageFilter = (req, file, cb) => {
            //Variabile per poter controllare nel controller se c'è stato un
            //tentativo di upload di un'immagine
            req.body.fileUploadTry = true;

            const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
            const acceptedMimeTypes = ['image/jpeg', 'image/png'];
            if(acceptedMimeTypes.includes(file.mimetype.toLowerCase()) && acceptedExtensions.includes(path.extname(file.originalname.toLowerCase()))){
                cb(null, true); //File valido
            }else{
                cb(null, false) //File non valido (non viene salvato)
                // Nel controller req.body.file sarà undefined
            }
        };

        const upload = multer({storage: storage, fileFilter: imageFilter});
        upload.single('foto')(req, res, (err) => {
            next();
        });
    };
}

module.exports = {uploadImg};