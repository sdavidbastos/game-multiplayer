export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 20,
            height: 20,
        },
    };

    const observers = [];

    function start() {
        const frequency = 2000;
        setInterval(addFruit, frequency);
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    function addPlayer(command) {
        const { playerId } = command;
        const playerX =
            "playerX" in command
                ? command.playerX
                : Math.floor(Math.random() * state.screen.width);
        const playerY =
            "playerY" in command
                ? command.playerY
                : Math.floor(Math.random() * state.screen.height);

        state.players[playerId] = {
            x: playerX,
            y: playerY,
        };

        notifyAll({
            type: "add-player",
            playerId,
            playerX,
            playerY,
        });
    }

    function removePlayer(command) {
        const { playerId } = command;

        delete state.players[playerId];

        notifyAll({ type: "remove-player", playerId });
    }

    function addFruit(command) {
        const fruitId = command
            ? command.fruitId
            : Math.floor(Math.random() * 10000000);

        const fruitX = command
            ? command.fruitX
            : Math.floor(state.screen.width * Math.random());

        const fruitY = command
            ? command.fruitY
            : Math.floor(state.screen.height * Math.random());

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY,
        };
        notifyAll({
            type: "add-fruit",
            fruitId,
            fruitX,
            fruitY,
        });
    }

    function removeFruit(command) {
        const { fruitId } = command;

        delete state.fruits[fruitId];

        notifyAll({
            type: "remove-fruit",
            fruitId
        })
    }

    function movePlayer(command) {
        /**
         * Notifica todos observers sobre
         * o evento
         */
        notifyAll(command);
        const { playerId, keyPressed } = command;
        const { players, screen } = state;

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

        if (players[playerId] && moveFunction) {
            moveFunction(players[playerId]);
            checkForFruitCollision(playerId);
        }
    }

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId];
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];
            console.log(`[CHECKING] ${playerId} and ${fruitId}`);
            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`[COLLISION] ${playerId} and ${fruitId}`);
                removeFruit({ fruitId });
            }
        }
    }

    /**
     * Object.assign:
     * Faz um merge. Trocando somente o necessario
     * e adicionado novas informações
     */

    function setState(newState) {
        Object.assign(state, newState);
    }

    return {
        start,
        addFruit,
        removeFruit,
        addPlayer,
        removePlayer,
        movePlayer,
        state,
        setState,
        subscribe,
    };
}
