const startTime = document.getElementById('start-time');
const endTime = document.getElementById('end-time');
const labelToggle = document.getElementById('label-toggle');
const buttonToggle = document.getElementById('check');
const temperature = document.getElementById('temperature');

let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
const timeElapsed = document.getElementById('time-elapsed');
let intTime = null;

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
var toggleVal = 0;
var unoData = []; //main data array for SCOM data

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
        console.log("clicked");
        toggleVal += 1;
        toggleVal %= 2; //switches btwn 0 & 1

        if (toggleVal === 0) {
            timeElapsed.innerText = "Time Elapsed: " + "00 : 00 : 00 : 000 ";
            // labelToggle.innerHTML = "Toggle Off";
            // $('#check').innerHTML = "Toggle Off";
            buttonToggle.innerHTML = "Toggle Off";

            var today = new Date();
            var dateStart = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var timeStart = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTimeStart = dateStart +' '+ timeStart;
            // const startTime = document.getElementById('start-time');
            startTime.innerText = 'Start Time : ' + dateTimeStart;

            if(intTime!==null){
                clearInterval(intTime);
            }

            intTime = setInterval(displayTimer,10);

            endTime.innerText = 'End Time: ';
          
        }

        else {
            // labelToggle.innerHTML = "Toggle On"; 
            // $('#check').innerHTML = "Toggle On";
            buttonToggle.innerHTML = "Toggle On";

            var today = new Date();
            var dateEnd = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var timeEnd = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTimeEnd = dateEnd +' '+ timeEnd;
            // const endTime = document.getElementById('end-time');
            endTime.innerText = 'End Time : ' + dateTimeEnd; 


            clearInterval(intTime);
            [milliseconds,seconds,minutes,hours] = [0,0,0,0];
            // timeElapsed.innerText = "00 : 00 : 00 : 000 ";
        }

        iosocket.emit('buttonval', toggleVal);
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
        // console.log("got here")
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
        initButton();
        initSlider();
        console.log("initial unoData: " + unoData[varInd == undefined ? 0 : varInd]); //print index 0 if undefined, else print index number varIndex



    });
    // recieve changed values by other client from server
    iosocket.on('update', function(receivedData) {
        var varInd = parseSerialData(receivedData); //unoData[] val has been updated
        pollOneH = unoData[varInd] * 8; // recieve start poll value from server
        //pollOneH is the main variable for the animation() func

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
