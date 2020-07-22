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
        console.log(visitorData, "second")
        socket.user = visitorData;

        socket.emit('connect_visitor');
    })

    socket.on('get_visitor', () => {
        console.log(socket.user, "HIHII");
        socket.emit('get_visitor', socket.user);
    })

    socket.on('disconnect', () => {
        // console.log('A user disconnected!');
    });
});

http.listen(port, () => {
  console.log(`listening on localhost at port: ${port}`);
});