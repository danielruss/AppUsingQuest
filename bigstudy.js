import { transform } from 'https://episphere.github.io/quest/replace2.js';
import { rbAndCbClick } from "https://episphere.github.io/quest/questionnaire.js";

console.log("... in bigstudy.js")


// callback function on submit..
function dataSubmitted(obj) {
    document.getElementById("resultsDiv").innerText = obj.toString()
}


let FakeDB = {}
function storeResponse(obj) {
    console.log("store response ", obj)
    for (const prop in obj) {
        console.log(`setting db[${prop}]=${obj[prop]} `)
        FakeDB[prop] = obj[prop];
    }
}

function getResponse() {
    const tableElement = document.getElementById("respTable")
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

    document.getElementById("respTable").innerText = ""
    for (const prop in FakeDB) {
        makeTableRow(tableElement, prop, FakeDB[prop])
    }
    document.getElementById("resultsDiv").appendChild(tableElement)

    return FakeDB
}

// add the survey
transform.render({
    url: "https://danielruss.github.io/questionnaire/paper_example1.txt",
    activate: true,
    store: storeResponse,
    retrieve: getResponse
}, "questDiv")

window.FakeDB = FakeDB