const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
const fs = require("fs");
const { response } = require("express");
const messageFile = "./messages.json";

app.use(cors());

var getMessageFromJson = ( ) => {
  const text = fs.readFileSync(messageFile);
  const obj = JSON.parse(text);
  return obj;
};

const saveMessagesToJson = (messages) => {
  const text = JSON.stringify(messages, null, 4);
  fs.writeFileSync("./messages.json", text);
};



app.post('/messages/create', function (req, res) {
    var message = req.body;
    //message.timeSent = new Date();
    var messages = getMessageFromJson();
    if(message.text === "" || message.from === "" ){
      res.status(400).send("somehting is missing");
    }
    var largestId = Math.max(...messages.map(mesg => mesg.id));
    message.id = largestId + 1;
    message.timeSent = new Date();
   console.log(message.timeSent );
    messages.push(message);
    saveMessagesToJson(messages);
    res.status(201).send(message);


});

app.get("/messages/search", (req, res) => {
      var messages = getMessageFromJson();
      const searchTerm = req.query.text.toLowerCase();
      console.log(searchTerm);
      if(searchTerm!=null){
         const result = messages.filter((item) => 
         item.text.toLowerCase().includes(searchTerm));
         res.send(result);
      }else{
        res.end;
      }
});
   
/*app.get("/messages/search", (req, res) => {
      var messages = getMessageFromJson();
      const searchTerm = req.query.text.toLowerCase();
      const result = messages.filter(item => item.text.toLowerCase().includes(searchTerm));
      res.send(result)
    }); */   

app.get("/messages",  (req,res) => {
  res.send(getMessageFromJson());
});

app.get("/messages/latest", (req, res) => {
  var messages = getMessageFromJson();
  const result = messages.slice(-5);
  res.send(result);
});

app.get("/messages/:id", (req, res) => {
   const messageId = parseInt(req.params.id);
   const message = getMessageFromJson().find((message) => message.id === messageId);
   console.log(message);
  if (message) {
     res.status(201).send(message);
  } else {
   res.status(404).send("This message does not exist");
  }
});

app.get("/",  (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.delete("/messages/:id", (req, res) => {
  const messageId = parseInt(req.params.id);
  console.log(messageId);
  let messages = getMessageFromJson();
  const messageToDelete = getMessageFromJson().find((message) => message.id === messageId);
  console.log(messageToDelete);
  if(messageToDelete) {
    messages = messages.filter((messag) => messag.id != messageId);
    saveMessagesToJson(messages);
    res.status(200).send(messageToDelete);
  }else{
    res.status(404).send( "I did not find the message" +  messageId);
  }
});

app.listen(3000, () => {
   console.log("Listening on port 3000")
  });
