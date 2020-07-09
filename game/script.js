const screen = document.querySelector("#screen");

const context = screen.getContext("2d");

const currentPlayerId = "player1";

function createGame() {
    const state = {
        players: {
            player1: { x: 1, y: 3 },
            player2: { x: 6, y: 3 },
        },
        fruits: {
            fruit: { x: 3, y: 4 },
        },
    };

    function movePlayer(command) {
        const { playerId, keyPressed } = command;
        const { players } = state;

        console.log(`[game.movePlayer()] ${keyPressed}`);

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y -= 1;
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < screen.width) {
                    player.x += 1;
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < screen.width) {
                    player.y += 1;
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x -= 1;
                }
            },
        };

        const moveFunction = acceptedMoves[keyPressed];

        if (moveFunction) {
            moveFunction(players[playerId]);
        }
    }
    return {
        movePlayer,
        state,
    };
}

const game = createGame();

const keyboardListener = createKeyboardListener();

keyboardListener.subscribe(game.movePlayer);

function createKeyboardListener() {
    const state = {
        observers: [],
    };

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command) {
        console.log(
            `[keyboardListener] Notififying ${state.observers.length} observers`
        );

        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    window.addEventListener("keydown", handleKeyDown);

    function handleKeyDown(event) {
        const keyPressed = event.key;

        const command = {
            playerId: "player1",
            keyPressed,
        };

        notifyAll(command);

        // game.movePlayer(command);
    }
    return {
        subscribe,
    };
}

renderScreen();

function renderScreen() {
    context.clearRect(0, 0, 10, 10);
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        context.fillStyle = "black";
        context.fillRect(player.x, player.y, 1, 1);
    }
    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = "green";
        context.fillRect(fruit.x, fruit.y, 1, 1);
    }
    requestAnimationFrame(renderScreen);
}
