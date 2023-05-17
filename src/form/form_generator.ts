class FormGenerator {
    private settings: I_Settings;

    constructor(settings: I_Settings) {
        this.settings = settings;
        this.draw();
    }

    public draw(): void {
        let form = `<h1>Orchestration Graphic Generator</h1>`;
        form += `<h2>Rows:</h2>`;
        for (let i = 0; i < this.settings.rows.length; i++) form += this.drawRow(i);
        form += `
            <p>
                <button onclick="OG_add('Row')">Add Row</button>
            </p>`;
        form += `<h2>General Settings:</h2>`;
        form += this.drawSettings();
        document.getElementById(config.formAnchorId).innerHTML = form;
    }

    public update(mode: 0 | 1): void {
        for (let i = 0; i < this.settings.rows.length; i++) this.updateRow(i);
        this.updateSettings();
        if (config.environment === "dev" && config.debug) console.log(this.settings);
        if (mode === 1) this.draw();
    }

    public add(type: "Row" | "Register", row: number): void {
        if (type === "Row") {
            this.settings.rows.push({ radius: 0, leftAngle: 90, rightAngle: 90, sync: true, show: true, registers: [] });
        } else {
            this.settings.rows[row].registers.push({ name: "", count: 0, show: true });
        }
        this.draw();
    }

    public remove(type: "Row" | "Register", row: number, register: number): void {
        if (type === "Row") {
            this.settings.rows.splice(row, 1);
        } else {
            this.settings.rows[row].registers.splice(register, 1);
        }
        this.draw();
    }

    public showHide(type: "Row" | "Register", row: number, register: number) {
        if (type === "Row") {
            this.settings.rows[row].show = !this.settings.rows[row].show;
        } else {
            this.settings.rows[row].registers[register].show = !this.settings.rows[row].registers[register].show;
        }
        this.draw();
    }

    private drawRow(id: number): string {
        let r = this.settings.rows[id];
        let form = `
            <h3>
                <button onclick="OG_remove('Row', ${id})">X</button>
                Row ${id + 1}: 
                <button onclick="OG_showHide('Row', ${id})">`;
        form += r.show ? `Hide &and;` : `Show &or;`;
        form += `</button>
            </h3>`;
        if (!r.show) return form;
        form +=`<p>Radius:
                <input type="number" id="OG_Row_${id}_Radius" 
                    name="Radius Row" value="${r.radius}" oninput="OG_update()" size="5">
            </p>
            <p>Left Border:
                <input type="number" id="OG_Row_${id}_LeftBorder" 
                    name="Left Border Row" value="${r.leftAngle}" oninput="OG_update()" size="5">°
            </p>
            <p>Right Border:
                <input type="number" id="OG_Row_${id}_RightBorder" 
                    name="Right Border Row" value="${r.rightAngle}" oninput="OG_update()" size="5"`;
        if (r.sync) form += ` disabled`;
        form += `>°
            </p>
            <p>Sync Borders:
                <input type="checkbox" id="OG_Row_${id}_Sync"
                    name="Sync Border Row"`;
        if (r.sync) form += ` checked`;
        form += ` onchange="OG_update(1)">
            </p>`;
        for (let i = 0; i < r.registers.length; i++) form += this.drawRegister(i, id);
        form += `<p><button onclick="OG_add('Register', ${id})">Add Register</button></p>`;
        return form;
    }

    private updateRow(id: number): void {
        let r = this.settings.rows[id];
        if (!r.show) return;
        let radiusElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_Radius`);
        let leftBorderElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_LeftBorder`);
        let rightBorderElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_RightBorder`);
        let syncElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_Sync`);
        r.radius = Number(radiusElement.value);
        r.leftAngle = Number(leftBorderElement.value);
        r.sync = syncElement.checked;
        if (r.sync) {
            r.rightAngle = Number(leftBorderElement.value);
            rightBorderElement.value = String(r.rightAngle);
        } else {
            r.rightAngle = Number(rightBorderElement.value);
        }
        for (let i = 0; i < r.registers.length; i++) this.updateRegister(i, id);
    }

    private drawRegister(id: number, row: number): string {
        let r = this.settings.rows[row].registers[id];
        let form = `<h4>
                <button onclick="OG_remove('Register', ${row}, ${id})">X</button> <span id="OG_Register_${row}:${id}_nameTag">`;
        form += r.name ? r.name : `Register ${id + 1}`
        form += `</span> <button onclick="OG_showHide('Register', ${row}, ${id})">`;
        form += r.show ? `Hide &and;` : `Show &or;`;
        form += `</button>
            </h4>`;
        if (!r.show) return form;
        form += `<p>Name:
                <input type="text" id="OG_Register_${row}:${id}_name"
                    name="Name Register" value="${r.name}" oninput="OG_update()" size="20">
            </p>
            <p>Count:
                <input type="number" id="OG_Register_${row}:${id}_count"
                    name="Count Register" value="${r.count}" oninput="OG_update()" size="5">
            </p>
        `;
        return form;
    }

    private updateRegister(id: number, row: number): void {
        let r = this.settings.rows[row].registers[id];
        if (!r.show) return;
        let nameElement = <HTMLInputElement>document.getElementById(`OG_Register_${row}:${id}_name`);
        let countElement = <HTMLInputElement>document.getElementById(`OG_Register_${row}:${id}_count`);
        r.name = nameElement.value;
        document.getElementById(`OG_Register_${row}:${id}_nameTag`).innerText = r.name ? r.name : `Register ${id + 1}`;
        r.count = Number(countElement.value);
    }

    private drawSettings(): string {
        let form = this.drawSettingsConductor();
        return form;
    }

    private updateSettings(): void {
        this.updateSettingsConductor();
    }

    private drawSettingsConductor(): string {
        let form = `
            <h3>Conductor:</h3>
            <p>Position: 
                <input type="number" id="OG_Conductor_Pos" name="Position Conductor" value="${this.settings.conductorPos}" oninput="OG_update()" size="5">
                0 equals circle center point
            </p>`;
        return form;
    }

    private updateSettingsConductor(): void {
        let posElement = <HTMLInputElement>document.getElementById("OG_Conductor_Pos");
        this.settings.conductorPos = Number(posElement.value);
    }
}
