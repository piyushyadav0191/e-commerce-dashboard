const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;
const { sortArray } = require("../helpers/sortArrays");

const { Product, Category } = require("../models");
const { recordCreate } = require("./record.controller");

/** Only ecommerce */

const getProductsSearchEcommerce = async (req = request, res = response) => {
  try {
    const { term } = req.params;
    const { orderBy, filterBy } = req.query;
    const isMongoId = ObjectId.isValid(term);

    // if term is a mongoId or 'indumentaria'
    if (isMongoId && term !== "indumentaria") {
      const product = await Product.findById(term)
        .populate("category", "name")
        .populate("user", "name");

      return res.json({
        results: product ? [product] : [],
      });
    }

    // if term is not empty
    if (term !== "home") {
      var categoryForProduct = await Category.find({ name: term });

      const regex = new RegExp(term, "i");

      // if there is a category to filter
      if (categoryForProduct.length !== 0) {
        const products = await Product.find({
          $or: [{ name: regex }, { category: categoryForProduct[0]?._id }],
          $and: [{ status: true }],
        })
          .populate("category", "name")
          .populate("user", "name");

          if(!products || products.length === 0 || products === undefined) {
            return res.json({
              msg: "OK",
              results: [],
            });
          }

        // we filter and order results
        let filteredProducts = sortArray(products, orderBy, filterBy);

        return res.json({
          msg: "OK",
          results: filteredProducts,
        });
      } else {
        //if there is not a category to filter
        const products = await Product.find({ name: regex, status: true })
          .populate("category", "name")
          .populate("user", "name");

        // we filter and order results
        // const filteredProducts = sortArray(products, {
        //     by: filterBy,
        //     order: orderBy
        // })

        if(!products || products.length === 0 || products === undefined) {
          return res.json({
            msg: "OK",
            results: [],
          });
        }

        let filteredProducts = sortArray(products, orderBy, filterBy);

        return res.json({
          msg: "OK",
          results: filteredProducts,
        });
      }
    } else {
      //if term is empty
      const products = await Product.find({ status: true })
        .populate("category", "name")
        .populate("user", "name");

      // we filter and order results
      // const filteredProducts = sortArray(products, {
      //     by: filterBy,
      //     order: orderBy
      // })

      if(!products || products.length === 0 || products === undefined) {
        return res.json({
          msg: "OK",
          results: [],
        });
      }

      let filteredProducts = sortArray(products, orderBy, filterBy);

      return res.json({
        msg: "OK",
        results: filteredProducts,
      });
    }
  } catch (error) {
    res.json({
      msg: error,
    });
    console.log(error);
  }
};

const getProductsByCategories = async (req = request, res = response) => {
  try {
    const data = await Product.find().populate("category", {
      name: 1,
    });

    res.json({
      msg: "OK",
      results: data,
    });
  } catch (error) {
    res.json({
      msg: error,
    });
    console.log(error);
  }
};

/** Ecommerce and dashboard */

