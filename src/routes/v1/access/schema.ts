import Joi from "joi";

export default {
  signup: Joi.object().keys({
    title: Joi.string().required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  }),
  login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  verifyEmail: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
