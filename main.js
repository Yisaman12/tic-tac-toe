const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartButton = document.getElementById('restart');
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let option = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let gameMode = "";   // pvp or bot
let botDifficulty = "hard"; // easy | medium | hard

initialzeGame();
function initialzeGame(){
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartButton.addEventListener('click', restartGame);
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    running = true;
    updateTurnTheme();
}

function cellClicked(){
    const cellIndex = this.getAttribute('cellIndex');
    if (option[cellIndex] !== "" || !running) {
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();
    // ===== BOT TURN TRIGGER =====
if(gameMode === "bot" && running && currentPlayer === "O"){
    setTimeout(botMove, 400);
}
}

function updateCell(cell, index){
    option[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer); // adds X or O class for color
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    updateTurnTheme();
}

function checkWinner(){
    let roundWon = false;
    
    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = option[condition[0]];
        const cellB = option[condition[1]];
        const cellC = option[condition[2]];
        
        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }
        
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }
    
    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        running = false;
    }
    else if (!option.includes("")) {
        statusText.textContent = "Draw!";
        running = false;
    }
    else {
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X";
    updateTurnTheme();
    option = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
    
}
function minimax(board, depth, isMaximizing) {
    let result = checkInternalWinner(board); // A helper function that returns 'X', 'O', or 'Draw'
    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
// ===== START GAME FROM MENU =====
function startGame(mode){
    gameMode = mode;
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initializeGame(); // your existing start function
}

// OPTIONAL back button later
function goToMenu(){
    document.getElementById("menu").style.display = "block";
    document.getElementById("gameContainer").style.display = "none";
    restartGame(); // your existing restart
}
// ===== BOT AI MOVE =====
function botMove(){

    let emptyCells = option.map((val, i) => val === "" ? i : null).filter(v => v !== null);

    let move;

    // EASY → random
    if(botDifficulty === "easy"){
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // MEDIUM → 50% smart, 50% random
    else if(botDifficulty === "medium"){
        if(Math.random() < 0.5){
            move = getBestMove() ?? emptyCells[Math.floor(Math.random() * emptyCells.length)];
        } else {
            move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    }

    // HARD → always smart
    else if(botDifficulty === "hard"){
        move = getBestMove() ?? emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const cell = document.querySelector(`[cellIndex='${move}']`);
    updateCell(cell, move);
    checkWinner();
}
function getBestMove(){
    // Try win
    for(let i=0;i<winConditions.length;i++){
        let [a,b,c] = winConditions[i];
        let line = [option[a], option[b], option[c]];

        if(line.filter(v=>v==="O").length===2 && line.includes("")){
            return [a,b,c][line.indexOf("")];
        }
    }

    // Block player
    for(let i=0;i<winConditions.length;i++){
        let [a,b,c] = winConditions[i];
        let line = [option[a], option[b], option[c]];

        if(line.filter(v=>v==="X").length===2 && line.includes("")){
            return [a,b,c][line.indexOf("")];
        }
    }

    return null;
}
function updateTurnTheme(){
    document.body.classList.remove("turnX", "turnO");

    if(currentPlayer === "X"){
        document.body.classList.add("turnX");
    } else {
        document.body.classList.add("turnO");
    }
}
