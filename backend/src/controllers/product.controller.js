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
  const { search, sort, page = 1, limit = 10 } = req.query;

  // Pagination
  const pageNo = Number(page);
  const limitNo = Number(limit);
  const skip = (pageNo - 1) * limitNo;

  // Price sorting
  let sortOrder = 0;

  if (sort === "lowToHigh") {
    sortOrder = 1;
  } else if (sort === "highToLow") {
    sortOrder = -1;
  }

  if (search) {
    let query = productModel.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });

    if (sortOrder !== 0) {
      query = query.sort({ "price.amount": sortOrder });
    }

    const searchProducts = await query.skip(skip).limit(limitNo);

    const totalProducts = await productModel.countDocuments({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(totalProducts / limitNo);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: searchProducts,
      totalProducts,
      totalPages,
      currentPage: pageNo,
    });
  }

  let query = productModel.find();

  if (sortOrder !== 0) {
    query = query.sort({ "price.amount": sortOrder });
  }

  const products = await query.skip(skip).limit(limitNo);

  const totalProducts = await productModel.countDocuments();
  const totalPages = Math.ceil(totalProducts / limitNo);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
    totalProducts,
    totalPages,
    currentPage: pageNo,
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

export const updateProductDetails = async (req, res, next) => {
  const { productId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user.id,
  });

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  const { title, description, priceAmount, priceCurrency } = req.body;

  await productModel.findOneAndUpdate(
    {
      _id: productId,
    },
    {
      title: title || product.title,
      description: description || product.description,
      price: {
        amount: Number(priceAmount) || product.price.amount,
        currency: priceCurrency || price.product.currency,
      },
    },
  );

  res.status(200).json({
    success: true,
    message: "Product details uopdated successfully",
    product,
  });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user.id,
  });

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  await productModel.findByIdAndDelete(productId);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    product,
  });
};

export const deleteVariant = async (req, res, next) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user.id,
    "variants._id": variantId,
  });

  if (!product) {
    const err = new Error("Variant not found");
    err.status = 404;
    return next(err);
  }

  product.variants = product.variants.filter(
    (variant) => variant._id.toString() !== variantId,
  );

  await product.save();

  res.status(200).json({
    success: true,
    message: "Varaint deleted successfully",
    product,
  });
};
