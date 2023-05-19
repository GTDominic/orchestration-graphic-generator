let form: FormGenerator;
let jsonHandler: JSONHandler;

function OG_main(): void {
    form = new FormGenerator();
    jsonHandler = new JSONHandler();
    new DiagramGenerator();
}

function OG_update(mode: 0 | 1 = 0): void {
    form.update(mode);
    new DiagramGenerator();
}

function OG_add(type: "Row" | "Register", row: number = 0): void {
    form.add(type, row);
    new DiagramGenerator();
}

function OG_remove(type: "Row" | "Register", row: number, register: number = 0): void {
    form.remove(type, row, register);
    new DiagramGenerator();
}

function OG_showHide(type: "Row" | "Register", row: number, register: number = 0): void {
    form.showHide(type, row, register);
}

function OG_move(type: "Row" | "Register", from: number, to: number, row: number = 0): void {
    form.move(type, from, to, row);
    new DiagramGenerator();
}

function OG_download(type: "json" | "svg"): void {
    if(type === "json") jsonHandler.export();
}

function OG_import(): void {
    jsonHandler.import();
}