const getListProducts = async (req = request, res = response) => {
  try {
    const { term } = req.params;
    const { page, orderBy, filterBy } = req.query;
    const limit = page * 8;
    const since = page * 8 - 8;
    const isMongoId = ObjectId.isValid(term);

    // if term is a mongoId or 'indumentaria'
    if (isMongoId && term !== "indumentaria") {
      const product = await Product.findById(term)
        .populate("category", "name")
        .populate("user", "name");

      return res.json({
        results: product ? [product] : [],
      });
    }

    // if term is not empty
    if (term !== "home") {
      var categoryForProduct = await Category.find({ name: term });

      const regex = new RegExp(term, "i");

      // if there is a category to filter
      if (categoryForProduct.length !== 0) {
        const products = await Product.find({
          $or: [{ name: regex }, { category: categoryForProduct[0]?._id }],
          $and: [{ status: true }],
        })
          .populate("category", "name")
          .populate("user", "name");

        if(!products || products.length === 0 || products === undefined) {
          return res.json({
            msg: "OK",
            results: [],
          });
        }

        // we filter and order results
        let filteredProducts = sortArray(products, orderBy, filterBy);

        // we paginate results
        var results = [];
        filteredProducts.forEach(
          (e, i) => i >= since && i < limit && results.push(e)
        );

        return res.json({
          msg: "OK",
          results,
        });
      } else {
        //if there is not a category to filter
        const products = await Product.find({ name: regex, status: true })
          .populate("category", "name")
          .populate("user", "name");

        // we filter and order results
        // const filteredProducts = sortArray(products, {
        //     by: filterBy,
        //     order: orderBy
        // })

        if(!products || products.length === 0 || products === undefined) {
          return res.json({
            msg: "OK",
            results: [],
          });
        }

        let filteredProducts = sortArray(products, orderBy, filterBy);

        // we paginate results
        var results = [];
        filteredProducts.forEach(
          (e, i) => i >= since && i < limit && results.push(e)
        );

        return res.json({
          msg: "OK",
          results,
        });
      }
    } else {
      //if term is empty
      const products = await Product.find({ status: true })
        .populate("category", "name")
        .populate("user", "name");

      // we filter and order results
      // const filteredProducts = sortArray(products, {
      //     by: filterBy,
      //     order: orderBy
      // })

      if(!products || products.length === 0 || products === undefined) {
          return res.json({
            msg: "OK",
            results: [],
          });
        }

      let filteredProducts = sortArray(products, orderBy, filterBy);

      // we paginate results
      var results = [];
      filteredProducts.forEach(
        (e, i) => i >= since && i < limit && results.push(e)
      );

      res.json({
        msg: "OK",
        results,
      });
    }
  } catch (error) {
    res.json({
      msg: error,
    });
    console.log(error);
  }
};

const getProductById = async (req, res = response) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id)
      .populate("user", "name")
      .populate("category", "name");

    if (!product || !product.status) {
      return res.status(400).json({
        msg: `There is no product with the id: ${id}`,
      });
    }

    res.json({
      msg: "OK",
      product,
    });
  } catch (error) {
    res.json({
      msg: error,
    });
    console.log(error);
  }
};

const createProduct = async (req, res = response) => {
  const { status, user, ...body } = req.body;
  const { name, quantity, description, category, price, img } = body;
  name.toUpperCase();

  try {
    /** Traemos el producto y categoria tal y como estan en la base de datos */
    const [productDB, categoryDB] = await Promise.all([
      Product.findOne({ name }),
      Category.findOne({ name: category }),
    ]);
    /**
     * Desestructuramos productos de la categoria en base de datos
     */
    const { products } = categoryDB;

    /** Validamos que la categoria exista */
    if (!categoryDB) {
      return res.status(400).json({
        msg: `The category ${category} does not exist!`,
      });
    }

    /** Validamos que el producto no sea repetido */
    if (productDB) {
      return res.status(400).json({
        msg: `The product ${productDB.name} already exists!`,
      });
    }

    /** Creamos el nuevo producto */
    const data = {
      name,
      category: categoryDB._id,
      description,
      quantity,
      price,
      img,
      user: req.user._id,
    };

    const productNew = new Product(data);

    const productSaved = await productNew.save();

    /** Creamos lo necesario para actualizar la lista de productos
     * en la categoria respectiva.
     */
    const categoryNew = {
      _id: categoryDB._id,
      name: categoryDB.name,
      products: [],
      user: categoryDB.user._id,
    };
    categoryNew.products = [...products, productSaved._id];

    /**
     * Primero creamos el registro del producto creado.
     * Segundo traemos el producto creado pero con el populate agregado.
     * Tercero actualizamos la lista de productos en la categoria.
     */
    const [record, product, categoryUpdated] = await Promise.all([
      recordCreate({
        name: productNew.name,
        type: "PRODUCT",
        action: "CREATE",
        date: Date.now(),
        user: req.user._id,
        details: {
          name: productSaved.name,
          category: {
            _id: productSaved.category._id,
            name: productSaved.category.name,
          },
          quantity: productSaved.quantity,
          description: productSaved.description,
          price: productSaved.price,
          img: productSaved.img,
          user: productSaved.user,
        },
      }),
      Product.findById(productSaved._id).populate("category", "name"),
      Category.findByIdAndUpdate(categoryDB._id, categoryNew, { new: true }),
    ]);

    res.status(201).json({
      msg: "OK",
      product,
      record,
      categoryUpdated,
    });
  } catch (error) {
    res.status(401).json({
      msg: "The product could not be processed - create product failed",
    });
    console.log(error);
  }
};

