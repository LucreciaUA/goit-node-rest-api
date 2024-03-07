import Joi from "joi";

export const createContactSchema = Joi.object({
    
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .trim()
        .required(),


    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'uk', 'org', 'ca'] } })
        .max(30)
        .trim()
        .required(),
    phone: Joi.string().pattern(/^[0-9()-+]+$/, { name: 'phoneNumbers' })
        .trim()
    .required()
})






export const updateContactSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
    .trim(),


    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'uk', 'org', 'ca'] } })
        .max(30)
    .trim(),
    phone: Joi.string().pattern(/^[0-9()-+ ]+$/, { name: 'phoneNumbers' })
        .trim()
   

})