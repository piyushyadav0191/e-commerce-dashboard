const { Schema,
    model } = require('mongoose');


const rankingSchema = Schema({

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    ranking: {
        type: Number,
        default: 0,
        required: true
    },
});

rankingSchema.methods.toJSON = function() {
    const { __v, ...ranking } = this.toObject();
    return ranking;
}

module.exports = model('Ranking', rankingSchema);