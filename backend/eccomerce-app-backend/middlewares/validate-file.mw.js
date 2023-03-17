

const validateFile = ( req = request, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        
        res.status(400).json({
            msg: 'There are no files in the request.'
        });
        return; 
    }

    next();
};

module.exports = {
    validateFile
}