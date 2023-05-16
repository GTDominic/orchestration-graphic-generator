class DiagramGenerator {
    private settings: I_Settings;
    private svg: SVGGenerator;
    private center: { x: number; y: number };

    constructor(settings: I_Settings) {
        this.settings = settings;
        this.svg = new SVGGenerator(config.graphicAnchorId);
        this.calculateSize();
        this.drawCircles();
        this.drawConductor();
    }

    private calculateSize(): void {
        let biggestRadius = 0;
        let xSize = 0;
        let ySize = 0;
        for (let row of this.settings.rows) if (row.radius > biggestRadius) biggestRadius = row.radius;
        this.center = { x: biggestRadius + config.diagramSettings.paddingSide, y: biggestRadius + config.diagramSettings.paddingTopBottom };
        xSize = 2 * biggestRadius + 2 * config.diagramSettings.paddingSide;
        ySize = this.findLowestPoint();
        this.svg.setSize(
            2 * biggestRadius + 2 * config.diagramSettings.paddingSide,
            2 * biggestRadius + 2 * config.diagramSettings.paddingTopBottom
        );
    }

    private drawCircles(): void {
        for (let row of this.settings.rows) {
            this.svg.addCircle(this.center.x, this.center.y, row.radius, "OGG_circle");
            let leftBorderCoordinates = this.findCoordinatesFromAngle(row.rightAngle, row.radius);
            this.svg.addCircle(leftBorderCoordinates.x, leftBorderCoordinates.y, 5, "OGG_circle");
        }
    }

    private drawConductor(): void {
        this.svg.addCircle(this.center.x, this.center.y - this.settings.conductorPos, config.diagramSettings.conductorSize, "OGG_dot");
    }

    private findCoordinatesFromAngle(angle: number, radius: number): {x: number, y: number} {
        angle += 180;
        angle *= (Math.PI/180);
        let x = Math.sin(-angle) * radius + this.center.x;
        let y = Math.cos(-angle) * radius + this.center.y;
        return {x, y};
    }

    private findLowestPoint(): number {
        let conductorPos = this.center.y - this.settings.conductorPos;
        let lowestLeft = 0;
        let lowestRight = 0;
        let lowest = 0;
        for(let row of this.settings.rows) {
            let left = this.findCoordinatesFromAngle(-row.leftAngle, row.radius).y;
            let right = this.findCoordinatesFromAngle(row.rightAngle, row.radius).y;
            if(lowestLeft > left) lowestLeft = left;
            if(lowestRight > right) lowestRight = right;
        }
        lowest = lowestLeft > lowestRight ? lowestLeft : lowestRight;
        return lowest > conductorPos ? lowest : conductorPos;
    }
}
