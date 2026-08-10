import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { variantStock } from "../dao/product.dao.js";
import { getCartDetails } from "../dao/cart.dao.js";

export const addItemToCart = async (req, res, next) => {
  const { productId, variantId } = req.params;
  const quantity = req.body?.quantity || 1;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  const stock = await variantStock(productId, variantId);

  let cart =
    (await cartModel.findOne({ user: req.user.id })) ||
    (await cartModel.create({ user: req.user.id }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.product?.toString() === productId &&
      item.variant?.toString() === variantId,
  );

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product?.toString() === productId &&
        item.variant?.toString() === variantId,
    ).quantity;
    if (quantityInCart + quantity > stock) {
      const err = new Error(
        `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
      );
      err.status = 400;
      return next(err);
    } else {
      cart = await cartModel.findOneAndUpdate(
        {
          user: req.user.id,
          "items.product": productId,
          "items.variant": variantId,
        },
        { $inc: { "items.$.quantity": quantity } },
        { new: true },
      );

      await cart.populate("items.product");
      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cart,
      });
    }
  }

  if (quantity > stock) {
    const err = new Error(
      `Only ${stock} items left in stock. and you already have ${quantity} items in your cart`,
    );
    err.status = 400;
    return next(err);
  }

  cart.items.push({
    product: productId,
    variant: variantId,
    price: product.price,
    quantity,
  });

  await cart.save();

  await cart.populate("items.product");
  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    cart,
  });
};

export const getCart = async (req, res, next) => {
  const { id } = req.user;

  let cart = await getCartDetails(id)

  if (!cart) {
    cart = await cartModel.create({ user: id });
  }

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    cart,
  });
};

export const incrementCartQuantity = async (req, res, next) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  const stock = await variantStock(productId, variantId);

  let cart = await cartModel.findOne({ user: req.user.id });

  if (!cart) {
    const err = new Error("Cart not found");
    err.status = 404;
    return next(err);
  }

  const quantityInCart = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variant.toString() === variantId,
  ).quantity;

  if (quantityInCart + 1 > stock) {
    const err = new Error(
      `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
    );
    err.status = 400;
    return next(err);
  }

  cart = await cartModel.findOneAndUpdate(
    {
      user: req.user.id,
      "items.product": productId,
      "items.variant": variantId,
    },
    {
      $inc: { "items.$.quantity": 1 },
    },
    { new: true },
  );

  await cart.populate("items.product");
  res.status(200).json({
    success: true,
    message: "Cart Item quantity incremented successfully",
    cart,
  });
};

export const decrementCartQuantity = async (req, res, next) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  const stock = await variantStock(productId, variantId);

  let cart = await cartModel.findOne({ user: req.user.id });

  if (!cart) {
    const err = new Error("Cart not found");
    err.status = 404;
    return next(err);
  }

  const quantityInCart = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variant.toString() === variantId,
  ).quantity;

  if (quantityInCart - 1 < 1) {
    const err = new Error("Qunaity cannot be less than 1");
    err.status = 400;
    return next(err);
  }

  cart = await cartModel.findOneAndUpdate(
    {
      user: req.user.id,
      "items.product": productId,
      "items.variant": variantId,
    },
    { $inc: { "items.$.quantity": -1 } },
    { new: true },
  );

  await cart.populate("items.product");
  res.status(200).json({
    success: true,
    message: "Cart item decremented succesfully",
    cart,
  });
};

export const deleteItemInCart = async (req, res, next) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  let cart = await cartModel.findOne({ user: req.user.id });

  if (!cart) {
    const err = new Error("Cart not found");
    err.status = 404;
    return next(err);
  }

  cart = await cartModel.findOneAndUpdate(
    {
      user: req.user.id,
      "items.product": productId,
      "items.variant": variantId,
    },
    {
      $pull: { items: { product: productId, variant: variantId } },
    },
    { new: true },
  );

  await cart.populate("items.product");
  res.status(200).json({
    success: true,
    message: "Cart item deleted successfully",
    cart,
  });
};
