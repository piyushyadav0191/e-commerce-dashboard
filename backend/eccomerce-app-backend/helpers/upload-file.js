const path = require('path');
const { v4: uuidv4 } = require('uuid');


const fileUploadHelper = ( files, allowedExtensions = ['pdf', 'docx', 'pps', 'xlsx', 'pptx', 'doc', 'jpg'], folder = '' ) => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const cutedName = file.name.split('.');
        const extension = cutedName[cutedName.length - 1];

        if (!allowedExtensions.includes(extension)) {
            return reject(`The extension '.${extension}' is not allowed - use the following extensions: '${allowedExtensions}'`);
        }

        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
        })

        resolve( nameTemp );
    });
}


module.exports = {
    fileUploadHelper
}