const { response } = require('express');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { User, Product, Category } = require('../models');
const { fileUploadHelper } = require('../helpers');


const fileUpload = async (req, res = response) => {

    try {
        // Texts
        // const name = await fileUploadHelper( req.files, ['txt','md'], 'texts' );

        // Images
        const name = await fileUploadHelper(req.files, undefined, 'imgs');

        res.json({
            msg: 'OK',
            name
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }

}

const updateUserImg = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {

        case 'users':

            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id: '${id}'`
                });
            };

            break;

        case 'products':

            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id: '${id}'`
                });
            };

            break;

        default:
            return res.status(500).json({
                msg: 'This collection is not available to inquire into it'
            });
    };

    // Clean previous images

    try {
        if (model.img) {
            // You have to delete the image from the server
            const pathImg = path.join(__dirname, '../uploads', collection, model.img);
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg)
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: error
        })
    }

    try {

        const name = await fileUploadHelper(req.files, undefined, collection);

        model.img = name;

        await model.save();

        res.json({
            msg: 'OK',
            model
        });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: error
        })
    }


};

const showImg = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {

        case 'users':

            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id: '${id}'`
                });
            };

            if (model.img) {
                return res.json({
                    msg: 'OK',
                    img: model.img
                })
            }

            break;

        case 'products':

            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `There is no product with the id: '${id}'`
                });
            };

            if (model.img) {
                return res.json({
                    msg: 'OK',
                    img: model.img
                })
            }

            break;

        case 'categories':

            model = await Category.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `There is no categories with the id: '${id}'`
                });
            };

            if (model.img) {
                return res.json({
                    msg: 'OK',
                    img: model.img
                })
            }

            break;


        default:
            return res.status(500).json({
                msg: 'This collection is not available to inquire into it'
            });
    };

    const pathImgPlaceHolder = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImgPlaceHolder);
};

const updateUserImgCloudinary = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {

        case 'users':

            model = await User.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id: '${id}'`
                });
            };

            break;

        case 'products':

            model = await Product.findById(id);

            if (!model) {
                return res.status(400).json({
                    msg: `There is no user with the id: '${id}'`
                });
            };

            break;

        default:
            return res.status(500).json({
                msg: 'This collection is not available to inquire into it'
            });
    };

    // Clear previous images

    try {

        if (model.img) {

            const nameArr = model.img.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');

            cloudinary.uploader.destroy(public_id);
        }

    } catch (error) {

        return res.status(400).json({
            msg: error
        })
    }


    try {
        const { tempFilePath } = req.files.file;

        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        model.img = secure_url;

        await model.save();

        res.json({
            msg: 'OK',
            model
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            msg: error
        })
    }


};


module.exports = {
    fileUpload,
    updateUserImg,
    showImg,
    updateUserImgCloudinary,
}