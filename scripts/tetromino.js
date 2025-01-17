//Clase que representa una posición en la cuadrícula
export class Position{
    constructor(row, column){
        //Fila de la posición
        this.row = row;
        //Columna de la posición
        this.column = column;
    }
}

//Clase que representa una pieza del Tetris
export class Tetromino {
    constructor(canvas, cellSize, shapes = [], initPosition = new Position(), id=1){
        //Canvas donde se dibuja la pieza
        this.canvas = canvas;
        //Contexto 2D del canvas
        this.ctx = canvas.getContext('2d');
        //Tamaño de las celdas
        this.cellSize = cellSize;
        //Formas del tetromino en diferentes posiciones
        this.shapes = shapes;
        //Rotación actual del tetromino
        this.rotation = 0;
        //Posición inicial del tetromino
        this.initPosition = initPosition;
        //Posición actual del tetromino
        this.position = new Position(initPosition.row, initPosition.column);
        //ID del tetromino
        this.id = id;
    }

    /**
     * Método para dibujar un cuadrado en el canvas
     * @param {*} x posición X del cuadrado
     * @param {*} y posición Y del cuadrado	
     * @param {*} size tamqño del cuadrado
     * @param {*} color color del cuadrado
     */
    drawSquare(x, y, size, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, size, size);
    }

    /**
     * Método para dibujar un triángulo en el canvas
     * @param {*} x1 primera coordenada X del triángulo
     * @param {*} y1 primera coordenada Y del triángulo
     * @param {*} x2 segunda coordenada X del triángulo
     * @param {*} y2 segunda coordenada Y del triángulo
     * @param {*} x3 tercera coordenada X del triángulo
     * @param {*} y3 tercera coordenada Y del triángulo
     * @param {*} color color del triángulo
     */
    drawTriangle(x1, y1, x2, y2, x3, y3, color){
        //Inicia el trazo
        this.ctx.beginPath();
        //Mueve el trazo a la primera coordenada
        this.ctx.moveTo(x1, y1);
        //Dibuja una línea a la segunda coordenada
        this.ctx.lineTo(x2, y2);
        //Dibuja una línea a la tercera coordenada
        this.ctx.lineTo(x3, y3);
        //Cierra el trazo
        this.ctx.closePath();
        //Se establece el color de relleno
        this.ctx.fillStyle = color;
        // Rellena el trazo
        this.ctx.fill();
    }

    //Metodo que devuelve la paleta de colores de el tetromino pasado por parametro
    getColorPalette(id){
        const palette = {
            1: {
                rightTriangle : "#FE8601",
                leftTriangle : "#FFFFFF",
                square : "#FFDB01"
            },

            2: {
                rightTriangle : "#FE5E02",
                leftTriangle : "#FFFFFF",
                square : "#FE8602"
            },

            3: {
                
                rightTriangle : "#B5193B",
                leftTriangle : "#FFFFFF",
                square : "#EE1B2E"
            },

            4: {
                rightTriangle : "#22974C",
                leftTriangle : "#FFFFFF",
                square : "#24DC4F"
            },

            5: {
                rightTriangle : "#49BDFF",
                leftTriangle : "#FFFFFF",
                square : "#2D97F7"
            },

            6: {
                rightTriangle : "#0000C9",
                leftTriangle : "#FFFFFF",
                square : "#0101F0"
            },

            7: {
                rightTriangle : "#8500D3",
                leftTriangle : "#FFFFFF",
                square : "#A000F1"
            }
        }
        return palette[id] || palette[1];
    }

    /**
     * Método para dibujar un bloque del tetromino
     * @param {*} x posición X del bloque
     * @param {*} y posición Y del bloque
     * @param {*} id ID del bloque
     */
    drawBlock(x, y, id){
        //Margen del bloque
        const margin = this.cellSize / 8;
        //Paleta de colores del bloque
        const palette = this.getColorPalette(id);

        //Dibuja el triángulo derecho
        this.drawTriangle(
            x, y,
            x + this.cellSize, y,
            x, y + this.cellSize,
            palette.rightTriangle
        )

        //Dibuja el triángulo izquierdo
        this.drawTriangle(
            x + this.cellSize, y,
            x + this.cellSize, y + this.cellSize,
            x, y + this.cellSize,
            palette.leftTriangle
        )

        //Dibula el cuadrado
        this.drawSquare(
            x + margin,
            y + margin,
            this.cellSize - (margin * 2),
            palette.square
        )
    }

    //Método que devuelve la forma actual del tetromino según su rotación
    currentShape(){
        return this.shapes[this.rotation];
    }


    // Método para dibujar el tetromino en la cuadrícula
    draw(grid){
        //Se obtiene la forma actual del tetromino
        const shape = this.currentShape();
        for(let i = 0; i<shape.length; i++){
            //Por cada posición en la forma, se obtienen las coordenadas en la cuadrícula
            const position = grid.getCoordinates(
                this.position.column + shape[i].column,
                this.position.row + shape[i].row
            );
            //Se dibuja el bloque en la cuadrícula
            this.drawBlock(position.x, position.y, this.id);
        }
    }

    // Método para obtener las posiciones actuales del tetromino en la cuadrícula
    currentPositions(){
        const positions = [];
        // Obtiene la forma actual
        const shape = this.currentShape();
        for (let i = 0; i < shape.length; i++) {
            //Por cada posición en la forma, se agrega una nueva posición a la lista
            positions.push(new Position(
                this.position.row + shape[i].row,
                this.position.column + shape[i].column
            ));
        }
        //Devuelve la lista de posiciones
        return positions;
    }

    //Método para mover el tetromino en la cuadrícula
    move(row, column){
        this.position.row += row;
        this.position.column += column;
    }

    //Método para reiniciar el tetromino a su posición y rotación original
    reset(){
        this.rotation = 0;
        this.position = new Position(this.initPosition.row, this.initPosition.column);
    }
}

