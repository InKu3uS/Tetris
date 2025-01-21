import { Game } from "/scripts/game.js";
import { BoardTetris } from '/scripts/boardTetris.js';

//TODO: Header y estilos.
//TODO: Aumento de niveles según puntuación.
//TODO: Controles para movil.
//TODO: README.md
//TODO: Mover manualmente la pieza hacia abajo da puntos, moverla de golpe tambien.

// Tablero de juego
const canvasTetris = document.getElementById('canvas-tetris');
// Canvas para las siguientes pieza
const canvasNext = document.getElementById('canvas-next');
// Canvas para la pieza en espera
const canvasHold = document.getElementById('canvas-hold');

//Puntuación de la partida
const score = document.getElementById('score');
//Puntuación máxima alcanzada
const highScore = document.getElementById('high-score');
//Puntuación final de la partida
const finalScore = document.getElementById('final-score');
//Nivel final alcanzado
const finalLevel = document.getElementById('final-level');

//Div que muestra la puntuación final
const points = document.getElementById('points');
//Div que muestra el nivel alcanzado
const levels = document.getElementById('levels');
//Div que muestra el mensaje de game over
const gameOver = document.getElementById('game-over');

//Menú de inicio
const menu = document.getElementById('menu');
//Botón de inicio
const btnStart = document.getElementById('btn-start');
//Botón de controles
const btnControls = document.getElementById('btn-controls');
//Div que muestra los controles
const controls = document.getElementById('show-controls');
//Checkbox para activar o desactivar la música
const musicCheckbox = document.getElementById('music');
//Checkbox para activar o desactivar los efectos de sonido
const soundCheckbox = document.getElementById('sound');

//Variable que almacena si la música está activa o no
let musicActive = musicCheckbox.checked;
//Variable que almacena si el sonido está activo o no
let soundActive = soundCheckbox.checked;


// Configuración del juego
const rows = 20;
const cols = 10;
const cellSize = 26;
const space = 2;

//Variable que almacena si es la primera partida
let firstMatch = true;
//Variable que almacena la puntuación máxima
let scoreStorage = 0;

// Crea una nueva instancia del juego
const game = new Game(canvasTetris, rows, cols, cellSize, space, canvasNext, canvasHold, soundActive, musicActive);

//Elemento que reproduce la música de fondo
const gameMusic = document.createElement('audio');
gameMusic.src = '/assets/sounds/music.mp3';
gameMusic.volume = 0.3;
gameMusic.loop = true;
gameMusic.style.display = 'none';
gameMusic.playbackRate = 1;
document.body.appendChild(gameMusic);

// Función de actualización del juego
function update(){
    if(game.gameOver){

        //Detiene la musica cuando se acaba la partida
        gameMusic.pause();
        gameMusic.currentTime = 0;

        // Muestra el menú y la puntuación final y el nivel alcanzado si el juego ha terminado
        finalScore.innerHTML = game.score;
        finalLevel.innerHTML = game.level;
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

        //Si el estado del juego es game over y no es la primera partida
        // muestra el mensaje de game over
        if(!firstMatch){         
            gameOver.style.display = 'flex';
        }
    }
    else {
        //Reproduce la música si está activa y el juego no está pausado
        if(musicActive && gameMusic.paused && document.visibilityState === 'visible'){
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
        levels.innerHTML = game.level;
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
    game.setSoundActive(soundActive);
});

// Evento para pausar la música cuando la pestaña no es activa y reproducirla cuando es activa
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gameMusic.pause();
    } else {
        if (musicActive) {
            gameMusic.play();
        }
    }
});


game.gameOver = true;
getHighScore();
update();