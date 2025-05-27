import Joi from 'joi';

export const tourValdationScema = Joi.object({
  name: Joi.string().required().min(4),
  duration: Joi.required(),
  maxGroupSize: Joi.required(),
  difficulty: Joi.string().required().min(4),
  price: Joi.required(),
  // ratingsAverage: Joi.required(),
  // ratingsQuantity: Joi.required(),
  price: Joi.required(),
  summary: Joi.string().required(),
  description: Joi.string().min(10).required(),
  guides: Joi.array().required(),
});
