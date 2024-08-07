// Firebase setup
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

// Functions
function goBack(page) {
    document.getElementById('container').style.display = page === 'container' ? 'block' : 'none';
    document.getElementById('multiplayerOptions').style.display = page === 'multiplayerOptions' ? 'block' : 'none';
    document.getElementById('roomOptions').style.display = page === 'roomOptions' ? 'block' : 'none';
    document.getElementById('gameArea').style.display = page === 'gameArea' ? 'block' : 'none';
    document.getElementById('timer').style.display = page === 'gameArea' ? 'block' : 'none';
    document.getElementById('runButtons').style.display = page === 'gameArea' ? 'block' : 'none';
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
    startGame();
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
        turns: 'player1'
    });
    goBack('gameArea');
    startGame();
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
                startGame();
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

function startGame() {
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
            startTurn();
        }
    }

    interval = setInterval(updateTimer, 1000);

    function startTurn() {
        // Logic for player turns
    }
}

function submitRun(run) {
    // Submit run logic
}

// Initialize
function initializeGame() {
    document.getElementById('container').style.display = 'block';
    document.getElementById('multiplayerOptions').style.display = 'none';
    document.getElementById('roomOptions').style.display = 'none';
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('runButtons').style.display = 'none';
}

initializeGame();
