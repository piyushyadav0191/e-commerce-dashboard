const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;
const { sortArray } = require("../helpers/sortArrays");

const { Product, Category } = require("../models");
const ranking = require("../models/ranking");
const { recordCreate } = require("./record.controller");

/**
 * Best products
 */

const getBestProducts = async (req = request, res = response) => {
  try {
    // const data = await ranking.find().populate("product");

    const data = await ranking.find().populate({
      path: "product",
      populate: {
        path: "category",
        select: 'name'
      },
    });

    let filterData = sortArray(data, "desc", "ranking");

    let results = [];

    filterData.forEach((e, i) => i < 5 && (results = [...results, e.product]));

    res.json({
      msg: "OK",
      results,
    });
  } catch (error) {
    res.json({
      msg: error,
    });
    console.log(error);
  }
};

const updateBestProducts = async (productCart) => {
  try {
    /** Traemos los productos del ranking para ser comparados */
    const bestProducts = await ranking.find();

    /**
     * En esta variable vamos a cololar el producto recibido de encontrarse
     * luego del filtrado de los productos del ranking.
     */
    let bestProductDB = [];

    /**
     * Filtramos los productos del ranking para ver cuales están ya colocados y asi
     * no repetirlos.
     */
    bestProductDB = bestProducts.filter(
      (e) => e.product.toString() === productCart._id.toString()
    );

    /**
     * Si el producto no está en el ranking entonces lo creamos.
     */
    if (bestProductDB.length === 0) {
      const newProduct = new ranking({
        product: productCart._id,
        ranking: 1,
      });

      await newProduct.save();
    } else {
      /**
       * Si el producto ya se encuentra en el ranking entonces le sumamos
       * un punto de ranking.
       */
      await ranking.findByIdAndUpdate(bestProductDB[0]._id, {
        product: bestProductDB[0].product,
        ranking: bestProductDB[0].ranking + 1,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getBestProducts,
  updateBestProducts,
};
