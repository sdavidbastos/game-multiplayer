import createGame from "./game.js";
import createKeyboardListener from "./keyboard-listener.js";
import renderScreen from "./render-screen.js";

const game = createGame();

const keyboardListener = createKeyboardListener(document);
keyboardListener.subscribe(game.movePlayer);


/**
 * event emmiter
 * semelhante ao observer, porem é
 * possivel colocar um nome.
 */

const socket = io();

socket.on("connect", () => {
    const playerId = socket.id;
    const screen = document.querySelector("#screen");
    renderScreen(screen, game, requestAnimationFrame, playerId);

    console.log(`> PLAYER connected: ${playerId}`);
});

socket.on("setup", (state) => {
    const playerId = socket.id
    game.setState(state);

    keyboardListener.registerPlayerId(playerId)
    keyboardListener.subscribe(game.movePlayer)
    keyboardListener.subscribe((command)=>{
        socket.emit("move-player", command)
    })
});

socket.on("add-player", (command) => {
    console.log(`> RECEIVING: ${command.type} -> ${command.playerId}`);
    game.addPlayer(command)
});

socket.on("remove-player", (command)=>{
    console.log(`> RECEIVED ${command.type} -> ${command.playerId}`)
    game.removePlayer(command)
})

socket.on("move-player", (command) => {
    console.log(`Receiving ${command.type} -> ${command.playerId}`)

    const playerId = socket.id

    if(playerId !== command.playerId){
        game.movePlayer(command)
    }
})