//Lista de tipos de tetrominos
export const TetrominoTypes = {
    T:{
        id: 1,
        initPosition: new Position(0,3),
        shapes: [
            [new Position(0,1), new Position(1,0), new Position(1,1), new Position(1,2)],
            [new Position(0,1), new Position(1,1), new Position(1,2), new Position(2,1)],
            [new Position(1,0), new Position(1,1), new Position(1,2), new Position(2,1)],
            [new Position(0,1), new Position(1,0), new Position(1,1), new Position(2,1)]
        ]
    },

    O: {
        id: 2,
        initPosition: new Position(0,4),
        shapes: [
            [new Position(0,0), new Position(0,1), new Position(1,0), new Position(1,1)]
        ]
    },

    I: {
        id: 3,
        initPosition: new Position(-1,3),
        shapes: [
            [new Position(1,0), new Position(1,1), new Position(1,2), new Position(1,3)],
            [new Position(0,2), new Position(1,2), new Position(2,2), new Position(3,2)],
            [new Position(2,0), new Position(2,1), new Position(2,2), new Position(2,3)],
            [new Position(0,1), new Position(1,1), new Position(2,1), new Position(3,1)]
        ]
    },

    S: {
        id: 4,
        initPosition: new Position(0,3),
        shapes: [
            [new Position(0,1), new Position(0,2), new Position(1,0), new Position(1,1)],
            [new Position(0,1), new Position(1,1), new Position(1,2), new Position(2,2)],
            [new Position(1,1), new Position(1,2), new Position(2,0), new Position(2,1)],
            [new Position(0,0), new Position(1,0), new Position(1,1), new Position(2,1)]
        ]
    },

    Z: {
        id: 5,
        initPosition: new Position(0,3),
        shapes: [
            [new Position(0,0), new Position(0,1), new Position(1,1), new Position(1,2)],
            [new Position(0,2), new Position(1,1), new Position(1,2), new Position(2,1)],
            [new Position(1,0), new Position(1,1), new Position(2,1), new Position(2,2)],
            [new Position(0,1), new Position(1,0), new Position(1,1), new Position(2,0)]
        ]
    },

    J: {
        id: 6,
        initPosition: new Position(0,3),
        shapes: [
            [new Position(0,0), new Position(1,0), new Position(1,1), new Position(1,2)],
            [new Position(0,1), new Position(0,2), new Position(1,1), new Position(2,1)],
            [new Position(1,0), new Position(1,1), new Position(1,2), new Position(2,2)],
            [new Position(0,1), new Position(1,1), new Position(2,0), new Position(2,1)]
        ]
    },
    
    L: {
        id: 7,
        initPosition: new Position(0,3),
        shapes: [
            [new Position(0,2), new Position(1,0), new Position(1,1), new Position(1,2)],
            [new Position(0,1), new Position(1,1), new Position(2,1), new Position(2,2)],
            [new Position(1,0), new Position(1,1), new Position(1,2), new Position(2,0)],
            [new Position(0,0), new Position(0,1), new Position(1,1), new Position(2,1)]
        ]
    }
}

// Clase TetrominoBag que gestiona la bolsa de tetrominos y los próximos tres tetrominos
export class TetrominoBag {
    constructor(canvas, cellSize){
        //Canvas donde se dibuja el tetromino
        this.canvas = canvas;
        //Tamaño de las celdas
        this.cellSize = cellSize;
        //Bolsa de tetrominos
        this.bag = [];
        //Tres próximos tetrominos
        this.threeNextTetrominos = [];
        //Inicializa la bolsa y los próximos tetrominos
        this.init();
    }

    //Método para llenar la bolsa con todos los tipos de tetrominos
    fillBag(){
        const tetrominoTypes = [
            TetrominoTypes.T,
            TetrominoTypes.O,
            TetrominoTypes.I,
            TetrominoTypes.S,
            TetrominoTypes.Z,
            TetrominoTypes.J,
            TetrominoTypes.L
        ]
        //Vacía la bolsa
        this.bag.length = 0;
        //Agrega los tetrominos a la bolsa
        tetrominoTypes.forEach(tetrominoType => {
            this.bag.push(new Tetromino(this.canvas, this.cellSize, tetrominoType.shapes, tetrominoType.initPosition, tetrominoType.id));
        });
        //Baraja la bolsa
        for(let i = this.bag.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i+1));
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }

    //Método para inicializar los próximos tetrominos
    init(){
        for (let i = 0; i < 3; i++) {
            this.threeNextTetrominos.push(this.getNextTetromino());
        }
    }

    //Método para obtener el siguiente tetromino
    getNextTetromino(){
        //Si la bolsa está vacía, la rellena
        if(this.bag.length === 0){
            this.fillBag();
        }
        //Devuelve el último tetromino en la bolsa
        return this.bag.pop();
    }

    //Método para obtener el siguiente tetromino y actualizar la lista de próximos tetrominos
    nextTetromino(){
        //Se obtiene el primer tetromino de la lista y se extrae de la misma
        const next = this.threeNextTetrominos.shift();
        //Se obtiene el siguiente tetromino y se agrega a la lista
        this.threeNextTetrominos.push(this.getNextTetromino());
        //Se devuelve el tetromino obtenido
        return next;
    }

    //Método para obtener los próximos tres tetrominos
    getThreeNextTetrominos(){
        return this.threeNextTetrominos;
    }

    //Método para reiniciar la bolsa y los próximos tetrominos
    reset(){
        this.bag = [];
        this.threeNextTetrominos = [];
        this.init();
    }
}

