const createAccount = async () => {
    const username = document.getElementById('create-username').value;
    const firstName = document.getElementById('create-firstname').value;
    const lastName = document.getElementById('create-lastname').value;
    const password = document.getElementById('create-password').value;

    try {
        const response = await fetch('http://localhost:3000/create-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, firstName, lastName, password }),
        });
        const data = await response.json();
        
        if(response.status === 200) {
            window.location.href = "main.html"
        }
        else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

const logIn = async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        // alert(data.message);
        if(response.status === 200) {
            window.location.href = "main.html"
        }
        else {
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
    }
};
