const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcryptjs');

const { jwtGenerate } = require('../helpers/jwt-generate');
const { recordCreate } = require('./record.controller');
const { Product, User } = require('../models');
const { sortArray } = require('../helpers/sortArrays');


const getUsers = async (req = request, res = response) => {

    try {
        const { term } = req.params;
        const { page = 1, orderBy, filterBy } = req.query;
        const limit = page * 8;
        const since = (page * 8) - 8;
        const isMongoId = ObjectId.isValid(term);


        // if term is a mongoId or 'indumentaria'
        if (isMongoId) {

            const user = await User.findById(term)


            return res.json({
                results: (user) ? [user] : []
            })
        };

        // if term is not empty
        if (term !== 'home') {

            const regex = new RegExp(term, 'i');

            //if there is not a category to filter
            const users = await User.find({ name: regex, status: true })

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
            const users = await User.find({ status: true })


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

const createUser = async (req, res = response) => {


    try {
        const { name, password, email, role = 'USER_ROLE' } = req.body;

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({
                msg: `The user with the email ${email} already exists`
            });
        }

        const userNew = new User({ name, password, email, role });

        const salt = bcrypt.genSaltSync();
        userNew.password = bcrypt.hashSync(password, salt);

        const userNewFinish = await userNew.save();


        const { id } = userNewFinish;

        const [record, token, userToResponse] = await Promise.all([
            recordCreate({
                name: userNewFinish.name,
                type: 'USER',
                action: 'CREATE',
                date: Date.now(),
                user: userNewFinish._id,
                details: userNewFinish
            }),
            jwtGenerate(id),
            User.findById(id).populate('cart', 'name img price')
        ]);


        res.json({
            msg: 'OK',
            user: userToResponse,
            record,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: error
        })
    }


};

const updateUser = async (req, res = response) => {

    const id = req.params.id;
    let { user } = req.body;

    try {

        const userDB = await User.findById(user._id);

        const user2 = await User.findById(id);


        if (!userDB) {
            return res.status(400).json({
                msg: `The user with the id ${userDB._id} don't exist!`
            });
        }


        if (
            (userDB.email === 'admin_test@test.com' && user.role !== 'ADMIN_ROLE')
            ||
            (userDB.email === 'admin_test@test.com' && user.status === false)
            ||
            (userDB.email === 'admin_test@test.com' && user.email !== 'admin_test@test.com')
        ) {
            return res.status(400).json({
                msg: `This user can't be updated!`
            });
        }


        if (user2.role !== userDB.role) {
            if (user2.role !== 'ADMIN_ROLE') {
                return res.status(400).json({
                    msg: `User doesn't autorized`
                });
            }

        }


        if (user.password) {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
        }

        const userNewFinish = await User.findByIdAndUpdate(id, user, { new: true });

        const record = await recordCreate({
            name: userNewFinish.name,
            type: 'USER',
            action: 'UPDATE',
            date: Date.now(),
            user: req.user._id,
            details: {
                before: userDB,
                after: userNewFinish
            }
        })

        res.json({
            msg: 'OK',
            user: userNewFinish,
            record
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }


};

const deleteUser = async (req, res = response) => {

    try {
        // const { id } = req.params;

        // const user = await User.findById(id);

        // if (!user) {
        //     return res.status(400).json({
        //         msg: `The user with the id ${id} don't exist!`
        //     });
        // }

        // if (!user.status) {
        //     return res.status(401).json({
        //         msg: `The user with the id ${id} has already been deleted`
        //     })
        // }

        // const userDelete = await User.findByIdAndUpdate(id, { status: false }, { new: true });

        // const record = await recordCreate({
        //     name: userDelete.name,
        //     type: 'USER',
        //     action: 'DELETE',
        //     date: Date.now(),
        //     user: req.user._id,
        //     details: userDelete
        // })

        // res.json({
        //     msg: 'OK',
        //     user: userDelete,
        //     record
        // })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }
};

const updateCartUser = async (req, res = response) => {

    const id = req.params.id;
    const cart = req.body;


    try {


        const [user, product] = await Promise.all([

            User.findById(id),

            Product.findById(cart._id).populate('category', 'name')
        ]);


        if (!user) {
            return res.status(400).json({
                msg: `The user with the id ${_id} don't exist!`
            });
        }

        if (!product) {
            return res.status(400).json({
                msg: `The product with the id ${cart._id} don't exist!`
            });
        }

        if (user.cart || user.cart.length !== 0) {

            let userDB = await User.findById(id);

            if (userDB.cart.includes(cart._id)) {
                throw new Error(`The product ${product.name}, is already in the cart.`);
            }

            userDB.cart = userDB.cart.push(cart._id);

            await User.findByIdAndUpdate(id, userDB);

        } else {

            await User.findByIdAndUpdate(id, { cart: cart._id });
        }


        res.json({
            msg: 'OK',
            product
        })

    } catch (error) {
        console.log(error);
        res.json({
            msg: error
        })
    }


};

const deleteCartUser = async (req, res = response) => {

    const userId = req.params.userId;
    const productId = req.params.productId;
    // const cart = req.body;

    // console.log(cart);

    try {


        const [user, product] = await Promise.all([

            User.findById(userId),

            Product.findById(productId).populate('category', 'name')
        ]);


        if (!user) {
            return res.status(400).json({
                msg: `The user with the id ${userId} don't exist!`
            });
        }

        if (!product) {
            return res.status(400).json({
                msg: `The product with the id ${productId} don't exist!`
            });
        }


        // let userDB = await User.findById(id);

        if (!user.cart.includes(productId)) {
            throw new Error(`The product ${product.name}, is not in the cart.`);
        }

        user.cart = user.cart.filter(e => e.toString() !== productId);

        await User.findByIdAndUpdate(userId, user);

        res.json({
            msg: 'OK',
            product
        })

    } catch (error) {
        console.log(error);
        res.json({
            msg: error
        })
    }


};



module.exports = {
    getUsers,
    createUser,
    updateUser,
    updateCartUser,
    deleteUser,
    deleteCartUser
}
