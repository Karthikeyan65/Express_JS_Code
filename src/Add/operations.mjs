import fetch from 'node-fetch'
const error = "Sever Din't run Properly"

//Add

fetch('http://localhost:2000/calculate/1,2,3,4,5,6', {
    method: "POST"
}).then(
    response => response.json()
).then(
    add => console.log(add)
).catch(() => console.log("Error:",error))
