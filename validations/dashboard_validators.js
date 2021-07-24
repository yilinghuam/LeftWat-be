const Joi = require('joi')

module.exports = {
    changePasswordValidator: Joi.object({
        newPassword: Joi.string()
            .min(8)
            .required(),
        reEnterNewPassword: Joi.string()
            .required()
    })
}