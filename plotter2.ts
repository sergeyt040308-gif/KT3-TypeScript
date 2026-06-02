interface Logger {
    log(message: string): void;
}

class LogToConsole implements Logger {
    log(message: string): void {
        console.log(message);
    }
}

type Point = number;
type Distance = number;
type Angle = number;

interface Position {
    x: Point;
    y: Point;
}

enum CarriageState {
    UP,
    DOWN
}

enum LineColor {
    BLACK = "чорный",
    RED = "красный",
    GREEN = "зелёный"
}

class Plotter {
    private position: Position;
    private angle: Angle;
    private color: LineColor;
    private carriageState: CarriageState;
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        this.position = { x: 0, y: 0 };
        this.angle = 0;
        this.color = LineColor.BLACK;
        this.carriageState = CarriageState.UP;
    }

    private drawLine(to: Position): void {
        this.logger.log(`...Чертим линию из (${this.position.x}, ${this.position.y}) в (${to.x}, ${to.y}) используя ${this.color} цвет.`);
    }

    private calcNewPosition(distance: Distance): Position {
        const angleInRads = this.angle * (Math.PI / 180.0);
        const x = this.position.x + distance * Math.cos(angleInRads);
        const y = this.position.y + distance * Math.sin(angleInRads);
        return { x: Math.round(x), y: Math.round(y) };
    }

    move(distance: Distance): void {
        const newPosition = this.calcNewPosition(distance);
        
        if (this.carriageState === CarriageState.DOWN) {
            this.drawLine(newPosition);
        } else {
            this.logger.log(`Передвигаем на ${distance} от точки (${this.position.x}, ${this.position.y})`);
        }
        
        this.position = newPosition;
    }

    turn(angle: Angle): void {
        this.logger.log(`Поворачиваем на ${angle} градусов`);
        this.angle = (this.angle + angle) % 360.0;
    }

    carriageUp(): void {
        this.logger.log("Поднимаем каретку");
        this.carriageState = CarriageState.UP;
    }

    carriageDown(): void {
        this.logger.log("Опускаем каретку");
        this.carriageState = CarriageState.DOWN;
    }

    setColor(color: string): void {
        let lineColor: LineColor;
        
        switch (color.toLowerCase()) {
            case "green":
                lineColor = LineColor.GREEN;
                break;
            case "red":
                lineColor = LineColor.RED;
                break;
            default:
                lineColor = LineColor.BLACK;
        }
        
        this.logger.log(`Устанавливаем ${lineColor} цвет линии.`);
        this.color = lineColor;
    }

    setPosition(x: Point, y: Point): void {
        this.logger.log(`Устанавливаем позицию каретки в (${x}, ${y}).`);
        this.position = { x, y };
    }

    getPosition(): Position {
        return { ...this.position };
    }

    getAngle(): Angle {
        return this.angle;
    }

    getColor(): LineColor {
        return this.color;
    }

    getCarriageState(): CarriageState {
        return this.carriageState;
    }
}

function drawTriangle(plt: Plotter, size: Distance): void {
    plt.setColor('Green');
    for (let i = 0; i < 3; ++i) {
        plt.carriageDown();
        plt.move(size);
        plt.carriageUp();
        plt.turn(120.0);
    }
}


const logger = new LogToConsole();
const plotter = new Plotter(logger);

drawTriangle(plotter, 100.0);
