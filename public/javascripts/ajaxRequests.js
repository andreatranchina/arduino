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
              id: resJson[i].id,
              snCell: tableCellSn,
              tankLitersCell: tableCellTankLiters,
              user: tableCellUser,
              editButton: tableCellEdit,
              deleteButton: tableCellDelete
            });
            console.log(machinesTable);

            tableCellDelete.addEventListener("click", (event) => handleClickDelete(event, resJson[i].id));
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

        if(isFetched){
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
            sn: tableCellSn,
            tankLiters: tableCellTankLiters,
            user: tableCellUser,
            editButton: tableCellEdit,
            deleteButton: tableCellDelete,
          });

          tableCellDelete.addEventListener("click", (event) => handleClickDelete(event, responseJson.id));
        }

        snInput.value = "";
        userInput.value = "";
        tankLitersInput.value = "";

      } catch (error) {
        console.error("Error:", error);
      }

}

postDataButton.addEventListener("click", handleClickPost);


//Show post table
// const ShowPostTable = () => {
//   if(isFetched){
//     const postHeader = document.createElement("h2");
//     postHeader.innerHTML = "Post Form"

//     const postForm = document.createElement("form")
//     const postSn = document.createElement("input")
//     const postUser = document.createElement("input")
//     const postTankLiters = document.createElement("input");

//     const submitPostButton = document.createElement("button");
//     submitPostButton.innerHTML = "Submit New!";

//     postTankLiters.setAttribute("id", "tank-liters-input");
//     postSn.setAttribute("id", "sn-input");
//     postSn.setAttribute("id", "user-input");

//     postTankLiters.classList.add("input-post");
//     postSn.classList.add("input-post");
//     postUser.classList.add("input-post");
//     submitPostButton.classList.add("post-data-button");

//     postTankLiters.placeholder = "tankLiters";
//     postUser.placeholder = "user";
//     postSn.placeholder = "sn";
  
    
//     postForm.append(postHeader, postSn, postTankLiters, postUser, submitPostButton);
//     machinesDataContainer.appendChild(postForm);
//   }
// }


//***********EDITING */

const showEditTable = () =>{
  if(isEditing){
    const editHeader = document.createElement("h2");
    editHeader.innerHTML = "Edit Form"

    const editForm = document.createElement("form")
    const editSnInput = document.createElement("input")
    const editUserInput = document.createElement("input")
    const editTankLitersInput = document.createElement("input");

    const submitEditButton = document.createElement("button");
    submitEditButton.innerHTML = "Submit Edits!";

    editTankLitersInput.classList.add("input-post");
    editSnInput.classList.add("input-post");
    editUserInput.classList.add("input-post");
    submitEditButton.classList.add("edit-data-button");

    editTankLitersInput.placeholder = "tankLiters";
    editUserInput.placeholder = "user";
    editSnInput.placeholder = "sn";
  
    
    editForm.append(editHeader, editSnInput, editTankLitersInput, editUserInput, submitEditButton);
    machinesDataContainer.appendChild(editForm);



    let currentEditSn = "";
    let currentEditTankLiters = "";
    let currentEditUser = "";

    const handleInputEditSn = (event) => {
      // sn = snInput.value;
      currentEditSn = event.target.value;
      console.log("i was changed");
    }
    
    const handleInputEditUser = (event) => {
      currentEditUser = event.target.value;
    }
    
    const handleInputEditTankLiters = (event) => {
      currentEditTankLiters = event.target.value;
    }


    const handleClickEdit = async (event) => {
      try {
        const editedMachine = {
          sn: currentEditSn,
          tankLiters: currentEditTankLiters,
          user: currentEditUser,
        }  

        const response = await fetch("http://localhost:3001/machines", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedMachine),
        });
    
        const responseJson = await response.json();
        console.log("Success:", responseJson);

        snInput.value = "";
        userInput.value = "";
        tankLitersInput.value = "";

      } catch (error) {
        console.error("Error:", error);
      }

    }  

    userInput.addEventListener("input", handleInputEditUser);
    snInput.addEventListener("input", handleInputEditSn);
    tankLitersInput.addEventListener("input", handleInputEditTankLiters);
    submitEditButton.addEventListener("click", handleClickEdit);
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
  }
  catch(error){
    console.log(error);
  }
}
