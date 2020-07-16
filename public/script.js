import createGame from "./game.js";
import createKeyboardListener from "./keyboard-listener.js";
import renderScreen from "./render-screen.js";

const game = createGame();

const keyboardListener = createKeyboardListener(document);
keyboardListener.subscribe(game.movePlayer);

/**
 * Event Emmiter:
 * é semelhante ao observer, porem é
 * possivel colocar um nome no evento. (basicamente)
 */

const socket = io();

socket.on("connect", () => {
    const playerId = socket.id;
    const screen = document.querySelector("#screen");
    renderScreen(screen, game, requestAnimationFrame, playerId);

    console.log(`> PLAYER connected: ${playerId}`);
});

socket.on("setup", (state) => {
    const playerId = socket.id;
    game.setState(state);

    keyboardListener.registerPlayerId(playerId);
    keyboardListener.subscribe((command) => {
        socket.emit("move-player", command);
    });
});

socket.on("add-player", (command) => {
    console.log(`> RECEIVING ${command.type} -> ${command.playerId}`);
    game.addPlayer(command);
});

socket.on("remove-player", (command) => {
    console.log(`> RECEIVED ${command.type} -> ${command.playerId}`);
    game.removePlayer(command);
});

socket.on("move-player", (command) => {
    console.log(`> RECEIVING ${command.type} -> ${command.playerId}`);
    const playerId = socket.id;

    /**
     * Condicional garante que não haja duplicidade no
     * commando. Visto que eu emite o evento para o server, logo
     * não quero que aplique novamente no meu client
     * state.
     */
    if (playerId !== command.playerId) {
        game.movePlayer(command);
    }
});

socket.on("add-fruit", (command)=>{
    console.log(`> RECEIVING ${command.type} -> ${command.fruitId}`)
    game.addFruit(command)
})

socket.on("remove-fruit", command =>{
    console.log(`> RECEIVING ${command.type} -> ${command.fruitId}`)
    game.removeFruit(command)
})