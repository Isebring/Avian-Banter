import { Server } from 'socket.io';

const io = new Server();

io.listen(3000);
console.log('listening on port 3000');
