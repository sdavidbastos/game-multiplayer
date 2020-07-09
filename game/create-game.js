export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen:{
            width: window.screen,
            height: 20
        }
    };
    

    function addPlayer(command) {
        const { playerId, playerX, playerY } = command;

        state.players[playerId] = {
            x: playerX,
            y: playerY,
        };
    }

    function removePlayer(command) {
        const { playerId } = command;

        delete state.players[playerId];
    }

    function addFruit(command) {
        const { fruitId, fruitX, fruitY } = command;

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY,
        };
    }

    function removeFruit(command) {
        const { fruitId } = command;

        delete state.fruits[fruitId];
    }

    function movePlayer(command) {
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
    return {
        addFruit,
        removeFruit,
        addPlayer,
        removePlayer,
        movePlayer,
        state,
    };
}
