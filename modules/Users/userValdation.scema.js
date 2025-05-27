import Joi from 'joi';

export const userValdationScema = Joi.object({
  name: Joi.string().required().min(3),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: ['com', 'pro'] })
    .required(),
  password: Joi.string()
    .required()
    .pattern(/^[A-Za-z0-9]{3,8}$/),

  repassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const loginValdationScema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: ['com', 'pro'] })
    .required(),
  password: Joi.string()
    .required()
    .pattern(/^[A-Za-z0-9]{3,8}$/),
});

export const userresetPasswordScema = Joi.object({
  oldpassword: Joi.string()
    .required()
    .pattern(/^[A-Za-z0-9]{3,8}$/),
  newpassword: Joi.string()
    .required()
    .pattern(/^[A-Za-z0-9]{3,8}$/),
  repassword: Joi.string()
    .required()
    .pattern(/^[A-Za-z0-9]{3,8}$/),
});

export const resetPasswordScema = Joi.object({
  newpassword: Joi.string()
    .required()
    .pattern(/^[A-Za-z0-9]{3,8}$/),
  repassword: Joi.string()
    .required()
    .pattern(/^[A-Za-z0-9]{3,8}$/),
});
