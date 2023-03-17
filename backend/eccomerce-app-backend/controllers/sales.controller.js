const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Sale, User, Notification } = require('../models');
const { sortArray } = require('../helpers/sortArrays');
const { updateBestProducts } = require('./ranking.controller');


const getSales = async (req = request, res = response) => {

    try {
        const { term } = req.params;
        const { page = 1, orderBy, filterBy } = req.query;
        const limit = page * 8;
        const since = (page * 8) - 8;
        const isMongoId = ObjectId.isValid(term);


        // if term is a mongoId or 'indumentaria'
        if (isMongoId) {

            const sale = await Sale.findById(term).populate('user', 'name')


            return res.json({
                results: (sale) ? [sale] : []
            })
        };

        // if term is not empty
        if (term !== 'home') {

            const regex = new RegExp(term, 'i');

            var salesCompared = [];

            if (filterBy === 'user') {

                const [users, sales] = await Promise.all([
                    User.find({ name: regex }),
                    Sale.find().populate('user', 'name')
                ]);

                users.forEach(e_Users => {
                    sales.forEach(e_Sales => {
                        if (e_Users.name == e_Sales.user.name) {
                            salesCompared.push(e_Sales);
                        }
                    })
                })
            } else {
                salesCompared = await Sale.find().populate('user', 'name')
            }

            // we filter and order results
            let filteredSales = sortArray(salesCompared, orderBy, filterBy);

            // we paginate results
            var results = [];
            filteredSales.forEach((e, i) => (i >= since && i < limit) && results.push(e))


            return res.json({
                msg: 'OK',
                results
            })
        }

        else {

            //if term is empty
            const sales = await Sale.find().populate('user', 'name')


            // we filter and order results
            let filteredSales = sortArray(sales, orderBy, filterBy);

            // we paginate results
            var results = [];
            filteredSales.forEach((e, i) => (i >= since && i < limit) && results.push(e))


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

const createSale = async (req = request, res = response) => {


    try {
        const { user } = req;

        let userDB = await User.findById(user._id).populate('cart');

        if (!userDB) {
            return res.status(400).json({
                msg: `The user with the id ${user._id} don't exist`
            });
        }

        // Enviamos los productos del carrito a ser puestos en el ranking
        userDB.cart.forEach((e) => updateBestProducts(e));

        let totalPrice = 0;

        userDB.cart.forEach(e => {
            totalPrice = totalPrice + parseFloat(e.price)
        });

        const sale = new Sale({
            user: user._id,
            cart: userDB.cart,
            date_requested: new Date(),
            total_price: totalPrice,
            status: 'A punto de ser enviado!'
        });

        const newSale = await sale.save();

        const saleDB = await Sale.findById(newSale._id)
            .populate('user')
            .populate('cart');

        userDB.cart = [];

        const saleNewFinish = await User.findByIdAndUpdate(user._id, userDB, { new: true });

        res.json({
            msg: 'OK',
            // sale: saleDB,
            // user: saleNewFinish
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }


};

const updateSale = async (req, res = response) => {

    const id = req.params.id;

    try {

    console.log(req.body);

        const saleDB = await Sale.findById(id);

        if (!saleDB) {
            return res.status(400).json({
                msg: `The sale with the id ${id} don't exist!`
            });
        }

        const data = {
            cart: saleDB.cart,
            date_requested: saleDB.date_requested,
            total_price: saleDB.total_price,
            user: saleDB.user,
            date_sended: new Date(),
            status: false,
        }

        const firstSale = await Sale.findByIdAndUpdate(id, data);

        const notification = new Notification({
            user: firstSale.user,
            sale: firstSale._id,
            status: true,
        });

        const [sale, newNotification] = await Promise.all([
            Sale.findById(id).populate('user', 'name'),
            notification.save()
        ]);



        res.json({
            msg: 'OK',
            results: sale,
            notification: newNotification
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }


};

const clearSale = async (req = request, res = response) => {

    const email = req.params.email;

    try {
        let userDB = await User.findOne({ email: email }).populate('cart');

        if (!userDB) {
            return res.status(400).json({
                msg: `The user with the email ${email} don't exist`
            });
        }

        if (req.body.action !== 'payment.created') return;

        // Enviamos los productos del carrito a ser puestos en el ranking
        userDB.cart.forEach((e) => updateBestProducts(e));

        let totalPrice = 0;

        userDB.cart.forEach(e => {
            totalPrice = totalPrice + parseFloat(e.price)
        });

        const sale = new Sale({
            user: userDB._id,
            cart: userDB.cart,
            date_requested: new Date(),
            total_price: totalPrice,
            status: 'A punto de ser enviado!'
        });

        const newSale = await sale.save();

        const saleDB = await Sale.findById(newSale._id)
            .populate('user')
            .populate('cart');

        userDB.cart = [];

        const saleNewFinish = await User.findByIdAndUpdate(userDB._id, userDB, { new: true });

        res.json({
            msg: 'OK',
            // sale: saleDB,
            // user: saleNewFinish
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }


};


module.exports = {
    getSales,
    createSale,
    updateSale,
    clearSale
}
