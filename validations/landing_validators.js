const Joi = require('joi')

module.exports = {
    registerValidator: Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),
        password: Joi.string()
            .min(8)
            .required(),
        confirm_password: Joi.string()
            .required()
    }),

    loginValidator: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .required()
    }),

    resetPasswordValidator: Joi.object({
        email: Joi.string()
            .email()
            .required(),
        token: Joi.string()
            .required(),
        new_password: Joi.string()
            .required()
    })
}