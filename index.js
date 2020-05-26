//first add an event listener for page load
document.addEventListener("DOMContentLoaded", check_for_auth, false);

function check_for_auth() {
    if (getCookie("username") == "") {
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
    fetch('/rest/message', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((responseJson) => {
        console.log("ProcessInstance object:", responseJson);
        const processInstanceId = responseJson[0].processInstance.id;
        console.log("ProcessInstanceId: ", processInstanceId);
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