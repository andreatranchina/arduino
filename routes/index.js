var express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

// router.use(bodyParser.urlencoded({extended:true}));

router.use(express.json());

let id = 1;

const machines = [
    {   
        id: id++,
        sn: "thidfn234",
        tankLiters: 300,
        user: "Andrea"
    },
    {   
        id: id++,
        sn: "iverinre54",
        tankLiters: 500,
        user: "John"
    },
    {   
        id: id++,
        sn: "oiregero439",
        tankLiters: 750,
        user: "Linda",
    },
    {
        id: id++,
        sn: "fner3490",
        tankLiters: 340,
        user: "Jacob",
    },
    {   
        id: id++,
        sn: "iofinw43003",
        tankLiters: 393,
        user: "Marcus", 
    }
 
]

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'CET4811 Display Page' });
    //res.render('index2.ejs', { title: 'CET4811 Accepting DataPoints from User Input' });
});


// router.get("/machinesForm", function(req, res){
//     res.sendFile(__dirname + "/machines.html");
//     res.render('machines');

// });

// router.post("/machinesForm", function(req, res){
//     const sn = req.body.sn;
//     const user = req.body.user;
//     const tankLiters = Number(req.body.tankSize);

//     const newMachine = {
//         sn: sn,
//         tankLiters: tankLiters,
//         user: user
//     }
//     console.log(newMachine);
//     machines.push(newMachine);
//     res.send(newMachine);

//     res.set('Content-Type', 'text/html');
//     res.render('machines', { machines: machines });
//     res.send(machines.map((machine) => {
//         return(`
//         <table>
//         <thead>
//             <tr>
//                 <td>sn</td>
//                 <td>tank size (liters)</td>
//                 <td>user</td>
//             </tr>
//         </thead>
//         <tbody>
//             <tr>
//                 <td>${machine.sn}</td>
//                 <td>${machine.tankLiters}</td>
//                 <td>${machine.user}</td>
//             </tr>
//         </tbody>
//     </table>`)       
//     })

//     );

    
// });

router.get('/machines', function(req, res, next) {
    res.json(machines);
})

// router.get('/machines/1', function(req, res, next) {
//     res.send(machines[0].sn + machines[0].tankLiters);
//     console.log(machines[0].sn + machines[0].tankLiters);
// })

// router.get('/machines/2', function(req, res, next) {
//     res.send(machines[1].sn + machines[1].tankLiters);
//     console.log(machines[1].sn + machines[1].tankLiters)
// })

router.get('/user/:username', function(req, res, next) {
    res.send("welcome: " + req.params.username);
})

router.get('/userquery', function(req, res, next) {
    res.send(req.query.firstName + " " + req.query.lastName);
})

router.post('/machines', function(req, res, next) {
    const newMachine = {
        id: id++,
        sn: req.body.sn,
        tankLiters: req.body.tankLiters,
        user: req.body.user
    }
    machines.push(newMachine);
    res.send(newMachine)
})

router.put('/machines/:id', function(req, res, next) {
    const id = req.params.id;

    if (!req.body.sn){
        machines[id].sn = req.body.sn;
    }
    if (!req.body.tankLiters){
        machines[id].tankLiters = req.body.tankLiters;
    }
    if (!req.body.user){
        machines[id].user = req.body.user;
    }

    res.json(machines[id]);
});

router.delete('/machines/:id', function(req, res, next) {
    console.log("running delete method route");
    const id = req.params.id;
    console.log("id parameter: " + id);

    const index = machines.findIndex((machine) => machine.id === id);
    machines.splice(index, 1);
    
    res.json(machines);
})


module.exports = router;