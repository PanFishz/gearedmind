const Joi = require('joi');

//specification to validate new input submission such as reviews and rules
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required()
    }).required()
});

module.exports.ruleSchema = Joi.object({
    rule: Joi.string().min(3).required(),
    deleteImages: Joi.array()
}).required();