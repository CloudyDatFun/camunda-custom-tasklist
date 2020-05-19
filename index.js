    //first add an event listener for page load
    document.addEventListener("DOMContentLoaded", get_json_data, false); // get_json_data is the function name that will fire on page load

    //this function is in the event listener and will execute on page load
    function get_json_data() {
        // Relative URL of external json file
        var json_url = '/rest/task';

        //Build the XMLHttpRequest (aka AJAX Request)
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) { //when a good response is given do this

                    var data = JSON.parse(this.responseText); // convert the response to a json object
                    append_json(data); // pass the json object to the append_json function
                }
            }
            //set the request destination and type
        xmlhttp.open("GET", json_url, true);
        //set required headers for the request
        xmlhttp.setRequestHeader("Content-type", "application/json");
        // send the request
        xmlhttp.send(); // when the request completes it will execute the code in onreadystatechange section
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
            },
            body: JSON.stringify(startConfig)
        }).then((response) => {
            return response.json();
        }).then((responseJson) => {
            console.log("ProcessInstance object:", responseJson);
            const processInstanceId = responseJson[0].processInstance.id;
            console.log("ProcessInstanceId: ", processInstanceId);
        })
    }