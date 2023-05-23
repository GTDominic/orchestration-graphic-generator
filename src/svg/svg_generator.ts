class SVGGenerator {
    private svg: SVGElement;

    /**
     * Generates a svg graphic
     * @param refId id of the anchor where the svg should be generated
     */
    constructor(refId: string) {
        document.getElementById(refId).innerHTML = "";
        this.svg = this.addElement("svg", {}, document.getElementById(refId));
        this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }

    /**
     * Generates a circle
     * @param cx centerpoint x
     * @param cy centerpoint y
     * @param r radius
     * @param styleObj defines styling by {"type": "value"}
     */
    public addCircle(
        cx: number,
        cy: number,
        r: number,
        styleObj: { [index: string]: string }
    ): void {
        let style = this.convertStyle(styleObj);
        this.addElement("circle", { cx, cy, r, style });
    }

    /**
     * Generates a rectangle
     * @param x x coordinate top left
     * @param y y coordinate top left
     * @param width width of the rectangle
     * @param height height of the rectangle
     * @param styleObj defines styling by {"type": "value"}
     */
    public addRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        styleObj: { [index: string]: string }
    ): void {
        let style = this.convertStyle(styleObj);
        this.addElement("rect", { x, y, width, height, style });
    }

    /**
     * Generates a path
     * @param d the path attribute that defines the path
     * @param styleObj defines styling by {"type": "value"}
     */
    public addPath(d: string, styleObj: { [index: string]: string }): void {
        let style = this.convertStyle(styleObj);
        this.addElement("path", { d, style });
    }

    /**
     * Generates text
     * @param x x position
     * @param y y position
     * @param content Text content
     * @param styleObj defines styling by {"type": "value"}
     */
    public addText(
        x: number,
        y: number,
        content: string,
        styleObj: { [index: string]: string }
    ): void {
        let style = this.convertStyle(styleObj);
        this.addElement("text", { x, y, style }).innerHTML = content;
    }

    /**
     * Sets the total size of the graphic
     * @param width
     * @param height
     */
    public setSize(width: number, height: number): void {
        this.setAttr(this.svg, { width, height });
    }

    /**
     * Sets attributes for an svg object
     * @param obj svg context
     * @param attr list of the objects to add
     */
    private setAttr(obj: SVGElement, attr: { [index: string]: any }): void {
        for (let key in attr) obj.setAttribute(key, attr[key]);
    }

    /**
     * Adds an Element to the svg/generates the svg
     * @param form type of svg element to add
     * @param attr list of attributes to add
     * @param context context where the svg element should be added to (if null use the svg-graphic)
     * @returns svg element that was added
     */
    private addElement(
        form: string,
        attr: { [index: string]: any },
        context: SVGElement | HTMLElement = null
    ): SVGElement {
        if (context === null) context = this.svg;
        let element = document.createElementNS("http://www.w3.org/2000/svg", form);
        this.setAttr(element, attr);
        return context.appendChild(element);
    }

    /**
     * Converts styling object to inline style string
     * @param styleObj defines styling by {"type": "value"}
     * @returns styling as string
     */
    private convertStyle(styleObj: { [index: string]: string }): string {
        let style = "";
        for (let key in styleObj) {
            style += `${key}:${styleObj[key]};`;
        }
        return style;
    }
}
