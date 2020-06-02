document.addEventListener("DOMContentLoaded", check_for_auth, false);
const userid = getCookie("username");
const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }

function check_for_auth() {
    if (userid == "") {
        window.location.replace("login.html");
    }

    get_json_data()
}

//this function is in the event listener and will execute on page load
function get_json_data() {
    fetch('/rest/history/task', {
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
    if (data.length == 0) {
        tableHTML = "<div>There are currently no open user tasks!</div>"
    } else {
        tableHTML = "<tr> <th>Name</th> <th>Completed by</th> <th>Started</th> <th>Ended</th> </tr>";

        for (var eachItem in data) {
            tableHTML += "<tr>";
            var dataObj = data[eachItem];
            tableHTML += "<td>" + dataObj["name"] + "</td>";
            tableHTML += "<td>" + dataObj["assignee"] + "</td>";
            tableHTML += "<td>" + new Date(dataObj["startTime"]).toLocaleDateString('de-DE', dateOptions) + "</td>";
            tableHTML += "<td>" + new Date(dataObj["endTime"]).toLocaleDateString('de-DE', dateOptions) + "</td>";
            tableHTML += "</tr>";
        }
    }
    document.getElementById('history-tasklist').innerHTML = tableHTML;
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
        window.location.replace("edit-form.html?id=" + id);
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

function logout() {
    document.cookie = "username=";
    window.location.replace("login.html");
}