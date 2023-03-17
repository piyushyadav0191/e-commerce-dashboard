const { Schema,
    model } = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: [true, 'Role is required.']
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    }],
    data: {
        state: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        postalCode: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
        },
        numberPhone: {
            type: String,
            required: false
        },
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject();
    return user;
}

module.exports = model('User', userSchema);