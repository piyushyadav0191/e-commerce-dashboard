const { Schema,
    model } = require('mongoose');


const notificationSchema = Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sale: {
        type: Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    }
});

notificationSchema.methods.toJSON = function() {
    const { __v, ...notification } = this.toObject();
    return notification;
}

module.exports = model('Notification', notificationSchema);