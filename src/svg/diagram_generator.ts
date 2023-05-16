class DiagramGenerator {
    private settings: I_Settings;
    private svg: SVGGenerator;
    private center: { x: number; y: number };

    constructor(settings: I_Settings) {
        this.settings = settings;
        this.svg = new SVGGenerator(config.graphicAnchorId);
        this.calculateSize();
        this.drawCircles();
        for (let r of this.settings.rows) this.drawRegisters(r);
        this.drawConductor();
    }

    private calculateSize(): void {
        let biggestRadius = 0;
        let xSize = 0;
        let ySize = 0;
        for (let row of this.settings.rows) if (row.radius > biggestRadius) biggestRadius = row.radius;
        this.center = { x: biggestRadius + config.diagramSettings.paddingSide, y: biggestRadius + config.diagramSettings.paddingTopBottom };
        xSize = 2 * biggestRadius + 2 * config.diagramSettings.paddingSide;
        ySize = this.findLowestPoint() + config.diagramSettings.paddingTopBottom;
        this.svg.setSize(xSize, ySize);
    }

    private drawCircles(): void {
        for (let row of this.settings.rows) {
            this.svg.addCircle(this.center.x, this.center.y, row.radius, "OGG_bordered");
        }
    }

    private drawRegisters(row: I_RowSettings): void {
        let players = this.getRowPlayers(row);
        if (players === 0) return;
        let playerAngles: Array<number> = [];
        let borderAngles: Array<number> = [-row.leftAngle];
        let distance = (row.leftAngle + row.rightAngle) / players;
        let tempAngle = distance / 2 - row.leftAngle;
        for (let i = 0; i < players; i++) {
            playerAngles.push(tempAngle);
            tempAngle += distance;
        }
        if (config.debug) console.log(playerAngles);
        tempAngle = -row.leftAngle;
        for (let reg of row.registers) {
            // Skip registers without people
            if (reg.count === 0) continue;
            tempAngle += distance * reg.count;
            borderAngles.push(tempAngle);
        }
        if (config.debug) console.log(borderAngles);
        for(let angle of playerAngles) {
            let position = this.findCoordinatesFromAngle(angle, row.radius);
            this.svg.addCircle(position.x, position.y, config.diagramSettings.playerSize, "OGG_dot");
        }
    }

    private drawConductor(): void {
        this.svg.addCircle(this.center.x, this.center.y - this.settings.conductorPos, config.diagramSettings.conductorSize, "OGG_dot");
    }

    private findCoordinatesFromAngle(angle: number, radius: number): { x: number; y: number } {
        angle += 180;
        angle *= Math.PI / 180;
        let x = Math.sin(-angle) * radius + this.center.x;
        let y = Math.cos(-angle) * radius + this.center.y;
        return { x, y };
    }

    private findLowestPoint(): number {
        let conductorPos = this.center.y - this.settings.conductorPos;
        let lowestLeft = 0;
        let lowestRight = 0;
        let lowest = 0;
        for (let row of this.settings.rows) {
            let left = this.findCoordinatesFromAngle(-row.leftAngle, row.radius).y;
            let right = this.findCoordinatesFromAngle(row.rightAngle, row.radius).y;
            if (left > lowestLeft) lowestLeft = left;
            if (right > lowestRight) lowestRight = right;
        }
        lowest = lowestLeft > lowestRight ? lowestLeft : lowestRight;
        return lowest > conductorPos ? lowest : conductorPos;
    }

    private getRowPlayers(row: I_RowSettings): number {
        let players = 0;
        for (let reg of row.registers) players += reg.count;
        return players;
    }
}
