import { Game } from "/scripts/game.js";

// Obtiene los elementos del DOM

const canvasTetris = document.getElementById('canvas-tetris');
const canvasNext = document.getElementById('canvas-next');
const canvasHold = document.getElementById('canvas-hold');
const score = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const menu = document.getElementById('menu');
const gameOver = document.getElementById('game-over');
const btnStart = document.getElementById('btn-start');
const btnControls = document.getElementById('btn-controls');
const controls = document.getElementById('show-controls');

// Configuración del juego

const rows = 20;
const cols = 10;
const cellSize = 26;
const space = 2;

let firstMatch = true;

// Crea una nueva instancia del juego

const game = new Game(canvasTetris, rows, cols, cellSize, space, canvasNext, canvasHold);

// Función de actualización del juego
function update(){
    if(game.gameOver){
        // Muestra el menú y la puntuación final si el juego ha terminado
        menu.style.display = 'flex';
        finalScore.innerHTML = game.score;   
        if(!firstMatch){         
            gameOver.style.display = 'flex';
        }
    }
    else {
        // Actualiza el juego y la puntuación
        game.update();
        score.innerHTML = game.score;
    }
    // Solicita la siguiente animación
    requestAnimationFrame(update);
}

// Evento para el botón de inicio
btnStart.addEventListener('click', () => {
    setTimeout(() => {
        // Oculta el menú y reinicia el juego
        menu.style.display = 'none';
        firstMatch = false;
        game.reset();
    }, 200);
});

// Evento para el botón de controles
btnControls.addEventListener('click', () => {
    const computedStyle = getComputedStyle(controls).display;
    if(computedStyle === 'none'){
        controls.style.display = 'flex';
    } else {
        controls.style.display = 'none';
    }
});


game.gameOver = true;
update();