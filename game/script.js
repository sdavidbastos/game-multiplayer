import createKeyboardListener from "./keyboard-listener.js"
import createGame from "./create-game.js"
import renderScreen from "./render-screen.js"

const screen = document.querySelector("#screen");

const game = createGame();

const keyboardListener = createKeyboardListener(document);
keyboardListener.subscribe(game.movePlayer);

game.addPlayer({ playerId: "player1", playerX: 0, playerY: 0 });
game.addPlayer({ playerId: "david", playerX: 2, playerY: 8 });
game.addPlayer({ playerId: "bino", playerX: 4, playerY: 6 });
game.addFruit({ fruitId: "fruit1", fruitX: 10, fruitY: 10 });
game.addFruit({ fruitId: "fruit2", fruitX: 18, fruitY: 18 });
game.addFruit({ fruitId: "fruit3", fruitX: 6, fruitY: 15 });

renderScreen(screen, game, requestAnimationFrame);