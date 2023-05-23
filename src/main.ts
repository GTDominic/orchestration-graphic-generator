/**
 * Orchestration Graphic Generator
 * by Dominic Seithel (https://github.com/GTDominic)
 * Project hosted on GitHub: https://github.com/GTDominic/orchestration-graphic-generator
 */
let form: FormGenerator;
let jsonHandler: JSONHandler;
let svgExport: SVGExport;

/**
 * Initializes all Generators and Handlers and calls the loadPage() function
 */
function OG_main(): void {
    loadPage();
    form = new FormGenerator();
    jsonHandler = new JSONHandler();
    svgExport = new SVGExport();
    new DiagramGenerator();
}

/**
 * Updates the form and redraws the graphic
 * @param mode 0 (default) light update | 1 update and redraw form
 */
function OG_update(mode: 0 | 1 = 0): void {
    form.update(mode);
    new DiagramGenerator();
}

/**
 * Adds a row or register
 * @param type "Row" | "Register"
 * @param row If "Register" row defines the row where the register is added to (not needed for "Row")
 */
function OG_add(type: "Row" | "Register", row: number = 0): void {
    form.add(type, row);
    new DiagramGenerator();
}

/**
 * Removes a row or register
 * @param type "Row" | "Register"
 * @param i Defines the row that is removed or where the register is removed from | Defines the color position
 * @param register If "Register" defines the register to be removed (not needed for "Row")
 */
function OG_remove(type: "Row" | "Register" | "Color", i: number, register: number = 0): void {
    form.remove(type, i, register);
    new DiagramGenerator();
}

/**
 * Toggles the show hide attribute of a register/row
 * @param type "Row" | "Register" | "Palettes"
 * @param row Row that should be toggled or the row where the register should be toggled
 * @param register If "Register" defines the register to be toggled (not needed for "Row")
 */
function OG_showHide(
    type: "Row" | "Register" | "Palettes",
    row: number,
    register: number = 0
): void {
    form.showHide(type, row, register);
}

/**
 * Moves a Row or Register from one place to another (registers cannot jump rows)
 * @param type "Row" | "Register"
 * @param from fromId
 * @param to toId
 * @param row If "Register" defines the row where the register is moved in (not needed for "Row")
 */
function OG_move(type: "Row" | "Register", from: number, to: number, row: number = 0): void {
    form.move(type, from, to, row);
    new DiagramGenerator();
}

/**
 * Chooses the color for a specified register
 * @param row id of the row the register is in
 * @param register id of the register
 * @param color html color string
 */
function OG_chooseColor(id: string, row: number, register: number, color: string): void {
    form.chooseColor(id, row, register, color);
    new DiagramGenerator();
}

/**
 * Chooses a color palette as base
 * @param id id of the palette
 */
function OG_choosePalette(id: number): void {
    form.choosePalette(id);
}

/**
 * Downloads the graphic/settings as svg or json
 * @param type "json" | "svg"
 */
function OG_download(type: "json" | "svg"): void {
    if (type === "json") jsonHandler.export();
    else svgExport.download();
}

/**
 * Imports a json file
 */
function OG_import(): void {
    jsonHandler.import();
}

/**
 * Additional JS to render the page (used for footer)
 */
function loadPage(): void {
    let year = new Date().getFullYear();
    document.getElementById("year").innerText = String(year);
    document.getElementById("version").innerText = config.version;
    if (config.environment !== "production")
        document.getElementById("environment").innerText = `| Environment: ${config.environment}`;
}
