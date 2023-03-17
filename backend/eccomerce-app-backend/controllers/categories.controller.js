const { response } = require("express");
const { Category, Product } = require("../models");


const getListCategories = async (req, res = response) => {

    try {

        const { limit = 0, since = 0 } = req.query;
        const query = { status: true };

        const [total, categories] = await Promise.all([

            Category.countDocuments(query),

            Category.find(query)
                .populate('user', 'name')
                .populate('products')
                .skip(Number(since))
                .limit(Number(limit))
        ]);

        res.json({
            msg: 'OK',
            total,
            categories
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }
}

const getListCategoriesById = async (req, res = response) => {

    const { id } = req.params;

    try {

        const category = await Category.findById(id).populate('user', 'name');

        if (!category || !category.status) {
            return res.status(400).json({
                msg: `There is no category with the id: ${id}`
            })
        }

        res.json({
            msg: 'OK',
            category
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }
}

const createCategory = async (req, res = response) => {

    const { name } = req.body;
    name.toUpperCase();

    try {
        const categoryDB = await Category.findOne({ name });

        if (categoryDB) {
            return res.status(400).json({
                msg: `The category ${categoryDB.name} already exists!`
            });
        }

        const category = new Category({
            name,
            user: req.user._id
        });

        const categorySaved = await category.save();

        const newCategoryFinish = await Category.findById(categorySaved._id).populate('user', 'name');


        res.status(201).json({
            msg: 'OK',
            category: newCategoryFinish
        })

    } catch (error) {
        res.status(401).json({
            msg: 'The category could not be processed'
        })
        console.log(error)

    }
}

const updateCategory = async (req, res = response) => {

    const { id } = req.params;
    const { name } = req.body;

    try {

        const category = await Category.findByIdAndUpdate(id, { name }, { new: true }).populate('user', 'name');

        res.json({
            msg: 'OK',
            category
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }
}

const deleteCategory = async (req, res = response) => {

    const id = req.params.id;

    try {


        const productsDB = await Product.find({ category: id })

        if (productsDB.length >= 1) {

            return res.json({
                msg: 'No se puede eliminar una categoria que tiene productos asociados.',
            })

        } else {
            const category = await Category.findByIdAndDelete(id)

            res.status(200).json({
                msg: 'OK',
                category
            })
        }

    } catch (error) {
        res.status(200).json({
            msg: error
        })
        console.log('Error al eliminar la categoria', error);
    }

}


module.exports = {
    createCategory,
    getListCategories,
    getListCategoriesById,
    updateCategory,
    deleteCategory,

}