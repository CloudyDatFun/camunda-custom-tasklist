document.addEventListener("DOMContentLoaded", check_for_auth, false);
const userid = getCookie("username");

function check_for_auth() {
    if (userid == "") {
        return;
    }

    get_json_data()
}

//this function is in the event listener and will execute on page load
function get_json_data() {
    fetch('/rest/task', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((responseJson) => {
        append_json(responseJson)
    })
}

//this function appends the json data to the table 'gable'
function append_json(data) {
    var tableHTML = "<tr>";
    for (var headers in data[0]) {
        tableHTML += "<th>" + headers + "</th>";
    }
    tableHTML += "</tr>";
    for (var eachItem in data) {
        tableHTML += "<tr>";
        var dataObj = data[eachItem];
        for (var eachValue in dataObj) {
            tableHTML += "<td>" + dataObj[eachValue] + "</td>";
        }
        tableHTML += "<td> <input class='button-claim' type='button' value='Claim Task' onclick='claim_task(\"" + dataObj["id"].toString() + "\")'/> </td>";
        tableHTML += "</tr>";
    }
    document.getElementById('tasklist').innerHTML = tableHTML;
}

function claim_task(id) {
    fetch('/rest/task/' + id + '/claim', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userid })
    }).then((response) => {
        return response.status;
    }).then((responseStatus) => {
        if (responseStatus != 204) {
            return;
        }

        window.location.href = "edit-form.html?id=" + id;
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