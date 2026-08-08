import productModel from "../models/product.model.js";
import uploadImage from "../services/storage.service.js";

export const createProductController = async (req, res, next) => {
  const { title, description, priceAmount, priceCurrency } = req.body;

  const images = await Promise.all(
    req.files.map(async (file) => {
      return await uploadImage({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }),
  );

  const sellerId = req.user.id;

  // console.log(images);
  // console.log(typeof images);

  const product = await productModel.create({
    title,
    description,
    seller: sellerId,
    price: {
      amount: priceAmount,
      currency: priceCurrency || "INR",
    },
    images,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
};

export const getSellerProductsController = async (req, res, next) => {
  const sellerId = req.user.id;

  const products = await productModel.find({ seller: sellerId });

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
  });
};

export const getAllProductsControler = async (req, res, next) => {
  const products = await productModel.find();

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
  });
};

export const productDetailsController = async (req, res, next) => {
  const { productId } = req.params;

  const product = await productModel.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Product details fetched successfully",
    product,
  });
};

export const addProductVariant = async (req, res, next) => {
  const { productId } = req.params;
  const { id } = req.user;

  const product = await productModel.findOne({
    _id: productId,
    seller: id,
  });

  if (!product) {
    const error = new Error("Product Not found");
    error.status = 404;
    return next(error);
  }

  console.log(req.files);

  const files = req.files;
  let images = [];
  if (files || files.length !== 0) {
    images = await Promise.all(
      files.map(async (file) => {
        return await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );
  }

  const priceAmount = req.body.priceAmount;
  const priceCurrency = req.body.priceCurrency;
  const stock = req.body.stock;
  const attributes = JSON.parse(req.body.attributes || {});

  console.log(priceAmount, priceCurrency, stock, attributes);

  product.variants.push({
    images,
    price: {
      amount: Number(priceAmount) || product.price.amount,
      currency: priceCurrency || product.price.currency,
    },
    stock,
    attributes,
  });

  await product.save();

  res.status(200).json({
    success: true,
    message: "Variant added successfully",
    product,
  });
};
