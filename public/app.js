const smallCups = document.querySelectorAll('.cup-small');
const liters = document.getElementById('liters');
const percentage = document.getElementById('percentage');
const remained = document.getElementById('remained');

updateBigCup();

smallCups.forEach((cup, idx) => {
cup.addEventListener('click', () => highlightCups(idx));
});

function highlightCups(idx) {
// if the cup has the full class already 
// and the nextSiblign doesn't have it
// (so it's clicked again), remove the full class by decreasing the idx.
// the idx is used bellow to tell how far 
// to add the 'full' class
if(smallCups[idx].classList.contains('full') &&
!smallCups[idx].nextElementSibling.classList.contains('full')) {
idx--;
}

smallCups.forEach((cup, idx2) => {
// make all the cups until here 'full'
if(idx2 <= idx) {
cup.classList.add('full');
// and the rest, empty by removing 'full'
} else {
cup.classList.remove('full');
}
});

updateBigCup();
}

function updateBigCup() {
const fullGlasses = document.querySelectorAll('.cup-small.full').length;
const totalGlasses = smallCups.length;

// hide the .percentage if the glass is empty
if(fullGlasses === 0) {
percentage.style.visibility = 'hidden';
percentage.style.height = '0';
} else {
percentage.style.visibility = 'visible';
percentage.style.height = `${fullGlasses / totalGlasses * 330}px`;
percentage.innerText = `${fullGlasses / totalGlasses * 100}%`;
}

if(fullGlasses === totalGlasses) {
remained.style.visibility = 'hidden';
remained.style.height = '0';
} else {
remained.style.visibility = 'visible';
liters.innerText = `${(2 - (250 * fullGlasses / 1000)).toFixed(2)}L`;
}
}

window.addEventListener('load',()=>{
    document.getElementById('button-event').addEventListener('click',()=>{
     let noCups = document.getElementById('info').value;
     console.log(noCups);
    
     //creating the object
    let obj = {"number":noCups};
    
    //stringify the object
    let jsonData = JSON.stringify(obj);
    
    //fetch to route noCups
    fetch('/noCups',{
    method:'POST',
    headers:{
        "Content-type":"application/json"
    },
    body:jsonData
    })
    .then(response => response.json())
    .then(data => {console(data)});
     
    //1.make a fetch request of type POST so that we can send the(noCups) to the server
    
    })
    document.getElementById('get-tracker').addEventListener('click',()=> {
      
        //get info on ALL the CheckinInfo we have so far
        fetch('/getCups')
        .then(resp => resp.json())
        .then(data => {
            console.log(data.data);
            document.getElementById('checkin-info').innerHTML = '';
            
    for(let i=0;i<data.data.length;i++){
        let string = data.data[i].date + ":" +data.data[i].checkin;
        let elt = document.createElement('p');
       elt.innerHTML = string;
       document.getElementById('checkin-info').appendChild(elt);
    }
        })
    })
    })

    window.addEventListener('load', function () {

        //Open and connect socket
        let socket = io();
        //Listen for confirmation of connection
        socket.on('connect', function () {
            console.log("Connected");
        });
    
        /* --- Code to RECEIVE a socket message from the server --- */
        let chatBox = document.getElementById('chat-box-msgs');
    
        //Listen for messages named 'msg' from the server
        socket.on('msg', function (data) {
            console.log("Message arrived!");
            console.log(data);
    
            //Create a message string and page element
            let receivedMsg = data.name + ": " + data.msg;
            let msgEl = document.createElement('p');
            msgEl.innerHTML = receivedMsg;
    
            //Add the element with the message to the page
            chatBox.appendChild(msgEl);
            //Add a bit of auto scroll for the chat box
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    
        /* --- Code to SEND a socket message to the Server --- */
        let nameInput = document.getElementById('name-input')
        let msgInput = document.getElementById('msg-input');
        let sendButton = document.getElementById('send-button');
    
        sendButton.addEventListener('click', function () {
            let curName = nameInput.value;
            let curMsg = msgInput.value;
            let msgObj = { "name": curName, "msg": curMsg };
     
            //Send the message object to the server
            socket.emit('msg', msgObj);
        });
    });
    
