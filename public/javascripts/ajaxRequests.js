// alert("loaded");

// const axios = require('axios');

const machinesTable = [];

const fetchDataButton = document.querySelector('.fetch-data-button');

const machinesDataContainer = document.querySelector('.machines-data-container');
const postDataButton = document.querySelector('.post-data-button');

let userInput = document.querySelector('#user-input');
let snInput = document.querySelector('#sn-input');
let tankLitersInput = document.querySelector('#tank-liters-input');
let isFetched = false;
let isEditing = false;

const table = document.createElement("table");
table.style.border = "1px solid black";
machinesDataContainer.appendChild(table);

const handleClickGet = async () => {

    console.log("i was clicked");
    if (isFetched === false) {
      try{
        const res = await fetch("http://localhost:3001/machines")
        const resJson = await res.json();
        // const resJson2 = await JSON.parse(res)
        console.log(resJson);

        const tableHead = document.createElement("thead");
        const tableHeadRow = document.createElement("tr");

        const tableHeadSn = document.createElement("td");
        tableHeadSn.innerText = "SN";

        const tableHeadTankLiters = document.createElement("td");
        tableHeadTankLiters.innerText = "Tank Liters";

        const tableHeadUser = document.createElement("td");
        tableHeadUser.innerText = "User";

        const tableHeadEdit = document.createElement("td");
        tableHeadEdit.innerText = "Edit";

        const tableHeadDelete = document.createElement("td");
        tableHeadDelete.innerText= "Delete";

        tableHeadRow.appendChild(tableHeadSn);
        tableHeadRow.appendChild(tableHeadTankLiters);
        tableHeadRow.appendChild(tableHeadUser);
        tableHeadRow.appendChild(tableHeadEdit);
        tableHeadRow.appendChild(tableHeadDelete);

        tableHead.appendChild(tableHeadRow);
        table.appendChild(tableHead);

        for (let i=0; i<resJson.length; i++){
            const tableRow = document.createElement("tr");
            tableRow.style.border = "1px solid black";
            const tableCellSn = document.createElement("td");
            tableCellSn.innerText = resJson[i].sn;
    
            const tableCellTankLiters = document.createElement("td");
            tableCellTankLiters.innerHTML = resJson[i].tankLiters;
    
            const tableCellUser = document.createElement("td");
            tableCellUser.innerHTML = resJson[i].user;

            const tableCellEdit = document.createElement("td");
            tableCellEdit.innerHTML = "✏️";
            // tableCellEdit.addEventListener("click", () => {
            //   isEditing = true;
            //   showEditTable();
            // })

            const tableCellDelete = document.createElement("td");
            tableCellDelete.innerHTML = "🗑️";

            tableRow.appendChild(tableCellSn);
            tableRow.appendChild(tableCellTankLiters);
            tableRow.appendChild(tableCellUser);
            tableRow.appendChild(tableCellEdit);
            tableRow.appendChild(tableCellDelete);
    
            table.appendChild(tableRow);

            machinesTable.push({
              id: resJson[i].id,
              row: tableRow,
              snCell: tableCellSn,
              tankLitersCell: tableCellTankLiters,
              user: tableCellUser,
              editButton: tableCellEdit,
              deleteButton: tableCellDelete
            });

            tableCellDelete.addEventListener("click", (event) => handleClickDelete(event, resJson[i].id));
            tableCellEdit.addEventListener("click", (event) => handleClickEdit(event, resJson[i].id));
        }
        isFetched = true;
      }
      catch(error){
        console.log(error);
      }
    }
}

fetchDataButton.addEventListener("click", handleClickGet);



/*********TRACK CHANGES IN INPUTS FOR POST/ADD****************/

let sn = "";
let user = "";
let tankLiters = "";

const handleInputSn = (event) => {
  // sn = snInput.value;
  sn = event.target.value;
  console.log("i was changed");
  console.log(sn);
}

const handleInputUser = (event) => {
  user = event.target.value;
  console.log(user);
}

const handleInputTankLiters = (event) => {
  tankLiters = event.target.value;
  console.log(tankLiters);
}

userInput.addEventListener("input", handleInputUser);
snInput.addEventListener("input", handleInputSn);
tankLitersInput.addEventListener("input", handleInputTankLiters);

//********* POST / ADD ***************/

const handleClickPost = async () => {
  console.log("post was clicked");
  console.log(sn);
    if(!isFetched || !sn || !tankLiters || !user){
      return;
    }
      try {
        const newMachine = {
          sn: sn,
          tankLiters: tankLiters,
          user: user,
        }

        const response = await fetch("http://localhost:3001/machines", {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMachine),
        });
    
        const responseJson = await response.json();
        console.log("Success:", responseJson);

          const tableRow = document.createElement("tr");
          tableRow.style.border = "1px solid black";
          const tableCellSn = document.createElement("td");
          tableCellSn.innerText = responseJson.sn;
  
          const tableCellTankLiters = document.createElement("td");
          tableCellTankLiters.innerHTML = responseJson.tankLiters;
  
          const tableCellUser = document.createElement("td");
          tableCellUser.innerHTML = responseJson.user;

          const tableCellEdit = document.createElement("td");
          tableCellEdit.innerHTML = "✏️";

          const tableCellDelete = document.createElement("td");
          tableCellDelete.innerHTML = "🗑️";
  
          tableRow.appendChild(tableCellSn);
          tableRow.appendChild(tableCellTankLiters);
          tableRow.appendChild(tableCellUser);
          tableRow.appendChild(tableCellEdit);
          tableRow.appendChild(tableCellDelete);
  
          table.appendChild(tableRow);

          machinesTable.push({
            id: responseJson.id,
            row: tableRow,
            sn: tableCellSn,
            tankLiters: tableCellTankLiters,
            user: tableCellUser,
            editButton: tableCellEdit,
            deleteButton: tableCellDelete,
          });

          tableCellDelete.addEventListener("click", (event) => handleClickDelete(event, responseJson.id));
          tableCellEdit.addEventListener("click", (event) => handleClickEdit(event, resJson[i].id));

        snInput.value = "";
        userInput.value = "";
        tankLitersInput.value = "";

      } catch (error) {
        console.error("Error:", error);
      }

}

