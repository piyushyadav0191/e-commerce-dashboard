const { Category } = require("../models");


const categoryExists = async(id = '') => {

    const categoryExists = await Category.findById( id );

    if ( !categoryExists ) {
        throw new Error(`Category with id: '${id}' does not exist.`);
    };
};

module.exports = {
    categoryExists
}