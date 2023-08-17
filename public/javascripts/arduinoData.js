const startTime = document.getElementById('start-time');
const endTime = document.getElementById('end-time');
const startTime2 = document.getElementById('start-time2');
const endTime2 = document.getElementById('end-time2');

const labelToggle = document.getElementById('label-toggle');

const buttonToggle = document.getElementById('check');
const buttonToggle2 = document.getElementById('check2');

const temperature = document.getElementById('temperature');
const waterLevel = document.getElementById('water-level');

let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
const timeElapsed = document.getElementById('time-elapsed');
let intTime = null;

let [milliseconds2,seconds2,minutes2,hours2] = [0,0,0,0];
const timeElapsed2 = document.getElementById('time-elapsed2');
let intTime2 = null;

function displayTimer(){
    milliseconds+=10;
    if(milliseconds == 1000){
        milliseconds = 0;
        seconds++;
        if(seconds == 60){
            seconds = 0;
            minutes++;
            if(minutes == 60){
                minutes = 0;
                hours++;
            }
        }
    }
 let h = hours < 10 ? "0" + hours + " hrs" : hours + " hrs";
 let m = minutes < 10 ? "0" + minutes + " min" : minutes + " min";
 let s = seconds < 10 ? "0" + seconds + " s" : seconds + " s";
 let ms = milliseconds < 10 ? "00" + milliseconds + " ms" : milliseconds < 100 ? "0" + milliseconds + " ms" : milliseconds + " ms";
 timeElapsed.innerText = `Time elapsed: ` + ` ${h} : ${m} : ${s} : ${ms}`;
}

function displayTimer2(){
    milliseconds2+=10;
    if(milliseconds2 == 1000){
        milliseconds2 = 0;
        seconds2++;
        if(seconds2 == 60){
            seconds2 = 0;
            minutes2++;
            if(minutes2 == 60){
                minutes2 = 0;
                hours2++;
            }
        }
    }
 let h2 = hours2 < 10 ? "0" + hours2 + " hrs" : hours2 + " hrs";
 let m2 = minutes2 < 10 ? "0" + minutes2 + " min" : minutes2 + " min";
 let s2 = seconds2 < 10 ? "0" + seconds2 + " s" : seconds2 + " s";
 let ms2 = milliseconds2 < 10 ? "00" + milliseconds2 + " ms" : milliseconds2 < 100 ? "0" + milliseconds2 + " ms" : milliseconds2 + " ms";
 timeElapsed2.innerText = `Time elapsed: ` + ` ${h2} : ${m2} : ${s2} : ${ms2}`;
}

// //to start stopwatch from loading page
// timeElapsed.innerText = "Time Elapsed: " + "00 : 00 : 00 : 000 ";
// buttonToggle.innerHTML = "Toggle Off";

// var today = new Date();
// var dateStart = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
// var timeStart = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
// var dateTimeStart = dateStart +' '+ timeStart;

// startTime.innerText = 'Start Time : ' + dateTimeStart;

// if(intTime!==null){
//     clearInterval(intTime);
// }

// intTime = setInterval(displayTimer,10);

// endTime.innerText = 'End Time: ';
// //



/*handle the sending of data to webpage*/
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 30); // 30 frames per second
        };
})();

var iosocket; //used for io.connect() func declared in /socket.io/socket.io.js
var pollOneH = 0;
var poll1;
var text;
var potValue;
var prevPotValue;
//var onOff = false; 
var toggleVal = 1;
var toggleVal2 = 1;
var unoData = []; //main data array for SCOM data
var waterStatus = '';

var datapts1 = [];
var datapts2 = [];
var chart1;
var chart2;

$(document).ready(function() {
    datapts1 = [];
    chart1 = new CanvasJS.Chart("chartContainer1", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Simple Line Chart"
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            dataPoints: datapts1
        }]
    });
    datapts2 = [];
    chart2 = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Simple Line Chart"
        },
        axisY: {
            includeZero: false
        },
        data: [{
            type: "line",
            dataPoints: datapts2,
        }]
    });


    initSocketIO();
});

//Start of browser actions here
window.onload = function() {
    initSocketIO();
};