postDataButton.addEventListener("click", handleClickPost);

//***********EDITING */


const handleClickEdit = (event, id) =>{
  if(!isEditing){
    isEditing = true;
    const editHeader = document.createElement("h2");
    editHeader.innerHTML = "Edit Form (machine SN: " + machinesTable[id-1].snCell.innerHTML + ")";
    editHeader.style.display= "inline";


    const editForm = document.createElement("form")
    const editSnInput = document.createElement("input")
    const editUserInput = document.createElement("input")
    const editTankLitersInput = document.createElement("input");

    const submitEditButton = document.createElement("button");
    submitEditButton.innerHTML = "Submit Edits!";

    const shutFormButton = document.createElement("button");
    shutFormButton.innerHTML = "↩";

    const headerDiv = document.createElement("div");
    headerDiv.append(editHeader, shutFormButton);

    editTankLitersInput.classList.add("input-post");
    editSnInput.classList.add("input-post");
    editUserInput.classList.add("input-post");

    submitEditButton.classList.add("edit-data-button");
    shutFormButton.classList.add("shut-form-button")

    editTankLitersInput.placeholder = "tankLiters";
    editUserInput.placeholder = "user";
    editSnInput.placeholder = "sn";
  
    
    editForm.append(headerDiv, editSnInput, editTankLitersInput, editUserInput, submitEditButton);
    machinesDataContainer.appendChild(editForm);

    let currentEditSn = "";
    let currentEditTankLiters = "";
    let currentEditUser = "";

    const handleInputEditSn = (event) => {
      currentEditSn = event.target.value;
      console.log(currentEditSn);
    }
    
    const handleInputEditUser = (event) => {
      currentEditUser = event.target.value;
      console.log(currentEditUser);
    }
    
    const handleInputEditTankLiters = (event) => {
      currentEditTankLiters = event.target.value;
      console.log(currentEditTankLiters);
    }


    const handleClickSubmitEdit = async (event, id) => {
      event.preventDefault();
      try {
        const editedMachine = {
          sn: currentEditSn,
          tankLiters: currentEditTankLiters,
          user: currentEditUser,
        }
        console.log("edited machine: " + JSON.stringify(editedMachine))  

        const response = await fetch(`http://localhost:3001/machines/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedMachine),
        });

        const responseJson = await response.json();
        console.log("Success:", responseJson);
        //remove old row
        const index = machinesTable.findIndex((machine) => machine.id === id);
        table.removeChild(machinesTable[index].row);
        machinesTable.splice(index, 1);

        //add new edited row
        const tableRow = document.createElement("tr");
        tableRow.style.border = "1px solid black";
        const tableCellSn = document.createElement("td");
        tableCellSn.innerText = responseJson.sn;

        const tableCellTankLiters = document.createElement("td");
        tableCellTankLiters.innerHTML = responseJson.tankLiters;

        const tableCellUser = document.createElement("td");
        tableCellUser.innerHTML = responseJson.user;

        const tableCellEdit = document.createElement("td");
        tableCellEdit.innerHTML = "✏️";
        tableCellEdit.addEventListener("click", () => {
          isEditing = true;
          showEditTable();
        })

        const tableCellDelete = document.createElement("td");
        tableCellDelete.innerHTML = "🗑️";

        tableRow.appendChild(tableCellSn);
        tableRow.appendChild(tableCellTankLiters);
        tableRow.appendChild(tableCellUser);
        tableRow.appendChild(tableCellEdit);
        tableRow.appendChild(tableCellDelete);

        table.appendChild(tableRow);

        machinesTable.push({
          id: responseJson.id,
          row: tableRow,
          sn: tableCellSn,
          tankLiters: tableCellTankLiters,
          user: tableCellUser,
          editButton: tableCellEdit,
          deleteButton: tableCellDelete,
        });

        tableCellDelete.addEventListener("click", (event) => handleClickDelete(event, responseJson.id));
        tableCellEdit.addEventListener("click", (event) => handleClickEdit(event, resJson[i].id));



        editSnInput.value = "";
        editUserInput.value = "";
        editTankLitersInput.value = "";

        isEditing = "false";

      } catch (error) {
        console.error("Error:", error);
      }

    } 
    const handleClickShutForm = () => {
      machinesDataContainer.removeChild(editForm);
      isEditing = false;
    } 

    editUserInput.addEventListener("input", handleInputEditUser);
    editSnInput.addEventListener("input", handleInputEditSn);
    editTankLitersInput.addEventListener("input", handleInputEditTankLiters);
    submitEditButton.addEventListener("click", (event) => handleClickSubmitEdit(event, id));
    shutFormButton.addEventListener("click", handleClickShutForm);
  }
}  


const handleClickDelete = async (event, id) => {
  console.log("will delete " + id);

  try{
    const response = await fetch(`http://localhost:3001/machines/${id}`, {
      method: "DELETE",
    });
    const responseJson = await response.json();
    console.log("Success:", responseJson);

    const index = machinesTable.findIndex((machine) => machine.id === id);
    table.removeChild(machinesTable[index].row);
    machinesTable.splice(index, 1);

    console.log(machinesTable);
  }
  catch(error){
    console.log(error);
  }
}