const updateProduct = async (req, res = response) => {
  const { id } = req.params;

  try {
    const { product } = req.body;

    const { category } = product;

    const productDB = await Product.findById(id).populate("category", "name");

    const categoryDB = await Category.findOne({ name: category });

    if (!productDB) {
      return res.status(400).json({
        msg: `The product with the id ${id} does not exist!`,
      });
    }

    if (!categoryDB) {
      return res.status(400).json({
        msg: `The category ${categoryDB} does not exist!`,
      });
    }

    /** Actualización del producto en el listado de su respectiva
     * categoria.
     */
    if (category !== productDB.category.name) {
      /** Eliminar el producto de la categoria anterior */

      /** Traemos la categoria de la cuál deseamos quitar el producto
       * de su lista de productos.
       */
      const oldCategoryDB = await Category.findById(
        productDB.category._id
      ).populate("products");

      /** Armamos el modelo para actualizar la categoria */
      let oldCategory = {
        _id: oldCategoryDB._id,
        name: oldCategoryDB.name,
        products: [],
        user: oldCategoryDB.user,
      };

      /** Filtramos el producto a eliminar y lo guardamos en el modelo
       * a actualizar.
       */
      oldCategory.products = oldCategoryDB.products.filter(
        (e) => e._id.toString() !== productDB._id.toString()
      );

      /** Actualizamos la categoria quitando el viejo producto de su lista */
      await Category.findByIdAndUpdate(oldCategoryDB._id, oldCategory, {
        new: true,
      });

      /** Agregar el producto en la categoria actual */

      /** Armamos el modelo para actualizar la categoria */
      let newCategory = {
        _id: categoryDB._id,
        name: categoryDB.name,
        products: [],
        user: categoryDB.user,
      };

      /** Agregamos el producto a la lista de productos de
       * la respectiva categoria.
       */
      newCategory.products = [...categoryDB.products, productDB._id];

      /** Actualizamos la categoria agregando el nuevo producto de su lista */
      await Category.findByIdAndUpdate(categoryDB._id, newCategory, {
        new: true,
      });
    }

    const data = {
      name: product.name,
      category: categoryDB._id,
      quantity: product.quantity,
      description: product.description,
      price: product.price,
      img: product.img,
      user: req.user._id,
    };

    const productFinish = await Product.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate("category", "name")
      .populate("user", "name");

    const record = await recordCreate({
      name: data.name,
      type: "PRODUCT",
      action: "UPDATE",
      date: Date.now(),
      user: req.user._id,
      details: {
        before: {
          name: productDB.name,
          category: {
            _id: productDB.category._id,
            name: productDB.category.name,
          },
          quantity: productDB.quantity,
          description: productDB.description,
          price: productDB.price,
          img: productDB.img,
          user: productDB.user,
        },
        after: {
          name: productFinish.name,
          category: {
            _id: productFinish.category._id,
            name: productFinish.category.name,
          },
          quantity: productFinish.quantity,
          description: productFinish.description,
          price: productFinish.price,
          img: productFinish.img,
          user: productFinish.user,
        },
      },
    });

    res.status(201).json({
      msg: "OK",
      product: productFinish,
      record,
    });
  } catch (error) {
    res.status(401).json({
      msg: "The product could not be processed",
    });
    console.log(error);
  }
};

const deleteProduct = async (req, res = response) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    ).populate("category", "name");

    const record = await recordCreate({
      name: product.name,
      type: "PRODUCT",
      action: "DELETE",
      date: Date.now(),
      user: req.user._id,
      details: {
        name: product.name,
        category: {
          _id: product.category._id,
          name: product.category.name,
        },
        quantity: product.quantity,
        description: product.description,
        price: product.price,
        img: product.img,
        user: product.user,
      },
    });

    res.status(200).json({
      msg: "OK",
      product,
      record,
    });
  } catch (error) {
    res.status(200).json({
      msg: error,
    });
    console.log(error);
  }
};

module.exports = {
  getProductsSearchEcommerce,
  getProductsByCategories,
  createProduct,
  getListProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
