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

// storeResponse take the object from quest and 
// adds all the elements to the 
function storeResponse(obj) {
    console.log("store response ", obj)
    for (const prop in obj) {
        console.log(`setting db[${prop}]=${obj[prop]} `)
        FakeDB[prop] = obj[prop];
    }
    getResponse()
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
    for (const prop in FakeDB) {
        makeTableRow(tableElement, prop, FakeDB[prop])
    }

    return FakeDB
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