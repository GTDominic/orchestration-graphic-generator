class SVGGenerator {
    private svg: SVGElement;

    constructor(refId: string) {
        document.getElementById(refId).innerHTML = "";
        this.svg = this.addElement("svg", {}, document.getElementById(refId));
    }

    public addCircle(cx: number, cy: number, r: number, styleObj: { [index: string]: any }): void {
        let style = this.convertStyle(styleObj);
        this.addElement("circle", { cx, cy, r, style });
    }

    public addPath(d: string, styleObj: { [index: string]: any }): void {
        let style = this.convertStyle(styleObj);
        this.addElement("path", { d, style });
    }

    public setSize(width: number, height: number): void {
        this.setAttr(this.svg, { width, height });
    }

    private setAttr(obj: SVGElement, attr: { [index: string]: any }): void {
        for (let key in attr) obj.setAttribute(key, attr[key]);
    }

    private addElement(form: string, attr: { [index: string]: any }, context: SVGElement | HTMLElement = null): SVGElement {
        if (context === null) context = this.svg;
        let element = document.createElementNS("http://www.w3.org/2000/svg", form);
        this.setAttr(element, attr);
        return context.appendChild(element);
    }

    private convertStyle(styleObj: { [index: string]: any }): string {
        let style = "";
        for (let key in styleObj) {
            style += `${key}:${styleObj[key]};`;
        }
        return style;
    }
}
