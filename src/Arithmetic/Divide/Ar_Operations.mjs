import fetch from 'node-fetch';

// Divide
async function fetchDivision() {
    try {
       
        const response = await fetch('http://localhost:2000/divide?input=[10,0]', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        
        if (!response.ok) {
            
            const errorMessage = await response.text();
            throw new Error(`Server Error ${errorMessage}`);
        }

        
        const data = await response.json();
        console.log("Division Result:", data);
    } catch (error) {
        
        console.error("Error:", error.message);
    }
}
fetchDivision();
