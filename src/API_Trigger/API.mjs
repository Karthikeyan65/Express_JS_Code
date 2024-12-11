import fetch from 'node-fetch';


async function triggerAdd() {
    const input = [10, 20, 30];  
    const response =  await triggerAPI('add', input);
    const data = await response.json();
    console.log(`Operation: ${data.Operation}`);
    console.log(`Result: ${data.Result}`);
}

triggerAdd();


async function triggerSub() {
    const input = [10, 20, 30];  
    const response =  await triggerAPI('sub', input);
    const data = await response.json();
    console.log(`Operation: ${data.Operation}`);
    console.log(`Result: ${data.Result}`);
}

triggerSub();


async function triggerMul() {
    const input = [10, 20, 30];  
    const response =  await triggerAPI('mul', input);
    const data = await response.json();
    console.log(`Operation: ${data.Operation}`);
    console.log(`Result: ${data.Result}`);
}
triggerMul();


async function triggerDiv() {
    const input = [10, 20, 30];  
    const response =  await triggerAPI('div', input);
    const data = await response.json();
    console.log(`Operation: ${data.Operation}`);
    console.log(`Result: ${data.Result}`);
}
triggerDiv();



async function triggerAPI(operation, input) {
    try {
         
        const response = await fetch(`http://localhost:9000/${operation}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input })
        });

        
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Server Side Error: ${err}`);
        }
        return response

      
    } catch (error) {
        console.error("Error:", error.message); 
    }
}


