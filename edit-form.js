document.addEventListener("DOMContentLoaded", check_for_auth, false);
const userid = getCookie("username");
const params = new URLSearchParams(window.location.search).get("id");
var unchanged_data;

function check_for_auth() {
    if (userid == "" || params == null) {
        return;
    }

    get_task()
}

function get_task() {
    fetch('/rest/task/' + params + '/form-variables', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (!response.ok) {
            return false;
        }

        return response.json();
    }).then((responseJson) => {
        generate_inputs(responseJson);
        unchanged_data = responseJson
    })
}

function generate_inputs(data) {
    var listHTML = "<ul>";
    for (var eachItem in data) {
        listHTML += "<div>";
        listHTML += "<li>";
        var dataObj = data[eachItem];
        listHTML += "<div><label for='" + eachItem + "'>" + eachItem + ":</label></div>";
        listHTML += "<div><input type='";
        switch (dataObj.type) {
            case "String":
                listHTML += "text'";
            case "Long":
                listHTML += "number'";
            case "Boolean":
                listHTML += "checkbox'";
        }
        listHTML += " id='" + eachItem + " name='" + eachItem + "'></div>"
        listHTML += "</li>";
        listHTML += "</div>";
    }
    listHTML += "</ul>"
    document.getElementById('variables').innerHTML = listHTML;
}

function handle_submit() {
    var changed_data = unchanged_data;
    for (var eachItem in unchanged_data) {
        changed_data[eachItem].value = document.getElementById('variables').value;
    }

    fetch('/rest/task/' + params + '/submit-form', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.status == 204) {
            alert("Check your inputs.")
            return false;
        }
        if (!response.ok) {
            alert("Something went wrong.")
            return false;
        }

        window.location.href = "index.html";
    })
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}