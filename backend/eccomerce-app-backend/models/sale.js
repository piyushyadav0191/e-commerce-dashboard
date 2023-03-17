const { Schema,
        model } = require('mongoose');

const saleSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }],
    date_requested: { 
        type: Date,
        required: true
    },
    date_sended: { 
        type: Date,
        required: false
    },
    total_price: { 
        type: Number,
        required: true
    },
    status: {
        type: String || Boolean,
        required: true
    },
});

saleSchema.methods.toJSON = function() {
    const { __v, ...Sale } = this.toObject();
    return Sale;
}

module.exports = model( 'Sale', saleSchema );