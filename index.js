document.addEventListener("DOMContentLoaded", check_for_auth, false);
const userid = getCookie("username");
const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }

function check_for_auth() {
    if (userid == "") {
        window.location.replace("login.html");
    }

    get_json_data()
}

function get_json_data() {
    var candidateJson;

    fetch('/rest/task?candidateUser=' + userid, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json();
    }).then((responseJson) => {
        candidateJson = responseJson;

        fetch('/rest/task?assignee=' + userid, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json();
        }).then((responseJson) => {
            candidateJson = responseJson.concat(candidateJson);

            append_json(candidateJson);
        })
    })
}

function append_json(data) {
    if (data.length == 0) {
        tableHTML = "<div>There are currently no open user tasks!</div>"
    } else {
        tableHTML = "<tr> <th>Name</th> <th>Created at</th> <th>Due to</th> <th>Description</th> </tr>";

        for (var eachItem in data) {
            tableHTML += "<tr>";
            var dataObj = data[eachItem];
            tableHTML += "<td>" + dataObj["name"] + "</td>";
            tableHTML += "<td>" + new Date(dataObj["created"]).toLocaleDateString('de-DE', dateOptions) + "</td>";
            tableHTML += "<td>" + new Date(dataObj["due"]).toLocaleDateString('de-DE', dateOptions) + "</td>";
            tableHTML += "<td>" + dataObj["description"] + "</td>";
            tableHTML += "<td> <input class='button-claim' type='button' value='Claim Task' onclick='claim_task(\"" + dataObj["id"].toString() + "\")'/> </td>";
            tableHTML += "</tr>";
        }
    }
    document.getElementById('tasklist').innerHTML = tableHTML;
}

function claim_task(id) {
    fetch('/rest/task/' + id + '/claim', {
        method: 'POST',
        mode: 'cors',
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