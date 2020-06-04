function handleRegister() {
    var user = document.register["username"].value;
    var pw = document.register["password"].value;
    var firstname = document.register["firstname"].value;
    var lastname = document.register["lastname"].value;
    var email = document.register["email"].value;

    fetch('/rest/user/create', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            profile: {
                id: user,
                firstName: firstname,
                lastName: lastname,
                email: email
            },
            credentials: {
                password: pw
            }
        })
    }).then((response) => {
        if (response.status != 204) {
            alert("Something went wrong.")
        }
        document.cookie = "username=" + user;
        window.location.replace("index.html");
    })
    return false;
}