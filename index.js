let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.json());

//DB initial code
let Datastore =require('nedb');
let db = new Datastore('check-in.db');
db.loadDatabase();


let checkinTracker = [];

//2.add a route on server,that is listening for a post request
app.post('/noCups',(req,res)=>{
    console.log(req.body);
    let currentDate = Date();
    let obj = {
        date:currentDate,
        checkin:req.body.number
    }
//insert day data into the Database
    db.insert(obj,(err,newDocs)=> {
        //console.log('new document insert');
        if(err) {
            res.json({task:"task failed"});
            
        } else {
            res.json({task:"success"});
        }
        })
    
    })

    app.use('/', express.static('public'));

    //Initialize the actual HTTP server
    let http = require('http');
    let server = http.createServer(app);
    let port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log("Server listening at port: " + port);
    });
    


    //add route to get ALL checkin track information
    app.get('/getCups',(req,res)=> {
        db.find({},(err,docs)=>{
            if (err){
                res.json({task:"task failed"})
            }else{
            let obj = {data: docs};
            res.json(obj); 
            }
        
        })
      
    })

    //Initialize socket.io
let io = require('socket.io')();
io.listen(server);

//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('msg', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);

        //Send a response to all other clients, not including this one
        // socket.broadcast.emit('msg', data);

        //Send a response to just this client
        // socket.emit('msg', data);
    });

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });
});




