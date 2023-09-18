import { transform } from 'https://episphere.github.io/quest/replace2.js';

// Clear the old Responses when the clear response button is clicked
document.getElementById("clearResp").addEventListener("click", () => {
    localforage.clear()
    location.reload()
})

// we dont actually have a backend, so for testing
// I'm using this FakeDB object as a mock object for the 
// database.
let FakeDB = {}
// integrate with epidonate if a token is given...

const params = new URLSearchParams(location.search)


function storeToFakeDB(obj){
    console.log("storint response to fakeDB", obj)
    for (const prop in obj) {
        console.log(`setting db[${prop}]=${obj[prop]} `)
        FakeDB[prop] = obj[prop];
    }
    getResponse()
}


// storeResponse take the object from quest and 
// adds all the elements to the 
function storeResponse(obj) {
    storeToFakeDB(obj)
    if (params.has("token")){
        storeResponseToEpidonate(obj)
    }
}

function getResponse() {
    const tableElement = document.getElementById("respTableBody")
    let makeTableData = (data) => {
        let td = document.createElement("td")
        td.innerText = data
        return td;
    }
    let makeTableRow = (table, prop, value) => {
        let tr = document.createElement("tr")
        tr.appendChild(makeTableData(prop))
        tr.appendChild(makeTableData(value))
        table.appendChild(tr)
    }

    document.getElementById("respTableBody").innerText = ""
    let respObj = params.has("token")?getResponseFromEpidonate():FakeDB;
    for (const prop in respObj) {
        makeTableRow(tableElement, prop, FakeDB[prop])
    }

    return respObj;
}

function storeResponseToEpidonate(obj){
    let token = params.get("token")
    console.log(` ===> Storing to Epidonate token=${token}`)    
}
function getResponseFromEpidonate(obj){
    let token = params.get("token")
    console.log(` ===> Get data from Epidonate token=${token}`)

    // currently return the fake db (i.e. we are not using epidonate.. get
    // the data from epidonat and return the object.)
    return FakeDB;
}

/*
 This is the line that calls quest.  The example from our paper is
 place in the questDiv element.
*/
transform.render({
    url: "https://danielruss.github.io/questionnaire/paper_example1.txt",
    activate: true,
    store: storeResponse,
    retrieve: getResponse
}, "questDiv")


/* Let the developer window have access to the FakeDB and 
the getResponse function */
window.FakeDB = FakeDB
window.getResponse = getResponse