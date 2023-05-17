let form: FormGenerator;

function OG_main(): void {
    form = new FormGenerator(G_settings);
}

function OG_update(mode: 0 | 1 = 0): void {
    form.update(mode);
    let grapic = new DiagramGenerator(G_settings);
}

function OG_add(type: "Row" | "Register", row: number = 0): void {
    form.add(type, row);
    let grapic = new DiagramGenerator(G_settings);
}

function OG_remove(type: "Row" | "Register", row: number, register: number = 0): void {
    form.remove(type, row, register);
    let grapic = new DiagramGenerator(G_settings);
}

function OG_showHide(type: "Row" | "Register", row: number, register: number = 0): void {
    form.showHide(type, row, register);
}