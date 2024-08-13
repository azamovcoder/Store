import { Schema, model } from "mongoose";

import Joi from "joi";

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = model("category", categorySchema);

export const validateCategory = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
  });
  return schema.validate(body);
};
