class DiagramGenerator {
    private svg: SVGGenerator;
    private center: { x: number; y: number };
    private currentColor: number = 0;
    private style: { [index: string]: { [index: string]: string } } = {};

    /**
     * Draws a new Diagram
     */
    constructor() {
        this.setStyleClasses();
        this.svg = new SVGGenerator(config.graphicAnchorId);
        this.calculateSize();
        for (let r of G_settings.rows) this.drawRegisters(r);
        if (config.environment === "dev" && config.diagramSettings.drawCircles) this.drawCircles();
        this.drawConductor();
    }

    /**
     * Sets the style classes to be used elsewhere in the class
     */
    private setStyleClasses(): void {
        this.style.bordered = {
            "stroke": "black",
            "stroke-width": "2px",
            "fill": "none",
        }
        this.style.dot = {
            "fill": "red",
            "stroke": "none",
        }
        this.style.registerBack = {
            "stroke": "none",
        }
    }

    /**
     * Calculates the size of the graphic
     */
    private calculateSize(): void {
        let biggestRadius = 0;
        let xSize = 0;
        let ySize = 0;
        for (let row of G_settings.rows) if (row.radius > biggestRadius) biggestRadius = row.radius;
        this.center = { x: biggestRadius + config.diagramSettings.paddingSide, y: biggestRadius + config.diagramSettings.paddingTopBottom };
        xSize = 2 * biggestRadius + 2 * config.diagramSettings.paddingSide;
        ySize = this.findLowestPoint() + config.diagramSettings.paddingTopBottom;
        this.svg.setSize(xSize, ySize);
    }

    /**
     * Draws rows as circles
     */
    private drawCircles(): void {
        for (let row of G_settings.rows) {
            this.svg.addCircle(this.center.x, this.center.y, row.radius, this.style.bordered);
        }
    }

    /**
     * Draws the registers as circleparts
     * @param row The row that is added
     */
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
        if (config.environment === "dev" && config.debug) console.log(playerAngles);
        tempAngle = -row.leftAngle;
        for (let reg of row.registers) {
            // Skip registers without people
            if (reg.count === 0) continue;
            tempAngle += distance * reg.count;
            borderAngles.push(tempAngle);
        }
        if (config.environment === "dev" && config.debug) console.log(borderAngles);
        for (let i = 0; i < borderAngles.length - 1; i++) {
            let rO = row.radius + config.diagramSettings.registerPadding;
            let rI = row.radius - config.diagramSettings.registerPadding;
            let p1 = this.findCoordinatesFromAngle(borderAngles[i], rO);
            let p2 = this.findCoordinatesFromAngle(borderAngles[i + 1], rO);
            let p3 = this.findCoordinatesFromAngle(borderAngles[i + 1], rI);
            let p4 = this.findCoordinatesFromAngle(borderAngles[i], rI);
            let d = `M${p1.x} ${p1.y} A${rO} ${rO} 0 0 1 ${p2.x} ${p2.y} 
                L${p3.x} ${p3.y} A${rI} ${rI} 0 0 0 ${p4.x} ${p4.y} Z`;
            let color = config.diagramSettings.colors[this.currentColor];
            this.currentColor++;
            if (this.currentColor === config.diagramSettings.colors.length) this.currentColor = 0;
            let style = this.style.registerBack;
            style.fill = color;
            this.svg.addPath(d, style);
        }
        for (let angle of playerAngles) {
            let position = this.findCoordinatesFromAngle(angle, row.radius);
            this.svg.addCircle(position.x, position.y, config.diagramSettings.playerSize, this.style.dot);
        }
    }

    /**
     * Draws the conductor dot in the center
     */
    private drawConductor(): void {
        this.svg.addCircle(this.center.x, this.center.y - G_settings.conductorPos, config.diagramSettings.conductorSize, this.style.dot);
    }

    /**
     * Calculates coordinates with given angle and radius
     * @param angle angle in degrees
     * @param radius radius of the circle
     * @returns x and y Coordinates of the point
     */
    private findCoordinatesFromAngle(angle: number, radius: number): { x: number; y: number } {
        angle += 180;
        angle *= Math.PI / 180;
        let x = Math.sin(-angle) * radius + this.center.x;
        let y = Math.cos(-angle) * radius + this.center.y;
        return { x, y };
    }

    /**
     * Finds the lowest point of the graphic
     * @returns Lowest point of the graphic
     */
    private findLowestPoint(): number {
        let conductorPos = this.center.y - G_settings.conductorPos;
        let lowestLeft = 0;
        let lowestRight = 0;
        let lowest = 0;
        for (let row of G_settings.rows) {
            let left = this.findCoordinatesFromAngle(-row.leftAngle, row.radius).y;
            let right = this.findCoordinatesFromAngle(row.rightAngle, row.radius).y;
            if (left > lowestLeft) lowestLeft = left;
            if (right > lowestRight) lowestRight = right;
        }
        lowest = lowestLeft > lowestRight ? lowestLeft : lowestRight;
        return lowest > conductorPos ? lowest : conductorPos;
    }

    /**
     * Counts the players in a row
     * @param row row to count
     * @returns count of players
     */
    private getRowPlayers(row: I_RowSettings): number {
        let players = 0;
        for (let reg of row.registers) players += reg.count;
        return players;
    }
}
