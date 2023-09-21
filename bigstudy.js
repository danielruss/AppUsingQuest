import { transform } from 'https://episphere.github.io/quest/replace2.js';
import * as epiDonate from 'https://episphere.github.io/donate/syncDonate.mjs';
import localforage from 'https://cdn.skypack.dev/localforage'

// You would not want to hard code the
// backend storename, but this is an example.
const module_name = "Questionnaire"
async function createDB(){
    return await localforage.createInstance({
        name:"BigStudy",
        storeName: module_name
    });
}

// Clear the old Responses when the clear response button is clicked
document.getElementById("clearResp").addEventListener("click", async () => {
    await FakeDB.clear()
    await FakeDB.setItem(module_name,{})
    await localforage.clear()
    if (use_epidonate){
        await epiDonate.sync({})
    }
    renderQuest()
})

// we dont actually have a backend, so for testing
// I'm using this FakeDB object as a mock object for the 
// database.
let FakeDB = await createDB()
FakeDB.getItem(module_name).then( async (r) => {
    if (!r){
        await FakeDB.setItem(module_name,{})
    }
})

// integrate with epidonate if a token is given...
const use_epidonate = !!epiDonate.token
if (use_epidonate){
    let old_values = await epiDonate.sync()
    // fill the FakeDB values from epidonate
    await FakeDB.setItem(module_name,old_values)
}
console.log( ` === Should I use epidonate? ${use_epidonate} ===`)

const params = new URLSearchParams(location.search)

async function storeToFakeDB(obj){
    let storedObj = (await FakeDB.getItem(module_name))
    Object.entries(obj).forEach( ([key,value]) => {
        key=key.replace(`${module_name}.`,"")
        key.split('.').reduce( (acc,cv,indx,arr) => {
            if (indx==arr.length-1){
                acc[cv]=value
            } else if ( !Object.keys(acc).includes(cv) ){
                acc[cv]={}
            }
            return acc[cv]
        },storedObj)
    } )
    await FakeDB.setItem(module_name,storedObj)
}


// storeResponse take the object from quest and 
// adds all the elements to the 
async function storeResponse(obj) {

    await storeToFakeDB(obj)
    if (use_epidonate){
        await epiDonate.sync(await FakeDB.getItem(module_name))
    }
    await getResponse()
}

const makeTableRow = (table, prop, value) => {
    let tr = table.insertRow()
    let tdlabel= tr.insertCell()
    tdlabel.innerText = prop;
    let tdvalue = tr.insertCell();
    tdvalue.innerText = value
}
async function getResponse() {
    const tableElement = document.getElementById("respTableBody")
    tableElement.innerText = ""

    let respObj = await FakeDB.getItem(module_name);
    if (use_epidonate) {
        respObj = await epiDonate.sync()
    }
    
    Object.keys(respObj).forEach((key)=>{
        makeTableRow(tableElement, key, respObj[key])
    })

    if (Object.keys(respObj).includes("COMPLETED_TS")){
        complete()
    }

    return {
        code: 200,
        data:respObj
    };
}


function renderQuest(){
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
}
renderQuest()

function complete(){
    document.getElementById("questDiv").innerHTML = `<h1>Questionnaire Complete</h1>
    <hr> If you would like to run the module again, please click the clear responses
    button below.  Your web application logic should continue from here.
    <button id="submitModalButton" style="display:none">`
}

/* Let the developer window have access to the FakeDB and 
the getResponse function */
window.FakeDB = FakeDB
window.epiDonate = epiDonate
window.getResponse = getResponse