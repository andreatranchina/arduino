// alert("loaded");

// const axios = require('axios');

const fetchDataButton = document.querySelector('.fetch-data-button');
const machinesDataContainer = document.querySelector('.machines-data-container');
const postButton = document.querySelector('.post-button');
const userInput = document.querySelector('.user-input');
const snInput = document.querySelector('.sn-nput');
const tankLitersInput = document.querySelector('.tank-liters-input');

const handleClickGet = async () => {
    console.log("i was clicked");
    try{
        const res = await fetch("http://localhost:3001/machines")
        const resJson = await res.json();
        // const resJson2 = await JSON.parse(res)
        console.log(resJson);
        console.log(resJson[0].sn)

        const table = document.createElement("table");
        table.style.border = "1px solid black";

        const tableHead = document.createElement("thead");
        const tableHeadRow = document.createElement("tr");

        const tableHeadSn = document.createElement("td");
        tableHeadSn.innerText = "SN";

        const tableHeadTankLiters = document.createElement("td");
        tableHeadTankLiters.innerText = "Tank Liters";

        const tableHeadUser = document.createElement("td");
        tableHeadUser.innerText = "User";

        tableHeadRow.appendChild(tableHeadSn);
        tableHeadRow.appendChild(tableHeadTankLiters);
        tableHeadRow.appendChild(tableHeadUser);

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
    
            tableRow.appendChild(tableCellSn);
            tableRow.appendChild(tableCellTankLiters);
            tableRow.appendChild(tableCellUser);
    
            table.appendChild(tableRow);

        }

        machinesDataContainer.appendChild(table);

        // const dataItem = document.createElement("h1");
        // dataItem.innerText = resJson[0].sn;
        // dataItem.style.fontSize = "3rem";
        // machinesDataContainer.appendChild(dataItem);
    }
    catch(error){
        console.log(error);
    }

}

fetchDataButton.addEventListener("click", handleClickGet);


const handleClickPost = async (event) => {
    event.preventDefault();
    console.log("post button was clicked");
    
    try {
        const response = await fetch("http://localhost:3001/machines", {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
    
        const responseJson = await response.json();
        console.log("Success:", responseJson);
      } catch (error) {
        console.error("Error:", error);
      }



}

postButton.addEventListener("click", handleClickPost)








// fetchDataButton.addEventListener("click", () => {
//     console.log("I was clicked");
// });

