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

  const usersCollection = mongoClient.db(DB).collection('users');
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

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.emit('systemMessage', 'Welcome to Avian Banter!');

    socket.emit('session', socket.data as SocketData);

    socket.on('storeUsername', async (username: string) => {
      socket.data.username = username;

      await usersCollection.insertOne({ username });
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

      socket.to(room).emit('message', [message]);
      socket.emit('message', [message]);
    });

    socket.on('typing', (isTyping: boolean, room: string) => {
      socket.broadcast.to(room).emit('typing', socket.data.username!, isTyping);
      console.log(`${socket.data.username} is typing`);
    });

    socket.on('join', (room) => {
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
      socket
        .to(room)
        .emit(
          'systemMessage',
          `User ${socket.data.username} has left the room.`
        );
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    io.emit('rooms', getRooms());
  });

  function getRooms() {
    const { rooms } = io.sockets.adapter;
    const roomsFound: string[] = [];

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
