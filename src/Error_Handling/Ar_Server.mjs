import fetch from "node-fetch"
async function addition()
{
    try
    {
        const response = await fetch('http://localhost:6000/add?input=[10,10,10]', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })

    if(!response.ok)
    {
        const errMess = await response.text()
        throw new Error(`ServerSide Error: ${errMess}`)
    }

    const data = await response.json()
    console.log("Addition Result:", data)
    }catch(error)
    {
        console.log("Error:",error.message)
    }
}




async function subtraction()
{
    try
    {
        const response = await fetch('http://localhost:6000/sub?input=[10,-5,-7,9]', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })

    if(!response.ok)
    {
        const errMess = await response.text()
        throw new Error(`ServerSide Error: ${errMess}`)
    }

    const data = await response.json()
    console.log("Subtraction Result:", data)
    }catch(error)
    {
        console.log("Error:",error.message)
    }
}



async function multiplication()
{
    try
    {
        const response = await fetch('http://localhost:6000/mul?input=[10,10,10]', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })

    if(!response.ok)
    {
        const errMess = await response.text()
        throw new Error(`ServerSide Error: ${errMess}`)
    }

    const data = await response.json()
    console.log("Multiplication Result:", data)
    }catch(error)
    {
        console.log("Error:",error.message)
    }
}

async function division()
{
    try
    {
        const response = await fetch('http://localhost:6000/div?input=[10,-8,7]', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })

    if(!response.ok)
    {
        const errMess = await response.text()
        throw new Error(`ServerSide Error: ${errMess}`)
    }

    const data = await response.json()
    console.log("Division Result:", data)
    }catch(error)
    {
        console.log("Error:",error.message)
    }
}
addition()
subtraction()
multiplication()
division()