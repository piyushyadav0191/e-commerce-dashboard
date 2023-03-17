const { Product } = require("../models");


const productExists = async(id = '') => {

    const productExists = await Product.findById( id );
    
    if ( !productExists ) {
        throw new Error(`The product with id: '${id}' does not exist.`);
    };
};

module.exports = {
    productExists
}