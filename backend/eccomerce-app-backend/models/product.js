const { Schema,
    model } = require('mongoose');


const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name id required.'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    img: { 
        type: Array 
    },
    quantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: { 
        type: String 
    }
});

productSchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}

module.exports = model('Product', productSchema);