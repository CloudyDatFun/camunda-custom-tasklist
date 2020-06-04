function handleLogin() {
    var user = document.login["username"].value;
    var pw = document.login["password"].value;

    if (user.length < 1 || pw.length < 1) {
        alert("Username or password cannot be empty.")
        return false;
    }

    fetch('/rest/identity/verify', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user, password: pw })
    }).then((response) => {
        if (!response.ok) {
            alert("Something went wrong.");
            return false;
        }
        return response.json();
    }).then((responseJson) => {
        if (responseJson.authenticated == false) {
            alert("Invalid username/password. Try again.")
            return false;
        }
        document.cookie = "username=" + responseJson.authenticatedUser;
        window.location.replace("index.html");
    })
    return false;
}