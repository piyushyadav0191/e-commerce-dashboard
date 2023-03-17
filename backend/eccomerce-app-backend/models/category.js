const { Schema,
    model } = require('mongoose');


const categorySchema = Schema({

    name: {
        type: String,
        required: [true, 'Name is required.'],
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
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
});

categorySchema.methods.toJSON = function () {
    const { __v, status, ...category } = this.toObject();
    return category;
}

module.exports = model('Category', categorySchema);