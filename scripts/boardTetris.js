import { Grid } from "/scripts/grid.js";

// Clase que extiende de Grid para manejar el tablero de Tetris
export class BoardTetris extends Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        super(canvas, rows, cols, cellSize, space);

        //Lista con las propiedades de audio
        this.sounds = [
            {name: 'simple', path: '/assets/sounds/simple-line.wav', volume: 0.5},
            {name: 'double', path: '/assets/sounds/double-line.wav', volume: 0.5},
            {name: 'triple', path: '/assets/sounds/triple-line.wav', volume: 0.5},
            {name: 'tetris', path: '/assets/sounds/tetris-line.wav', volume: 0.5},
        ];

        this.loadAudio();
    }

    //Se recorre la lista de propiedades de audio, se crea un archivo de audio por cada valor en la lista,
    // se cargan y se establece el volumen para cada uno
    loadAudio(){
        this.audioEffects = {};
        this.sounds.forEach(({name, path, volume}) =>{
            const audio = new Audio(path);
            audio.load();
            audio.volume = volume;
            this.audioEffects[name] = audio;
        });
    }

    // Verifica si una posición está dentro del tablero
    isInside(row, col){
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    //Verifica si una posición está vacía
    isEmpty(row, col){
        return this.isInside(row, col) && this.matrix[row][col] === 0;
    }

    // Verifica si una fila está completa
    isRowFull(row){
        return this.matrix[row].every(element => element !== 0);
    }

    // Verifica si una fila está vacía
    isRowEmpty(row){
        return this.matrix[row].every(element => element === 0);
    }

    //Limpia una fila, llenandola de ceros
    clearRow(row){
        this.matrix[row].fill(0);
    }

    //Mueve una fila hacia abajo
    moveRowDown(row, numRows){
        this.matrix[row + numRows] = this.matrix[row].slice();
        this.clearRow(row);
    }

    //Limpia todas las filas completas
    clearFullRows(){
        let count = 0;
        for(let row = this.rows -1; row>=0; row--){
            if(this.isRowFull(row)){
                this.clearRow(row);
                count++;
                if(count === 1){
                    this.audioEffects['simple'].play();
                } else if(count === 2){
                    this.audioEffects['double'].play();
                } else if(count === 3){
                    this.audioEffects['triple'].play();
                } else if(count ===4){
                    this.audioEffects['tetris'].play();
                }
            } else if(count > 0){
                this.moveRowDown(row, count);
            }
        }

        return count;
    }

    //Verifica si el juego ha terminado (si la fila 0 no está vacía)
    gameOver(){
        return !(this.isRowEmpty(0));
    }
}

// Clase que extiende de Grid para manejar el tablero de las siguientes piezas
export class BoardNext extends Grid {
    constructor(canvas, rows, cols, cellSize, space, listTetrominos) {
        super(canvas, rows, cols, cellSize, space);
        this.listTetrominos = listTetrominos || [];
        this.updateMatrix();
    }

    //Actualiza la matriz con las piezas siguientes
    updateMatrix(){
        //Reinicia la matriz
        this.restartMatrix();
        let cont = 0;
        //Recorre la lista de tetrominos
        for(let i = 0; i < this.listTetrominos.length; i++){
            //Si hay un tetromino en la posición i
            if (this.listTetrominos[i]) {
                //Obtiene la forma actual del tetromino
                const shape = this.listTetrominos[i].currentShape();
                // Recorre cada bloque de la forma del tetromino
                for(let j = 0; j < shape.length; j++){
                    // Recorre cada bloque de la forma del tetromino
                    const row = shape[j].row + cont;
                    const col = shape[j].column;
                    // Verifica que la posición esté dentro de los límites del tablero
                    if (row < this.rows && col < this.cols && row >= 0 && col >= 0) { 
                        this.matrix[row][col] = this.listTetrominos[i].id;
                    }
                }
                // Incrementa el contador para ajustar la posición de los siguientes tetrominos
                cont += 3;
            }
        }
    }

}

// Clase que extiende de Grid para manejar el tablero del tetromino guardado
export class BoardHold extends Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        super(canvas, rows, cols, cellSize, space);
        this.tetromino = null;
        this.updateMatrix();
    }

    //Actualiza la matriz con el tetromino guardado
    updateMatrix(){
        //Si no hay tetromino guardado, no hace nada y retorna
        if(this.tetromino == null) return;
        //Reinicia el tetromino a su estado inicial
        this.tetromino.reset();
        //Reinicia la matriz
        this.restartMatrix();
        //Obtiene la forma actual del tetromino
        const shape = this.tetromino.currentShape();
        // Recorre cada bloque de la forma del tetromino
        for (let i = 0; i < shape.length; i++) {
            // Asigna el ID del tetromino a la posición correspondiente en la matriz del tablero
            this.matrix[shape[i].row][shape[i].column] = this.tetromino.id;
        }
    }
}