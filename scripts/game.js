import { TetrominoBag } from "/scripts/tetromino.js";
import { BoardTetris, BoardNext, BoardHold } from "/scripts/boardTetris.js";

export class Game{
    constructor(canvas, rows, cols, cellSize, space, canvasNext, canvasHold){
        // Inicializa el tablero de Tetris, la bolsa de tetrominos y el primer tetromino
        this.boardTetris = new BoardTetris(canvas, rows, cols, cellSize, space);
        this.tetrominoBag = new TetrominoBag(canvas, cellSize);
        this.currentTetromino = this.tetrominoBag.nextTetromino();
        this.keyboardEvent();

        // Inicializa las teclas y los tiempos
        this.keys = {up:false, space:false};
        this.lastTime = 0;
        this.lastTime2 = 0;

        // Inicializa los tableros de siguiente y de hold
        this.next = new BoardNext(canvasNext, 8, 4, cellSize, space, this.tetrominoBag.threeNextTetrominos);
        this.hold = new BoardHold(canvasHold, 2, 4, cellSize, space);
        this.canHold = true;

        // Inicializa la puntuación y el estado de fin de juego
        this.score = 0;
        this.gameOver = false;
    }

    // Método para actualizar el estado del juego
    update(){
        let currentTime = Date.now();
        let deltaTime = currentTime - this.lastTime;
        let deltaTime2 = currentTime - this.lastTime2;

        // Mueve el tetromino automáticamente cada segundo
        if(deltaTime > 1000){
            this.autoMoveTetromino();
            this.lastTime = currentTime;
        }

        // Dibuja el tablero y los tetrominos cada 50 milisegundos
        if(deltaTime2 > 50){
            this.boardTetris.draw();
            if(this.currentTetromino){
                this.drawTetrominoGhost();
                this.currentTetromino.draw(this.boardTetris);
            }

            this.next.draw2();
            this.hold.draw2();

            this.lastTime2 = currentTime;
        }
        
    }

    // Método para verificar si el tetromino está bloqueado
    blockedTetromino(){
        const tetrominoPositions = this.currentTetromino.currentPositions();
        for(let i = 0; i < tetrominoPositions.length; i++){
            if(!this.boardTetris.isEmpty(tetrominoPositions[i].row, tetrominoPositions[i].column)){
                return true;
            }
        }
        return false;
    }

    // Método para mover el tetromino a la izquierda
    moveTetrominoLeft(){
        this.currentTetromino.move(0, -1);
        if(this.blockedTetromino()){
            this.currentTetromino.move(0, 1);
        }
    }

    // Método para mover el tetromino a la derecha
    moveTetrominoRight(){
        this.currentTetromino.move(0, 1);
        if(this.blockedTetromino()){
            this.currentTetromino.move(0, -1);
        }
    }

    // Método para mover el tetromino hacia abajo
    moveTetrominoDown(){
        this.currentTetromino.move(1, 0);
        if(this.blockedTetromino()){
            this.currentTetromino.move(-1, 0);
            this.placeTetromino();
        }
    }

    // Método para mover el tetromino automáticamente hacia abajo
    autoMoveTetromino(){
        this.currentTetromino.move(1, 0);
        if(this.blockedTetromino()){
            this.currentTetromino.move(-1, 0);
            this.placeTetromino();
        }
    }

    // Método para rotar el tetromino en sentido horario
    rotationTetrominoCW(){
        this.currentTetromino.rotation++;
        if(this.currentTetromino.rotation > this.currentTetromino.shapes.length - 1){
            this.currentTetromino.rotation = 0;
        }
        if(this.blockedTetromino()){
            this.rotationTetrominoCCW();
        }
    }

    // Método para rotar el tetromino en sentido antihorario
    rotationTetrominoCCW(){
        this.currentTetromino.rotation--;
        if(this.currentTetromino.rotation < 0){
            this.currentTetromino.rotation = this.currentTetromino.shapes.length - 1;
        }
        if(this.blockedTetromino()){
            this.rotationTetrominoCW();
        }
    }

    // Método para colocar el tetromino en el tablero
    placeTetromino(){
        const tetrominoPositions = this.currentTetromino.currentPositions();
        for(let i = 0; i < tetrominoPositions.length; i++){
            this.boardTetris.matrix[
                tetrominoPositions[i].row]
                [tetrominoPositions[i].column] = this.currentTetromino.id;
        }

        //Aumenta la puntuación si se completa una fila
        this.score += this.boardTetris.clearFullRows()*7;

        //Verifica si el juego ha terminado
        if(this.boardTetris.gameOver()){
            setTimeout(() => {
                this.gameOver = true;
            }, 500);
            return true;
        } else {
            //Si el juego no ha terminado, obtiene un nuevo tetromino
            this.currentTetromino = this.tetrominoBag.nextTetromino();
            //Actualiza la lista de tetrominos siguientes
            this.next.listTetrominos = this.tetrominoBag.getThreeNextTetrominos();
            //Actualiza la matriz de tetrominos siguientes
            this.next.updateMatrix();
            //Permite mantener un tetromino de nuevo
            this.canHold = true;
        }
    }

