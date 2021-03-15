const path = require('path');
const fs = require('fs');

exports.clearImageByFilePath = (filePathd) => {
    filePath = path.join(__dirname, '../', filePathd);
    fs.unlink(filePath, (err) => console.log(err));
};
