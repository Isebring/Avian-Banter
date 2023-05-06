import { createAdapter } from '@socket.io/mongo-adapter';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { Server } from 'socket.io';

dotenv.config();

if (!process.env.MONGO_URL) {
  throw new Error('MONGO_URL is not defined in the .env file');
}

const DB = 'mydb';
const COLLECTION = 'socket.io-adapter-events';

const io = new Server({
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

    socket.on(
      'storeUsername',
      async (username: string, callback: (success: boolean) => void) => {
        if (!username) {
          callback(false);
          return;
        }
        socket.data.username = username;

        // const usersCollection = mongoClient.db(DB).collection('users');
        // await usersCollection.insertOne({ username });
        // console.log(`Username stored: ${username}`);
        // callback(true);
      }
    );

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`${socket.id} joined room ${room}`);
      socket.to(room).emit('message', `User ${socket.id} has joined the room.`);
    });

    socket.on('leaveRoom', (room) => {
      console.log(`${socket.id} left room ${room}`);
      socket.leave(room);
      socket.to(room).emit('message', `User ${socket.id} has left the room.`);
    });
  });

  io.listen(3000);
  console.log('Connected and listening to port 3000');
};

main();
