import { Tetromino } from "/scripts/tetromino.js";

//Clase Grid representa la cuadrícula de juego
export class Grid {
    constructor(canvas, rows, cols, cellSize, space) {
        // Canvas donde se dibuja la cuadrícula
        this.canvas = canvas;
        // Contexto 2D del canvas
        this.ctx = canvas.getContext('2d');
        //Número de filas de la cuadrícula
        this.rows = rows;
        //Número de columnas de la cuadrícula
        this.cols = cols;
        //Tamaño de las celdas de la cuadrícula
        this.cellSize = cellSize;
        //Espacio entre las celdas de la cuadrícula
        this.space = space;
        //Matriz que representa el estado de la cuadrícula
        this.matrix = [];
        //Inicializa la matriz
        this.restartMatrix();

        //Ajusta el ancho y alto de la cuadricula al número de filas, columnas, espaciado y tamaño de celdas
        this.canvas.width = this.cols * this.cellSize + (this.space * this.cols);
        this.canvas.height = this.rows * this.cellSize + (this.space * this.rows);

        // Crea un nuevo Tetromino
        this.block = new Tetromino(this.canvas, this.cellSize);
    }

    // Método para reiniciar la matriz, llenándola de ceros
    restartMatrix() {
        for (let r = 0; r < this.rows; r++) {
            this.matrix[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.matrix[r][c] = 0;
            }
        }
    }

    // Método para dibujar un cuadrado en la cuadrícula
    drawSquare(x, y, side, color, borderColor, border) {
        const borderSize = side / border;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, side, side);

        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = borderSize;
        this.ctx.strokeRect(x + borderSize / 2, y + borderSize / 2, side - borderSize, side - borderSize);
    }

    // Método para obtener las coordenadas de una celda en la cuadrícula
    getCoordinates(col, row) {
        return { x: col * (this.cellSize + this.space), y: row * (this.cellSize + this.space) };
    }

    //Metodo encargado de dibujar en la cuadrícula del juego.
    draw() {
        //Recorre cada una de las filas
        for (let r = 0; r < this.rows; r++) {
            //Dentro de cada fila, se recorren las columnas
            for (let c = 0; c < this.cols; c++) {
                //Se obtienen las coordenadas de la celda actual
                const position = this.getCoordinates(c, r);
                if (this.matrix[r][c] !== 0) {
                    //Si el valor de la celda es diferente de 0, se dibuja el bloque correspondiente
                    this.block.drawBlock(position.x, position.y, this.matrix[r][c]);
                } else {
                    //Si el valor de la celda es 0, se dibuja un cuadrado vacío
                    this.drawSquare(position.x, position.y, this.cellSize, "#000", '#303030', 10);
                }
            }
        }

        this.printMatrix();
    }

    //Similar al método draw, pero siempre solo dibuja cuando el valor de la celda es diferente de 0
    //Se usa para dibujar los tetrominos siguientes y el tetromino guardado
    draw2 () {
        this.drawBackGround();
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const position = this.getCoordinates(c, r);

                if (this.matrix[r][c] !== 0) {

                    if(this.matrix[r][c] === 2){
                        this.block.drawBlock(position.x + this.cellSize, position.y, this.matrix[r][c]);
                    } else if (this.matrix[r][c] === 3){
                        this.block.drawBlock(position.x, position.y, this.matrix[r][c]);
                    } else {
                        this.block.drawBlock(position.x + this.cellSize/2, position.y, this.matrix[r][c]);
                    }
                }
            }
        }
    }

    //Metodo para rellenar el fondo de color negro
    drawBackGround() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //Metodo para imprimir la matriz en formato de texto
    printMatrix() {
        let text = '';
        this.matrix.forEach(row => {
            //Por cada fila se muestran todos sus elementos separados por un espacio y un salto de linea al final
            text += row.join(' ') + '\n';
        });
        //Se muestra por consola el resultado
        console.log(text);
    }
}