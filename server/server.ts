import { createAdapter } from '@socket.io/mongo-adapter';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
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

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.emit('message', 'Welcome to Avian Banter!');

    socket.on('storeUsername', async (username: string) => {
      socket.data.username = username;

      // const usersCollection = mongoClient.db(DB).collection('users');
      // await usersCollection.insertOne({ username });
      // console.log(`Username stored: ${username}`);
      // callback(true);
    });

    socket.on('createRoom', (room: string) => {
      if (!room || !socket.data.username) return;
      console.log(`Room created: ${room}`);
      socket.join(room);
      console.log(`${socket.data.username} joined room ${room}`);
      socket.emit('message', `You have joined the room.`);
      socket
        .to(room)
        .emit('message', `User ${socket.data.username} has joined the room.`);

      io.emit('rooms', getRooms());
    });

    socket.on('message', (message: string, room: string) => {
      if (!message || !socket.data.username) return;
      const formattedMessage = `${socket.data.username}: ${message}`;
      socket.to(room).emit('message', formattedMessage);
      socket.emit('message', formattedMessage);
    });

    socket.on('join', (room) => {
      socket.join(room);
      console.log(`${socket.data.username} joined room ${room}`);
      socket
        .to(room)
        .emit('message', `User ${socket.data.username} has joined the room.`);

      socket.emit('message', `You have joined the room.`);

      io.emit('rooms', getRooms());
    });

    socket.on('leave', (room) => {
      console.log(`${socket.data.username} left room ${room}`);
      socket.leave(room);
      socket
        .to(room)
        .emit('message', `User ${socket.data.username} has left the room.`);
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
