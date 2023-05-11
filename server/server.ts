import { createAdapter } from '@socket.io/mongo-adapter';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  Message,
  ServerToClientEvents,
  SocketData,
  User,
} from './communication';

dotenv.config();

if (!process.env.MONGO_URL) {
  throw new Error('MONGO_URL is not defined in the .env file');
}

const DB = 'mydb';
const COLLECTION = 'socket.io-adapter-events';

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const mongoClient = new MongoClient(process.env.MONGO_URL, {});

const main = async () => {
  await mongoClient.connect();

  const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

  await mongoCollection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600, background: true }
  );

  io.adapter(
    createAdapter(mongoCollection, {
      addCreatedAtField: true,
    })
  );

  const sessionsCollection = mongoClient
    .db(DB)
    .collection<SocketData>('sessions');
  const messagesCollection = mongoClient.db(DB).collection('messages');

  io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      // find existing session
      const session = await sessionsCollection.findOne({ sessionID });
      if (session) {
        socket.data.sessionID = session.sessionID;
        socket.data.userID = session.userID;
        socket.data.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error('invalid username'));
    }
    // create new session
    socket.data.sessionID = Date.now().toString();
    socket.data.userID = Date.now().toString();
    socket.data.username = username;
    await sessionsCollection.insertOne(socket.data as SocketData);
    next();
  });

  io.on('connection', async (socket) => {
    console.log(`Client connected: ${socket.data.username}`);
    const users = await sessionsCollection.find({}).toArray();
    io.emit('users', users);
    console.log('Connected users:', users);

    socket.emit('systemMessage', 'Welcome to Avian Banter!');

    socket.emit('session', socket.data as SocketData);

    socket.on('storeUsername', async (username: string) => {
      socket.data.username = username;

      console.log(`Username stored: ${username}`);
    });

    socket.on('createRoom', (room: string) => {
      if (!room || !socket.data.username) return;
      console.log(`Room created: ${room}`);
      socket.join(room);
      console.log(`${socket.data.username} joined room ${room}`);
      socket.emit('systemMessage', `You have joined the room.`);
      socket
        .to(room)
        .emit(
          'systemMessage',
          `User ${socket.data.username} has joined the room.`
        );
      io.emit('rooms', getRooms());
      socket.emit('roomCreated', room);
    });

    socket.on('fetchMessageHistory', async (room: string) => {
      const messageHistory = await messagesCollection
        .find({ room })
        .sort({ createdAt: 1 })
        .toArray();

      socket.emit(
        'messageHistory',
        messageHistory.map((m) => ({ username: m.username, text: m.message }))
      );
    });

    socket.on('message', async (message: Message, room: string) => {
      if (!message || !socket.data.username) return;

      await messagesCollection.insertOne({
        room,
        username: message.username,
        message: message.text,
        createdAt: new Date(),
      });

      socket.to(room).emit('message', message);
      socket.emit('message', message);
    });

    socket.on('typing', (isTyping: boolean, room: string) => {
      console.log(`${socket.data.username} is typing in room ${room}`);
      socket.broadcast.to(room).emit('typing', isTyping, {
        username: socket.data.username!,
        userID: socket.data.userID!,
      });
    });

    socket.on('join', (room) => {
      // Leave room if already joined
      // if (socket.data.room) {
      //   console.log('data room:' + socket.data.room);
      //   console.log(`${socket.data.username} left room ${socket.data.room}`);
      //   socket.leave(socket.data.room);
      // }

      socket.join(room);
      console.log(`${socket.data.username} joined room ${room}`);
      socket
        .to(room)
        .emit(
          'systemMessage',
          `User ${socket.data.username} has joined the room.`
        );

      socket.emit('systemMessage', `You have joined the room.`);

      io.emit('rooms', getRooms());
    });

    socket.on('leave', (room) => {
      console.log(`${socket.data.username} left room ${room}`);
      socket.leave(room);
      // socket
      //   .to(room)
      //   .emit(
      //     'systemMessage',
      //     `User ${socket.data.username} has left the room.`
      //   );
      // io.emit('rooms', getRooms());
    });

    // fångar alla leaves oavsett anledning
    // io.of('/').adapter.on('leave-room', (room, id) => {
    //   socket
    //     .to(room)
    //     .emit(
    //       'systemMessage',
    //       `User ${socket.data.username} has left the room.`
    //     );
    //   // io.emit('rooms', getRooms());

    //   // process.nextTick(() => {
    //   //   const rooms = io.sockets.adapter.rooms;
    //   //   if (!rooms.get(room)) {
    //   //     console.log(`Room ${room} has been removed`);
    //   //   }
    //   // });
    // });
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.data.username}`);
    });

    io.emit('rooms', getRooms());
  });

  function getRooms() {
    const { rooms } = io.sockets.adapter;
    const roomsFound: string[] = []; // Room[]
    // Hämta sockets från setOfSocketIds och plocka ut socket.data....
    for (const [name, setOfSocketIds] of rooms) {
      if (!setOfSocketIds.has(name)) {
        roomsFound.push(name);
      }
    }

    return roomsFound;
  }
  io.listen(3000);
  console.log('Connected and listening to port 3000');
};

main();

interface Room {
  name: string;
  users: User[];
}
