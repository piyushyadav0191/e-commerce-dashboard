const { Schema,
    model } = require('mongoose');


const recordSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name id required.'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: { 
        type: String,
        required: true
    },
    type: { 
        type: String,
        required: true
    },
    date: { 
        type: Date,
        required: true
    },
    details: { 
        type: Object,
        required: true
    },
});

recordSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Record', recordSchema);