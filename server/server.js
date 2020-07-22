const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 5000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// CREATE GENERAL FORM CHECKING FUNCTION

io.on('connection', (socket) => {
    socket.on('connect_visitor', (visitorData) => {
        socket.user = visitorData;
        // console.log("Connect_visitor - new details: ", socket.user);
        console.log(socket.id);

        socket.emit('connect_visitor', 'Visitor data updated - Sending to new location');
    })

    socket.on('get_visitor', () => {
        // console.log("Trying to provide client with", socket);
        console.log(socket.id);

        socket.emit('get_visitor', socket.user);
    })

    socket.on('disconnect', () => {
        // console.log('A user disconnected!');
    });
});

http.listen(port, () => {
  console.log(`listening on localhost at port: ${port}`);
});