import { TetrominoBag } from "/scripts/tetromino.js";
import { BoardTetris, BoardNext, BoardHold } from "/scripts/boardTetris.js";

export class Game{
    constructor(canvas, rows, cols, cellSize, space, canvasNext, canvasHold){
        this.boardTetris = new BoardTetris(canvas, rows, cols, cellSize, space);
        this.tetrominoBag = new TetrominoBag(canvas, cellSize);
        this.currentTetromino = this.tetrominoBag.nextTetromino();
        this.keyboardEvent();

        this.keys = {up:false, space:false};
        this.lastTime = 0;
        this.lastTime2 = 0;

        this.next = new BoardNext(canvasNext, 8, 4, cellSize, space, this.tetrominoBag.threeNextTetrominos);
        this.hold = new BoardHold(canvasHold, 2, 4, cellSize, space);
        this.canHold = true;
    }

    update(){
        let currentTime = Date.now();
        let deltaTime = currentTime - this.lastTime;
        let deltaTime2 = currentTime - this.lastTime2;

        if(deltaTime > 1000){
            this.autoMoveTetromino();
            this.lastTime = currentTime;
        }

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

    blockedTetromino(){
        const tetrominoPositions = this.currentTetromino.currentPositions();
        for(let i = 0; i < tetrominoPositions.length; i++){
            if(!this.boardTetris.isEmpty(tetrominoPositions[i].row, tetrominoPositions[i].column)){
                return true;
            }
        }
        return false;
    }


    moveTetrominoLeft(){
        this.currentTetromino.move(0, -1);
        if(this.blockedTetromino()){
            this.currentTetromino.move(0, 1);
        }
    }

    moveTetrominoRight(){
        this.currentTetromino.move(0, 1);
        if(this.blockedTetromino()){
            this.currentTetromino.move(0, -1);
        }
    }

    moveTetrominoDown(){
        this.currentTetromino.move(1, 0);
        if(this.blockedTetromino()){
            this.currentTetromino.move(-1, 0);
            this.placeTetromino();
        }
    }

    autoMoveTetromino(){
        this.currentTetromino.move(1, 0);
        if(this.blockedTetromino()){
            this.currentTetromino.move(-1, 0);
            this.placeTetromino();
        }
    }

    rotationTetrominoCW(){
        this.currentTetromino.rotation++;
        if(this.currentTetromino.rotation > this.currentTetromino.shapes.length - 1){
            this.currentTetromino.rotation = 0;
        }
        if(this.blockedTetromino()){
            this.rotationTetrominoCCW();
        }
    }

    rotationTetrominoCCW(){
        this.currentTetromino.rotation--;
        if(this.currentTetromino.rotation < 0){
            this.currentTetromino.rotation = this.currentTetromino.shapes.length - 1;
        }
        if(this.blockedTetromino()){
            this.rotationTetrominoCW();
        }
    }

    placeTetromino(){
        const tetrominoPositions = this.currentTetromino.currentPositions();
        for(let i = 0; i < tetrominoPositions.length; i++){
            this.boardTetris.matrix[
                tetrominoPositions[i].row]
                [tetrominoPositions[i].column] = this.currentTetromino.id;
        }

        this.boardTetris.clearFullRows();

        if(this.boardTetris.gameOver()){
            return true;
        } else {
            this.currentTetromino = this.tetrominoBag.nextTetromino();
            this.next.listTetrominos = this.tetrominoBag.getThreeNextTetrominos();
            this.next.updateMatrix();
            this.canHold = true;
        }
    }

    dropDistance(position){
        let distance = 0;
        while(this.boardTetris.isEmpty(position.row + distance + 1, position.column)){
            distance++;
        }
        return distance
    }

    tetrominoDropDistance(){
        let drop = this.boardTetris.rows;
        const tetrominoPositions = this.currentTetromino.currentPositions();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            drop = Math.min(drop, this.dropDistance(tetrominoPositions[i]));
        }
        return drop;
    }

    dropBlock(){
        this.currentTetromino.move(this.tetrominoDropDistance(), 0);
        this.placeTetromino();
    }

    drawTetrominoGhost(){
        const dropDistance = this.tetrominoDropDistance();
        const tetrominoPositions = this.currentTetromino.currentPositions();
        for (let i = 0; i < tetrominoPositions.length; i++) {
            let position = this.boardTetris.getCoordinates(
                tetrominoPositions[i].column,
                tetrominoPositions[i].row + dropDistance 
            );
            this.boardTetris.drawSquare(position.x, position.y, this.boardTetris.cellSize, "#000", 'white', 20);
        }    
    }

    holdTetromino(){
        if(!this.canHold) return;
        if(this.hold.tetromino === null){
            this.hold.tetromino = this.currentTetromino;
            this.currentTetromino = this.tetrominoBag.nextTetromino();
        } else {
            [this.currentTetromino, this.hold.tetromino] = [this.hold.tetromino, this.currentTetromino];
        }
        this.hold.updateMatrix();
        this.canHold = false; 
    }

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
                this.dropBlock();
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