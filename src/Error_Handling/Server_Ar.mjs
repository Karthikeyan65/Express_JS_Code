import fetch from 'node-fetch'
async function Ar_Operation()
{
    try{
        const response = await  fetch('http://localhost:8000/div?input=[10,10,10,50,100,0]',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
    if(!response.ok) {
        const err = await response.text()
        throw new Error(`ServerSide Error: ${err}`)
    }   
    const data = await response.json()
    console.log("Result:", data)
    }catch(error)
    {
        console.log("Error:",error.message)
    }
}

Ar_Operation()