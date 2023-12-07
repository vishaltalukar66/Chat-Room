import cors from '@fastify/cors'
import { Socket } from "socket.io";


const fastify = require("fastify");
const socketio = require("./runServer");

export const server = async () => {

    const app = fastify({ logger: true, cors: true });

    await app.register(socketio, {
        origin: "*",
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        methods: ["GET", "POST"]
    });
    await app.register(cors, {
        origin: "*",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ["GET", "POST"]
    })



    app.ready().then(() => {
        app.io.on("connection", (socket: Socket) => {
            console.log(`User Connected: ${socket.id}`);

            socket.on("joinRoom", (data: string) => {
                socket.join(data);
            })

            // send data to specific room
            socket.on("sendMessage", (res: { message: string, room: string, username: string }) => {
                // console.log(res);
                // console.log(res.room);
                socket.to(res.room).emit("receiveMessage", res);
            })



            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    });
const PORT = process.env.PORT || 3000;

    app.listen({ port: PORT });

}