    // Método para calcular la distancia de caída de un tetromino desde una posición específica 
    dropDistance(position){
        let distance = 0;
        while(this.boardTetris.isEmpty(position.row + distance + 1, position.column)){
            distance++;
        }
        return distance
    }

    // Método para calcular la distancia mínima de caída del tetromino actual
    tetrominoDropDistance(){
        let drop = this.boardTetris.rows;
        const tetrominoPositions = this.currentTetromino.currentPositions();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            drop = Math.min(drop, this.dropDistance(tetrominoPositions[i]));
        }
        return drop;
    }

    // Método para dejar caer el tetromino actual hasta la distancia mínima de caída
    dropBlock(){
        this.currentTetromino.move(this.tetrominoDropDistance(), 0);
        this.placeTetromino();
    }

    // Método para dibujar la sombra del tetromino actual en su posición de caída
    drawTetrominoGhost(){
        // Calcula la distancia mínima de caída del tetromino actual
        const dropDistance = this.tetrominoDropDistance();

        // Obtiene las posiciones actuales del tetromino
        const tetrominoPositions = this.currentTetromino.currentPositions();

        // Dibuja la sombra del tetromino en su posición de caída
        for (let i = 0; i < tetrominoPositions.length; i++) {
            // Obtiene las coordenadas de la posición de caída
            let position = this.boardTetris.getCoordinates(
                tetrominoPositions[i].column,
                tetrominoPositions[i].row + dropDistance 
            );

            // Dibuja un cuadrado en la posición de caída con un color específico para la sombra
            this.boardTetris.drawSquare(position.x, position.y, this.boardTetris.cellSize, "#000", 'white', 20);
        }    
    }

    // Método para mantener colocar un tetromino en espera o cambiar el tetromino actual por el tetromino en reserva
    holdTetromino(){
        // Si no se puede mantener un tetromino, sale del método
        if(!this.canHold) return;

        // Si no hay un tetromino en reserva, guarda el tetromino actual en reserva
        if(this.hold.tetromino === null){
            this.hold.tetromino = this.currentTetromino;

            // Obtiene el siguiente tetromino de la bolsa
            this.currentTetromino = this.tetrominoBag.nextTetromino();
        } else {
            // Si ya hay un tetromino en reserva, intercambia el tetromino actual con el de reserva
            [this.currentTetromino, this.hold.tetromino] = [this.hold.tetromino, this.currentTetromino];
        }
        // Actualiza la matriz del tablero de reserva
        this.hold.updateMatrix();

        // Establece que no se puede mantener otro tetromino hasta que se coloque el actual
        this.canHold = false; 
    }

    //Reinicia el estado del juego, preparandolo para una nueva partida
    reset(){
        // Establece el estado de fin de juego a falso
        this.gameOver = false;
        // Reinicia la matriz del tablero de Tetris
        this.boardTetris.restartMatrix();
        //Establece la puntuación a cero
        this.score = 0;
        //Limpia el tetromino en reserva
        this.hold.tetromino = null;
        //Reinicia la bolsa de tetrominos
        this.tetrominoBag.reset();
        //Obtiene el siguiente tetromino de la lista
        this.currentTetromino = this.tetrominoBag.nextTetromino();

        //Permite mantener un tetromino de nuevo
        this.canHold = true;
        // Reinicia la matriz del tablero de reserva
        this.hold.restartMatrix();
        // Reinicia la matriz del tablero de los próximos tetrominos
        this.next.restartMatrix();
        // Actualiza la lista de los próximos tres tetrominos
        this.next.listTetrominos = this.tetrominoBag.getThreeNextTetrominos();
        // Actualiza la matriz de los próximos tetrominos
        this.next.updateMatrix();
        //Dibuja el tablero de los próximos tetrominos
        this.next.draw2();
    }

    // Método para manejar los eventos del teclado
    keyboardEvent(){
        window.addEventListener('keydown', (event) => {
            if(event.key === 'ArrowLeft'){
                this.moveTetrominoLeft();
            }
            if(event.key === 'ArrowRight'){
                this.moveTetrominoRight();
            }
            if(event.key === 'ArrowDown'){
                this.moveTetrominoDown();
            }
            if(event.key === 'ArrowUp' && !this.keys.up){
                this.rotationTetrominoCW();
                this.keys.up = true;
            }
            if(event.key === ' ' && !this.keys.space){ 
                if(!this.gameOver){
                    this.dropBlock();
                }
                this.keys.space = true;
            }
            if(event.key === 'c' || event.key === 'C'){ 
                this.holdTetromino();
            }
        });
        window.addEventListener('keyup', (event) => {
            if(event.key === 'ArrowUp'){
                this.keys.up = false;
            }
            if(event.key === ' '){
                this.keys.space = false;
            }
        });
    }
}