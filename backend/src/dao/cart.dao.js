import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";

export const getCartDetails = async (userId) => {

  const cart = (await cartModel.aggregate([
    [
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$items",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "items.product",
        },
      },
      {
        $unwind: {
          path: "$items.product",
        },
      },
      {
        $unwind: {
          path: "$items.product.variants",
        },
      },
      {
        $match: {
          $expr: {
            $eq: ["$items.variant", "$items.product.variants._id"],
          },
        },
      },
      {
        $addFields: {
          itemPrice: {
            amount: {
              $multiply: [
                "$items.quantity",
                "$items.product.variants.price.amount",
              ],
            },
            currency: "$items.product.variants.price.currency",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          total: {
            $sum: "$itemPrice.amount",
          },
          items: {
            $push: "$items.product",
          },
        },
      },
    ],
  ]))[0];

  return cart;
};