//activate Toggle Button Click Event
$(document).ready(function() {
    $('#check').click(function() {
        toggleVal += 1;
        toggleVal %= 2; //switches btwn 0 & 1

        if (toggleVal === 0) {
            timeElapsed.innerText = "Time Elapsed: " + "00 : 00 : 00 : 000 ";

            var today = new Date();
            var dateStart = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var timeStart = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTimeStart = dateStart +' '+ timeStart;

            startTime.innerText = 'Start Time : ' + dateTimeStart;

            if(intTime!==null){
                clearInterval(intTime);
            }

            intTime = setInterval(displayTimer,10);

            endTime.innerText = 'End Time: ';
        }

        else {
            var today = new Date();
            var dateEnd = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var timeEnd = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTimeEnd = dateEnd +' '+ timeEnd;
            endTime.innerText = 'End Time : ' + dateTimeEnd; 


            clearInterval(intTime);
            [milliseconds,seconds,minutes,hours] = [0,0,0,0];
        }

        iosocket.emit('buttonval', toggleVal);
    });
});


// //activate Toggle Button 2 Click Event
$(document).ready(function() {
    $('#check2').click(function() {
        toggleVal2 += 1;
        toggleVal2 %= 2; //switches btwn 0 & 1

        if (toggleVal2 === 0) {
            timeElapsed2.innerText = "Time Elapsed: " + "00 : 00 : 00 : 000 ";

            var today = new Date();
            var dateStart = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var timeStart = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTimeStart = dateStart +' '+ timeStart;

            startTime2.innerText = 'Start Time : ' + dateTimeStart;

            if(intTime2!==null){
                clearInterval(intTime2);
            }

            intTime2 = setInterval(displayTimer2,10);

            endTime2.innerText = 'End Time: ';
        }

        else {
            var today = new Date();
            var dateEnd = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var timeEnd = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTimeEnd = dateEnd +' '+ timeEnd;
            endTime2.innerText = 'End Time : ' + dateTimeEnd; 


            clearInterval(intTime2);
            [milliseconds2,seconds2,minutes2,hours2] = [0,0,0,0];

        }
        iosocket.emit('buttonval2', toggleVal2);
    });
});

/************* FUNCTIONS BELOW**********/


/*recursively runs forever 
The animation function re-draws the potmeter box based on SCOM input*/
function animation(poll1, text) {
    var canvas = document.getElementById("myCanvas");
    var content = canvas.getContext("2d");

    // clear canvas
    content.clearRect(0, 0, 460, 540);

    content.fillStyle = '#313774';
    content.textAlign = 'center';
    content.font = '22pt Roboto';

    // make the wobbely values stop 
    // if (pollOneH * 2 > prevPotValue + 2 || pollOneH * 2 < prevPotValue - 2) {
        prevPotValue = potValue;
        potValue = pollOneH * 2 / 16;
    // }

    content.fillText('Temperature: ' + potValue + ' °C', text.x, text.y);
    temperature.innerHTML = potValue + ' °C';

    // render graph 
    potValue < 26 ? content.fillStyle = 'rgb(53, 53, 206)' : potValue < 29 ? content.fillStyle = 'rgb(205, 205, 37)' : content.fillStyle = 'red';
    content.fillRect(poll1.x, (poll1.y - poll1.h), poll1.w, poll1.h);

    content.fill();

    // request new frame
    requestAnimFrame(function() {
        if (poll1.h < pollOneH) {
            poll1.h += (pollOneH - poll1.h) * 0.15;
        } else if (poll1.h > pollOneH) {
            poll1.h -= (poll1.h - pollOneH) * 0.15;
        }
        text.y = (poll1.y - poll1.h) - 5;
        animation(poll1, text);
    });
}



