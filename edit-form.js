const queryString = window.location.search
get_task()

function get_task() {
    params = new URLSearchParams(queryString)
    console.log(params.get("id"))
}