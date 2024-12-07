import fetch from 'node-fetch'
const error = "Sever Din't run Properly"

//Add

fetch('http://localhost:1000/add?input=[1,2,3,4,5]', {
    method: "POST"
}).then(
    response => response.json()
).then(
    add => console.log(add)
).catch(() => console.log("Error:",error))

//Subtract

fetch('http://localhost:1000/sub?input=[1,2,3,4,5]', {
    method: "POST"
}).then(
    response => response.json()
).then(
    sub => console.log(sub)
).catch(() => console.log("Error:",error))

//Multiply

fetch('http://localhost:1000/mul?input=[1,2,3,4,5]', {
    method: "POST"
}).then(
    response => response.json()
).then(
    mul => console.log(mul)
).catch(() => console.log("Error:",error))

//Divide

fetch('http://localhost:1000/div?input=[1,2,3,4,5]', {
    method: "POST"
}).then(
    response => response.json()
).then(
    div => console.log(div)
).catch(() => console.log("Error:",error))