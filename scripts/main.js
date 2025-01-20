import { Game } from "/scripts/game.js";

//TODO: Header y estilos.
//TODO: Aumento de niveles según puntuación.
//TODO: Panel donde se muestre el nivel actual y el numero de lineas completadas.
//TODO: Controles para movil.
//TODO: Pausar musica cuando no es la pestaña activa
//TODO: README.md

// Obtiene los elementos del DOM
const canvasTetris = document.getElementById('canvas-tetris');
const canvasNext = document.getElementById('canvas-next');
const canvasHold = document.getElementById('canvas-hold');
const score = document.getElementById('score');
const highScore = document.getElementById('high-score');
const finalScore = document.getElementById('final-score');
const menu = document.getElementById('menu');
const points = document.getElementById('points');
const gameOver = document.getElementById('game-over');
const btnStart = document.getElementById('btn-start');
const btnControls = document.getElementById('btn-controls');
const controls = document.getElementById('show-controls');
const musicCheckbox = document.getElementById('music');
const soundCheckbox = document.getElementById('sound');

let musicActive = musicCheckbox.checked;
let soundActive = soundCheckbox.checked;


// Configuración del juego
const rows = 20;
const cols = 10;
const cellSize = 26;
const space = 2;

let firstMatch = true;
let scoreStorage = 0;

// Crea una nueva instancia del juego
const game = new Game(canvasTetris, rows, cols, cellSize, space, canvasNext, canvasHold, soundActive, musicActive);

const gameMusic = new Audio('/assets/sounds/music.mp3');
gameMusic.volume = 0.3;
gameMusic.loop = true;
gameMusic.load();

// Función de actualización del juego
function update(){
    if(game.gameOver){

        //Detiene la musica cuando se acaba la partida
        gameMusic.pause();
        gameMusic.currentTime = 0;

        // Muestra el menú y la puntuación final si el juego ha terminado
        finalScore.innerHTML = game.score;
        menu.style.display = 'flex';
        
        //Si la puntuación de la partida es mayor que la puntuación máxima, la guarda como puntuación máxima
        if(game.score > scoreStorage){
            localStorage.setItem('high-score', game.score);
            //Se llama a la función getHighScore para actualizar la variable 'scoreStorage'
            getHighScore();
        }
        // Muestra la puntuación máxima al final si el juego ha terminado
        highScore.innerHTML = scoreStorage;
        points.style.display = 'flex';

        if(!firstMatch){         
            gameOver.style.display = 'flex';
        }
    }
    else {
        if(musicActive && gameMusic.paused){
            gameMusic.play();
        }
        // Actualiza el juego y la puntuación
        game.update();
        score.innerHTML = game.score;
    }
    // Solicita la siguiente animación
    requestAnimationFrame(update);
}

//Recupera la puntuación máxima del localStorage, si no existe la establece a 0
function getHighScore(){
    if(localStorage.getItem('high-score') == null){
        localStorage.setItem('high-score', 0);
    } else {
        scoreStorage = localStorage.getItem('high-score');
    }
}

// Evento para el botón de inicio
btnStart.addEventListener('click', () => {
    setTimeout(() => {
        // Oculta el menú, la puntuación máxima y reinicia el juego
        menu.style.display = 'none';
        points.style.display = 'none';
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

//Evento para activar o desactivar la musica en el juego
musicCheckbox.addEventListener('change', (event) =>{
    musicActive = event.target.checked;
    game.musicActive = musicActive;
});

//Evento para activar o desactivar los efectos de sonido en el juego
soundCheckbox.addEventListener('change', (event)=>{
    soundActive = event.target.checked;
    game.soundActive = soundActive;
})


game.gameOver = true;
getHighScore();
update();