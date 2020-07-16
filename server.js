import express from "express";
import http from "http";
import createGame from "./public/game.js";
import socketio from "socket.io";

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static("./public"));

const game = createGame();

/**
 * game.start() abaixo insere as frutas
 * */
game.start();

/**
 * game.subscribe garante que todos os clients
 * conectados tenham acesso as informações.
 */

game.subscribe((command) => {
    sockets.emit(command.type, command);
});

sockets.on("connection", (socket) => {
    const playerId = socket.id;

    console.log(`> PLAYER connected: ${playerId}`);

    game.addPlayer({ playerId });
    socket.emit("setup", game.state);

    socket.on("disconnect", () => {
        game.removePlayer({ playerId });

        console.log(`> PLAYER disconnect ${playerId}`);
    });

    socket.on("move-player", (command) => {
        /**
         * Ao sobreescrever as informações aqui no
         * server-side, garanto que o usuario não
         * burle as regras!
         */
        command.playerId = playerId;
        command.type = "move-player";

        game.movePlayer(command);
    });
});

server.listen(3000, () => {
    console.log("> SERVER listening on port: 3000");
});
