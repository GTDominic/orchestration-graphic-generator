let form: FormGenerator;

function OG_main(): void {
    form = new FormGenerator(G_settings);
}

function OG_update(mode: 0 | 1 = 0): void {
    form.update(mode);
}

function OG_add(type: "Row" | "Register", row: number = 0): void {
    form.add(type, row);
}

function OG_remove(type: "Row" | "Register", row: number, register: number = 0): void {
    form.remove(type, row, register);
}