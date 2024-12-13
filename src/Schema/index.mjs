import Ajv from 'ajv'
const ajv = new Ajv()

const userSchema = {
    type: "object",
    properties:{
        name:{type: "string"},
        id:{type: "number"},
        password:{type: "string"},
    },
    required: ["name", "id", "password"]
}

const user = {
    name: "Prabu",
    id: null,
    password: "ksjdhf",
}

const valid = ajv.validate(userSchema, user)
if(valid)
{
    console.log("Valid input")
}
else{
    console.error("Invalid", ajv.errors)
}