import Ajv from 'ajv';

const ajv = new Ajv();

export const userSchema = {
  type: "object",
  properties: {
    uuid: { type: "string", minLength: 1, maxLength: 10000 },
    name: { type: "string", minLength: 1, maxLength: 50 },
    password: { type: "string", minLength: 6, maxLength: 20 },
    age: { type: "string", minLength: 1, maxLength: 20 },
    address: { type: "string", minLength: 1, maxLength: 20 },
  },
  required: [ "password"],
  additionalProperties: false,
};

export const changePasswordSchema = {
  type: "object",
  properties: {
    oldPassword: { type: "string", minLength: 6, maxLength: 20 },
    newPassword: { type: "string", minLength: 6, maxLength: 20 },
  },
  required: ["oldPassword", "newPassword"],
  additionalProperties: false,
};

export const validateUser = ajv.compile(userSchema);
export const validateChangeP = ajv.compile(changePasswordSchema);
