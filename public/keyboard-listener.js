export default function createKeyboardListener(document) {
    const state = {
        observers: [],
        playerId: null
    };
    
    function registerPlayerId(playerId){
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    /**
     * command é um objeto em 
     * geral com dois ou mais parametros
     * {type: "", playerId: ""}
     * 
     * O notifyAll executa esse parâmetro para
     * todas as funções do subscribe
     */
    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    document.addEventListener("keydown", handleKeyDown);

    function handleKeyDown(event) {
        const keyPressed = event.key;

        const command = {
            type: "move-player",
            playerId: state.playerId,
            keyPressed,
        };

        notifyAll(command);

    }
    return {
        subscribe,
        registerPlayerId
    };
}