function initSocketIO() {
    /*only called once at the loading of the webpage
    calls initPoll, initButton, & initSlider functions
    */
   // iosocket = io.connect(); //io variable is initialized in /socket.io/socket.io.js
    iosocket = io(); 
    console.log("init Socket via webpage!!");
    iosocket.on('onconnection', function(value) {
        var varInd = parseSerialData(value) //sets values for unoData array
        pollOneH = unoData[varInd == undefined ? 0 : varInd] * 8; // recieve start poll value from server

        initPoll();
        // initButton();
        initSlider();
        console.log("initial unoData: " + unoData[varInd == undefined ? 0 : varInd]); //print index 0 if undefined, else print index number varIndex



    });
    // recieve changed values by other client from server
    iosocket.on('update', function(receivedData) {
        if(receivedData.unoData.length < 10){
            var varInd = parseSerialData(receivedData); //unoData[] val has been updated
            pollOneH = unoData[varInd] * 8; // recieve start poll value from server
            //pollOneH is the main variable for the animation() func
        }

    });

    iosocket.on('updateWater', function(waterData) {
        waterStatus = waterData.substring(1);
        // if (waterStatus="No Liquid!"){
        //     waterStatus = "Unsafe range ❌"
        //     waterLevel.style.color = 'red';
        //     waterLevel.innerHTML = waterStatus
        // }
        // else {
        //     waterStatus = "Safe range ✔"
        //     waterLevel.style.color = '#313774';
        //     waterLevel.innerHTML = waterStatus
        // }
        waterLevel.innerHTML = waterStatus;
        
    });


} //endof initSocketIO

function initPoll() {
    poll1 = {
        x: 10,
        y: 540,
        w: 440,
        h: 0
    }
    text = {
        x: poll1.w / 2,
        y: 100
    }
    potValue = pollOneH * 2;
    prevPotValue = potValue;
    animation(poll1, text);
}

// function initButton() {
//     $("#check").button();
// }

function initSlider() {
    $("#slider").slider({
        min: 0,
        max: 255, //this is the max range our LEDs can receive
        change: function(event, ui) {
            iosocket.emit('sliderval', ui.value); //sends the ui.value to the SCOM port
        }
    });
}



// function parseSerialData(data) {
//     //data variable should be a key:val pair with key = "unoData", val = "_INDEX<actual data>"
//     //where INDEX is an integer 0-9
//     //NOTE: THIS CODE BREAKS IF number used is not a single digit!
//     for (let k1 in data) {
//         let val = data[k1];
//         /*data format =>  "_dxxxx" 
//         where "_" is the start of the string
//         the 1st digit 'd' after "_" is the index of the unoData array
//         all other values 'xxxx' are the actual data from the SCOM port
//         */
//         let keyNum = val.indexOf('_');
//         let unoIndex = parseInt(val.substring(keyNum + 1, keyNum + 2), 10); //only using values 0-9 for the index

//         val = val.substring(val.indexOf('_') + 2); //isolate just the data value
//         val = parseInt(val, 10);

//         unoData[unoIndex] = val;

//         //to do something different for each type of data add code here...
//         switch (unoIndex) {
//             case 0:
//                 //do something different for unoData[0]
//                 break;
//             case 1:
//                 //do something different for unoData[1] etc...
//                 break;
//             default:
//                 //something different again
//         }

//         return unoIndex; //return the variable index of the most recently updated value
//     }

// }

function parseSerialData(data) {
    //data variable should be a key:val pair with key = "unoData", val = "_INDEX<actual data>"
    //where INDEX is an integer 0-9
    //NOTE: THIS CODE BREAKS IF number used is not a single digit!
    for (let k1 in data) {
        let val = data[k1];
        /*data format =>  "_dxxxx" 
        where "_" is the start of the string
        the 1st digit 'd' after "_" is the index of the unoData array
        all other values 'xxxx' are the actual data from the SCOM port
        */
        let keyNum = val.indexOf('_');
        let unoIndex = parseFloat(val.substring(keyNum + 1, keyNum + 4), 10.00); //only using values 0-9 for the index

        val = val.substring(val.indexOf('_') + 2); //isolate just the data value
        val = parseFloat(val, 10.00);

        unoData[unoIndex] = val;

        //to do something different for each type of data add code here...
        switch (unoIndex) {
            case 0:
                //do something different for unoData[0]
                break;
            case 1:
                //do something different for unoData[1] etc...
                datapts1.push({ y: unoData[unoIndex] });
                chart1.render();
                break;
            case 2:
                datapts2.push({ y: unoData[unoIndex] });
                chart2.render();
                break;
            default:
                //something different again
        }

        return unoIndex; //return the variable index of the most recently updated value
    }

}


/*********AJAX REQUESTS***********/
