const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Record } = require("../models");
const { sortArray } = require('../helpers/sortArrays');


const getRecords = async(req = request, res = response) => {

    try {
        const { term } = req.params;
        const { page = 1, orderBy, filterBy } = req.query;
        const limit = page * 8;
        const since = (page * 8) - 8;
        const isMongoId = ObjectId.isValid(term);


        // if term is a mongoId or 'indumentaria'
        if (isMongoId) {

            const record = await Record.findById(term).populate('user', 'name email');


            return res.json({
                results: (record) ? [record] : []
            })
        };

        // if term is not empty
        if (term !== 'home') {

            const regex = new RegExp(term, 'i');

            //if there is not a category to filter
            const records = await Record.find({ name: regex, status: true }).populate('user', 'name email');

            // we filter and order results
            let filteredRecords = sortArray(records, orderBy, filterBy);

            // we paginate results
            var results = [];
            filteredRecords.forEach((e, i) => (i >= since && i < limit) && results.push(e))


            return res.json({
                msg: 'OK',
                results
            })
        }

        else {

            //if term is empty
            const records = await Record.find({ status: true }).populate('user', 'name email');


            // we filter and order results
            let filteredRecords = sortArray(records, orderBy, filterBy);

            // we paginate results
            var results = [];
            filteredRecords.forEach((e, i) => (i >= since && i < limit) && results.push(e))


            return res.json({
                msg: 'OK',
                results
            })

        }
    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }


}

const recordCreate = async (data) => {

    try {

        const recordNew = new Record(data);

        const record = await recordNew.save();

        return record;

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }


}

const recordDelete = async (req, res = response) => {

    try {

        await Record.deleteMany();

        res.json({
            msg: 'OK'
        })

    } catch (error) {
        res.json({
            msg: error
        })
        console.log(error)
    }


}


module.exports = {
    getRecords,
    recordCreate,
    recordDelete
}

