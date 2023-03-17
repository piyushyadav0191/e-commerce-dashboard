const { Sale, User, Product, Record } = require('../models');

const { response, request } = require('express');


const getLoggedStatistics = async (req = request, res = response) => {

    const { id } = req;

    try {

        const [products, binProducts, users, binUsers, sales, records] = await Promise.all([

            Product.countDocuments({ status: true }),

            Product.countDocuments({ status: false }),

            User.countDocuments({ status: true }),

            User.countDocuments({ status: false }),

            Sale.countDocuments(),

            Record.countDocuments({ status: true }),
        ]);

        res.json({
            msg: 'OK',
            results: {
                products,
                binProducts,
                users,
                binUsers,
                sales,
                records
            }
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }
};

const getUnloggedStatistics = async (req = request, res = response) => {

    const { id } = req;

    try {

        const products = await Product.countDocuments({ status: true });

        res.json({
            msg: 'OK',
            results: {
                products,
            }
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }
};


module.exports = {
    getLoggedStatistics,
    getUnloggedStatistics
}
