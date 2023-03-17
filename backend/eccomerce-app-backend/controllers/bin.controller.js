const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Product, User, Category } = require("../models");
const { recordCreate } = require("./record.controller");
const { sortArray } = require('../helpers/sortArrays');


/* PRODUCTS */

const binGetProducts = async(req = request, res = response) => {

    try {
        const { term } = req.params;
        const { page, orderBy, filterBy } = req.query;
        const limit = page * 8;
        const since = (page * 8) - 8;
        const isMongoId = ObjectId.isValid(term);


        // if term is a mongoId or 'indumentaria'
        if (isMongoId && term !== 'indumentaria') {

            const product = await Product.findById(term, '', { status: false })
                .populate('category', 'name')
                .populate('user', 'name');


            return res.json({
                results: (product) ? [product] : []
            })
        };

        // if term is not empty
        if (term !== 'home') {

            var categoryForProduct = await Category.find({ name: term })

            const regex = new RegExp(term, 'i');

            // if there is a category to filter
            if (categoryForProduct.length !== 0) {
                const products = await Product.find({
                    $or: [{ name: regex }, { category: categoryForProduct[0]?._id }],
                    $and: [{ status: false }]
                }).populate('category', 'name')
                    .populate('user', 'name')


                // we filter and order results
                let filteredProducts = sortArray( products, orderBy, filterBy);

                // we paginate results
                var results = [];
                filteredProducts.forEach((e, i) => (i >= since && i < limit) && results.push(e))


                return res.json({
                    msg: 'OK',
                    results
                })
            } else {

                //if there is not a category to filter
                const products = await Product.find({ name: regex, status: false })
                    .populate('category', 'name')
                    .populate('user', 'name')

                // we filter and order results
                let filteredProducts = sortArray( products, orderBy, filterBy);

                // we paginate results
                var results = [];
                filteredProducts.forEach((e, i) => (i >= since && i < limit) && results.push(e))


                return res.json({
                    msg: 'OK',
                    results
                })
            }

        } else {

            //if term is empty
            const products = await Product.find({ status: false })
                .populate('category', 'name')
                .populate('user', 'name')


            // we filter and order results
            let filteredProducts = sortArray( products, orderBy, filterBy);

            // we paginate results
            var results = [];
            filteredProducts.forEach((e, i) => (i >= since && i < limit) && results.push(e))


            return res.json({
                msg: 'OK',
                results
            })

        }
    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }

}

const binEnableProduct = async (req, res = response) => {

    const { id } = req.params;

    try {

        let productDB = await Product.findById(id)

        if (!productDB) {
            return res.status(400).json({
                msg: `The product with the id ${id} does not exist!`
            });
        }

        const productFinish = await Product.findByIdAndUpdate(id, { status: true }, { new: true }).populate('category', 'name');

        const record = await recordCreate({
            name: productFinish.name,
            type: 'BIN-PRODUCT',
            action: 'BIN-ENABLE',
            date: Date.now(),
            user: req.user._id,
            details: {
                name: productFinish.name,
                category: {
                    _id: productFinish.category._id,
                    name: productFinish.category.name
                },
                quantity: productFinish.quantity,
                description: productFinish.description,
                price: productFinish.price,
                img: productFinish.img,
                user: productFinish.user
            }
        })

        res.status(201).json({
            msg: 'OK',
            product: productFinish,
            record
        })

    } catch (error) {

        res.status(401).json({
            msg: 'The product could not be processed',
            error
        })
        console.log(error)

    }
}

const binDeleteProduct = async (req, res = response) => {

    try {

        const id = req.params.id;

        const productDB = await Product.findById(id);

        if (!productDB) {
            return res.status(400).json({
                msg: `The product with the id ${id} don't exist!`
            });
        }

        const product = await Product.findByIdAndDelete(id, { new: true }).populate('category', 'name');

        const record = await recordCreate({
            name: product.name,
            type: 'BIN-PRODUCT',
            action: 'BIN-DELETE',
            date: Date.now(),
            user: req.user._id,
            details: {
                name: product.name,
                category: {
                    _id: product.category._id,
                    name: product.category.name
                },
                quantity: product.quantity,
                description: product.description,
                price: product.price,
                img: product.img,
                user: product.user
            }
        })

        res.status(200).json({
            msg: 'OK',
            product,
            record
        })

    } catch (error) {
        res.status(200).json({
            msg: error
        })
        console.log(error)
    }
}

/* USERS */

const binGetUsers = async(req = request, res = response) => {

    try {
        const { term } = req.params;
        const { page, orderBy, filterBy } = req.query;
        const limit = page * 8;
        const since = (page * 8) - 8;
        const isMongoId = ObjectId.isValid(term);


        // if term is a mongoId or 'indumentaria'
        if (isMongoId) {

            const user = await User.findById(term, '', { status: false })


            return res.json({
                results: (user) ? [user] : []
            })
        };

        // if term is not empty
        if (term !== 'home') {

            const regex = new RegExp(term, 'i');

            //if there is not a category to filter
            const users = await User.find({ name: regex, status: false })

            // we filter and order results
            let filteredUsers = sortArray(users, orderBy, filterBy);

            // we paginate results
            var results = [];
            filteredUsers.forEach((e, i) => (i >= since && i < limit) && results.push(e))


            return res.json({
                msg: 'OK',
                results
            })
        }

        else {

            //if term is empty
            const users = await User.find({ status: false })

            // we filter and order results
            let filteredUsers = sortArray(users, orderBy, filterBy);

            // we paginate results
            var results = [];
            filteredUsers.forEach((e, i) => (i >= since && i < limit) && results.push(e))


            return res.json({
                msg: 'OK',
                results
            })

        }
    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }

};

const binEnableUser = async (req, res = response) => {

    const id = req.params.id;

    try {

        let userDB = await User.findById(id)



        if (!userDB) {
            return res.status(400).json({
                msg: `The user with the id ${id} does not exist!`
            });
        }



        const userNewFinish = await User.findByIdAndUpdate(id, { status: true })

        const record = await recordCreate({
            name: userNewFinish.name,
            type: 'BIN-USER',
            action: 'ENABLE',
            date: Date.now(),
            user: req.user._id,
            details: userNewFinish
        })


        res.json({
            msg: 'OK',
            user: userNewFinish,
            record
        })

    } catch (error) {
        res.status(401).json({
            msg: 'The user could not be processed'
        })
        console.log(error)
    }


};

const binDeleteUser = async (req, res = response) => {

    const { id } = req.params;

    try {

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                msg: `The user with the id ${id} don't exist!`
            });
        }

        const userDelete = await User.findByIdAndDelete(id);

        const record = await recordCreate({
            name: userDelete.name,
            type: 'BIN-USER',
            action: 'BIN-DELETE',
            date: Date.now(),
            user: req.user._id,
            details: userDelete
        })

        res.json({
            msg: 'OK',
            user: userDelete,
            record
        })
    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }
};

module.exports = {
    binGetProducts,
    binEnableProduct,
    binDeleteProduct,
    binGetUsers,
    binEnableUser,
    binDeleteUser
}