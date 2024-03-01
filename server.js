// server.js

const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const port = 3000;


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('excelFile');


function checkFileType(file, cb) {
    const filetypes = /xlsx|xls/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    console.log("File Name:", file.originalname);
    console.log("File Type:", mimetype);

    if (filetypes.test(extname) && (mimetype === 'application/vnd.ms-excel' || mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return cb(null, true);
    } else {
        cb('Error: Excel files only!');
    }
}


app.use(express.static('./public'));


app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err);
            res.status(400).send({ error: 'Upload Error' });
        } else {
            if (req.file === undefined) {
                console.error("Error: No file selected");
                res.status(400).send({ error: 'No file selected' });
            } else {
                console.log("Uploaded file:", req.file.filename);
                const workbook = xlsx.readFile(req.file.path);
                const sheetName = workbook.SheetNames[0];
                const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
                console.log("Sheet Data:", sheetData);
                res.json(sheetData);
            }
        }
    });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
