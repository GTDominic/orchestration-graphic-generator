class DiagramGenerator {
    private svg: SVGGenerator;
    private center: { x: number; y: number };
    private style: { [index: string]: { [index: string]: string } } = {};
    private xSize: number = 0;
    private ySize: number = 0;

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
        if (G_settings.display === "table") this.drawTable();
    }

    /**
     * Sets the style classes to be used elsewhere in the class
     */
    private setStyleClasses(): void {
        this.style.bordered = {
            stroke: "black",
            "stroke-width": "2px",
            fill: "none",
        };
        this.style.noStroke = {
            stroke: "none",
        };
        this.style.text = {
            stroke: "none",
            fill: "white",
            "font-family": "Verdana",
            "dominant-baseline": "middle",
        };
    }

    /**
     * Calculates the size of the graphic
     */
    private calculateSize(): void {
        let biggestRadius = 0;
        for (let row of G_settings.rows) if (row.radius > biggestRadius) biggestRadius = row.radius;
        this.center = {
            x:
                biggestRadius +
                config.diagramSettings.paddingSide +
                config.diagramSettings.registerPadding,
            y: biggestRadius + config.diagramSettings.paddingTopBottom,
        };
        this.xSize =
            2 * biggestRadius +
            2 * config.diagramSettings.paddingSide +
            2 * config.diagramSettings.registerPadding;
        this.ySize = this.findLowestPoint() + config.diagramSettings.paddingTopBottom;
        if (G_settings.display === "table")
            this.ySize +=
                2 * config.diagramSettings.paddingTopBottom +
                this.countRegisters() * config.diagramSettings.tableHeight;
        this.svg.setSize(this.xSize, this.ySize);
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
        let players = OGG_getRowPlayers(row);
        if (players === 0) return;
        let borders = OGG_getBorderPlayerAngles(row);
        let playerAngles: Array<number> = borders.player;
        let borderAngles: Array<number> = borders.border;
        for (let i = 0; i < borderAngles.length - 1; i++) {
            let rO = row.radius + config.diagramSettings.registerPadding;
            let rI = row.radius - config.diagramSettings.registerPadding;
            let over = -borderAngles[i] + borderAngles[i + 1] > 180 ? 1 : 0;
            let p1 = this.findCoordinatesFromAngle(borderAngles[i], rO);
            let p2 = this.findCoordinatesFromAngle(borderAngles[i + 1], rO);
            let p3 = this.findCoordinatesFromAngle(borderAngles[i + 1], rI);
            let p4 = this.findCoordinatesFromAngle(borderAngles[i], rI);
            let d = `M${p1.x} ${p1.y} A${rO} ${rO} 0 ${over} 1 ${p2.x} ${p2.y} 
                L${p3.x} ${p3.y} A${rI} ${rI} 0 ${over} 0 ${p4.x} ${p4.y} Z`;
            let color = row.registers[i].color;
            if (row.registers[i].linked !== "-1:-1") {
                let lc = row.registers[i].linked.split(":");
                color = G_settings.rows[Number(lc[0])].registers[Number(lc[1])].color;
            }
            let style = this.style.noStroke;
            style.fill = color;
            this.svg.addPath(d, style);
        }
        for (let angle of playerAngles) {
            let position = this.findCoordinatesFromAngle(angle, row.radius);
            let style = this.style.noStroke;
            style.fill = G_settings.playerColor;
            this.svg.addCircle(position.x, position.y, G_settings.playerSize, style);
        }
    }

    /**
     * Draws the conductor dot in the center
     */
    private drawConductor(): void {
        if (!G_settings.conductorEnabled) return;
        let style = this.style.noStroke;
        style.fill = G_settings.conductorColor;
        this.svg.addCircle(
            this.center.x,
            this.center.y - G_settings.conductorPos,
            G_settings.conductorSize,
            style
        );
    }

    /**
     * Draws a display table
     */
    private drawTable(): void {
        if (this.countRegisters() === 0) return;
        let y = this.findLowestPoint() + 2 * config.diagramSettings.paddingTopBottom;
        let x = config.diagramSettings.paddingSide;
        const width = this.xSize / 2 - config.diagramSettings.paddingSide;
        const height = config.diagramSettings.tableHeight;
        for (let i = 0; i < G_settings.rows.length; i++) {
            for (let j = 0; j < G_settings.rows[i].registers.length; j++) {
                let reg = G_settings.rows[i].registers[j];
                if (reg.linked) continue;
                let color = reg.color;
                let style = this.style.noStroke;
                style.fill = color;
                this.svg.addRectangle(x, y, width, height, style);
                style = this.style.text;
                style.fill = OGG_getTextColor(color);
                let count = reg.count;
                for (let k = 0; k < G_settings.rows.length; k++) {
                    for (let l = 0; l < G_settings.rows[k].registers.length; l++) {
                        let r = G_settings.rows[k].registers[l];
                        if (r.linked === `${i}:${j}`) count += r.count;
                    }
                }
                this.svg.addText(x + 5, y + height / 2, `${count}x ${reg.name}`, style);
                y = x === config.diagramSettings.paddingSide ? y : y + height;
                x =
                    x === config.diagramSettings.paddingSide
                        ? config.diagramSettings.paddingSide + width
                        : config.diagramSettings.paddingSide;
            }
        }
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
            let left, right, leftAngle, rightAngle;
            let players = OGG_getRowPlayers(row);
            if (players !== 0) {
                let a = (row.leftAngleBorder ? 0.5 : 0) + (row.rightAngleBorder ? 0.5 : 0);
                let distance = (row.leftAngle + row.rightAngle) / (players - a);
                leftAngle = -(row.leftAngleBorder ? row.leftAngle + distance / 2 : row.leftAngle);
                rightAngle = row.rightAngleBorder ? row.rightAngle + distance / 2 : row.rightAngle;
            } else {
                leftAngle = -row.leftAngle;
                rightAngle = row.rightAngle;
            }
            if (row.leftAngle > 180 || row.rightAngle > 180) {
                left = this.findCoordinatesFromAngle(180, row.radius).y;
                right = left;
            } else {
                left = this.findCoordinatesFromAngle(leftAngle, row.radius).y;
                right = this.findCoordinatesFromAngle(rightAngle, row.radius).y;
            }
            if (left > lowestLeft) lowestLeft = left;
            if (right > lowestRight) lowestRight = right;
        }
        lowest = lowestLeft > lowestRight ? lowestLeft : lowestRight;
        return lowest > conductorPos ? lowest : conductorPos;
    }

    /**
     * Counts all registers
     * @returns count
     */
    private countRegisters(): number {
        let count = 0;
        for (let row of G_settings.rows) for (let reg of row.registers) count++;
        return count;
    }
}
