document.addEventListener("DOMContentLoaded", check_for_auth, false);
const userid = getCookie("username");
var params;
var unchanged_data;

function check_for_auth() {
    params = new URLSearchParams(window.location.search).get("id");
    if (params == undefined) {
        window.location.replace("index.html");
    }
    if (userid == "") {
        window.location.replace("login.html");
    }

    get_task()
}

function get_task() {
    fetch('/rest/task/' + params + '/form-variables', {
        method: 'GET',
        mode: 'cors',
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
        listHTML += " id='" + eachItem + "' name='" + eachItem + "'></div>"
        listHTML += "</li>";
        listHTML += "</div>";
    }
    listHTML += "</ul>"
    document.getElementById('variables').innerHTML = listHTML;
}

function handle_submit() {
    var changed_data = unchanged_data;
    for (var eachItem in unchanged_data) {
        if (document.getElementById(eachItem).value == "on") {
            changed_data[eachItem].value = true;
        } else if (document.getElementById(eachItem).value == "off") {
            changed_data[eachItem].value = false;
        } else {
            changed_data[eachItem].value = document.getElementById(eachItem).value;
        }
    }

    fetch('/rest/task/' + params + '/submit-form', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ variables: changed_data })
    }).then((response) => {
        return response.status;
    }).then((responseStatus) => {
        if (responseStatus != 204) {
            return;
        }
        window.location.replace("index.html");
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