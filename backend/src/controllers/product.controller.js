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

export const getAllProductsControler= async (req, res, next)=> {
  const products=await productModel.find();

  res.status(200).json({
    success:true,
    message:"Products fetched successfully",
    products
  })
}

export const productDetailsController= async (req, res, next) => {
  const {productId}=req.params;

  const product=await productModel.findById(productId);

  if(!product){
    const error=new Error("Product not found");
    error.status=404;
    return next(error);
  }

  res.status(200).json({
    success:true,
    message:"Product details fetched successfully",
    product
  })
}
