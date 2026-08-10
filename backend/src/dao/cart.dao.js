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
        $addFields: {
          matchingVariant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$items.product.variants",
                  as: "variant",
                  cond: { $eq: ["$$variant._id", "$items.variant"] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          itemPrice: {
            amount: {
              $multiply: [
                "$items.quantity",
                "$matchingVariant.price.amount",
              ],
            },
            currency: "$matchingVariant.price.currency",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          total: {
            $sum: "$itemPrice.amount",
          },
          items: {
            $push: "$items",
          },
        },
      },
    ],
  ]))[0];

  return cart;
};
