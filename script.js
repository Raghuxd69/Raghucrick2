import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjpFuQ0Mg9KnthmToMXMw_c0tXIBY2rKo",
    authDomain: "mycrick88497.firebaseapp.com",
    databaseURL: "https://mycrick88497-default-rtdb.firebaseio.com",
    projectId: "mycrick88497",
    storageBucket: "mycrick88497.appspot.com",
    messagingSenderId: "731647894608",
    appId: "1:731647894608:web:3a9267b6b77074a95f9d55",
    measurementId: "G-RDSDMX8ZZ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// State variables
let currentRoom = null;
let playerName = '';
let currentTurn = '';

// Functions
function goBack(page) {
    document.getElementById('container').style.display = page === 'container' ? 'block' : 'none';
    document.getElementById('multiplayerOptions').style.display = page === 'multiplayerOptions' ? 'block' : 'none';
    document.getElementById('roomOptions').style.display = page === 'roomOptions' ? 'block' : 'none';
    document.getElementById('gameArea').style.display = page === 'gameArea' ? 'block' : 'none';
}

function showGameModeOptions() {
    playerName = prompt('Enter your name:');
    if (playerName) {
        goBack('multiplayerOptions');
    } else {
        alert('Please enter your name to proceed.');
    }
}

function startMultiplayer() {
    goBack('roomOptions');
}

function startComputer() {
    goBack('gameArea');
    startGame(true); // True indicates playing against computer
}

function createRoom() {
    const roomCode = generateRoomCode();
    currentRoom = roomCode;
    set(ref(db, 'rooms/' + roomCode), {
        player1: playerName,
        player2: null,
        scores: {
            [playerName]: 0,
            'Computer': 0
        },
        turns: 'player1',
        runs: {
            player1: 0,
            Computer: 0
        }
    });
    goBack('gameArea');
    startGame(false); // False indicates playing with another player
}

function joinRoom() {
    const roomCode = document.getElementById('roomCodeInput').value;
    currentRoom = roomCode;

    get(ref(db, 'rooms/' + roomCode)).then((snapshot) => {
        if (snapshot.exists()) {
            const roomData = snapshot.val();
            if (roomData.player2 === null) {
                set(ref(db, 'rooms/' + roomCode + '/player2'), playerName);
                goBack('gameArea');
                startGame(false);
            } else {
                alert('Room is full or already started');
            }
        } else {
            alert('Room not found');
        }
    });
}

function generateRoomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function startGame(againstComputer) {
    const timerDisplay = document.getElementById('timer');
    const runButtons = document.getElementById('runButtons');
    const scoresDisplay = document.getElementById('scores');

    let timer = 3;
    let interval;

    function updateTimer() {
        if (timer > 0) {
            timerDisplay.innerText = `Game starts in: ${timer}`;
            timer--;
        } else {
            clearInterval(interval);
            timerDisplay.innerText = '';
            runButtons.style.display = 'block';
            startTurn(againstComputer);
        }
    }

    interval = setInterval(updateTimer, 1000);

    function startTurn(againstComputer) {
        if (againstComputer) {
            currentTurn = 'player1'; // Player always starts first
        } else {
            onValue(ref(db, 'rooms/' + currentRoom), (snapshot) => {
                const roomData = snapshot.val();
                currentTurn = roomData.turns;
                updateScores(roomData.scores);
            });
        }
    }
}

function submitRun(run) {
    if (currentRoom) {
        if (currentTurn === 'player1') {
            set(ref(db, 'rooms/' + currentRoom + '/runs/player1'), run);
            currentTurn = 'player2';
        } else if (currentTurn === 'player2') {
            set(ref(db, 'rooms/' + currentRoom + '/runs/player2'), run);
            currentTurn = 'player1';
        }
        set(ref(db, 'rooms/' + currentRoom + '/turns'), currentTurn);
    } else {
        console.error('No room is active.');
    }
}

function updateScores(scores) {
    const scoresDisplay = document.getElementById('scores');
    scoresDisplay.innerHTML = `
        <p>Player 1 Score: ${scores[playerName]}</p>
        <p>Computer Score: ${scores['Computer']}</p>
    `;
}

// Initialize event listeners
document.getElementById('startGameButton').addEventListener('click', showGameModeOptions);
document.getElementById('multiplayerButton').addEventListener('click', startMultiplayer);
document.getElementById('computerButton').addEventListener('click', startComputer);
document.getElementById('createRoomButton').addEventListener('click', createRoom);
document.getElementById('joinRoomButton').addEventListener('click', joinRoom);
document.getElementById('backToHome').addEventListener('click', () => goBack('container'));
document.getElementById('backToMultiplayer').addEventListener('click', () => goBack('multiplayerOptions'));
document.getElementById('backToMultiplayerFromGame').addEventListener('click', () => goBack('multiplayerOptions'));
