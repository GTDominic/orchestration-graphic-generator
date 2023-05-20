class FormGenerator {
    /**
     * Generates a form and draws it
     */
    constructor() {
        this.draw();
    }

    /**
     * (Re)draws the form
     */
    public draw(): void {
        let form = `<div class="w3-container w3-indigo"><h1>Orchestration Graphic Generator</h1></div>`;
        form += `<div class="w3-container w3-teal"><h2>Rows:</h2>`;
        for (let i = 0; i < G_settings.rows.length; i++) form += this.drawRow(i);
        form += `
            <p>
                <button class="w3-button w3-block w3-dark-grey" onclick="OG_add('Row')">Add Row</button>
            </p>
            </div>`;
        form += `<div class="w3-container w3-green"><h2>General Settings:</h2>`;
        form += this.drawSettings();
        form += `</div>`;
        document.getElementById(config.formAnchorId).innerHTML = form;
    }

    /**
     * Updates the settings and form
     * @param mode 1 for full update (redraw) | 0 for light update (only updates settings object)
     */
    public update(mode: 0 | 1): void {
        for (let i = 0; i < G_settings.rows.length; i++) this.updateRow(i);
        this.updateSettings();
        if (config.environment === "dev" && config.debug) console.log(G_settings);
        if (mode === 1) this.draw();
    }

    /**
     * Adds a row or register
     * @param type "Row" | "Register"
     * @param row If "Register" row defines the row where the register is added to
     */
    public add(type: "Row" | "Register", row: number): void {
        if (type === "Row") {
            G_settings.rows.push({ radius: 0, leftAngle: 90, rightAngle: 90, sync: true, show: true, registers: [] });
        } else {
            G_settings.rows[row].registers.push({ name: "", count: 0, show: true });
        }
        this.draw();
    }

    /**
     * Removes a row or register
     * @param type "Row" | "Register"
     * @param row Defines the row that is removed or where the register is removed from
     * @param register If "Register" defines the register to be removed
     */
    public remove(type: "Row" | "Register", row: number, register: number): void {
        if (type === "Row") {
            G_settings.rows.splice(row, 1);
        } else {
            G_settings.rows[row].registers.splice(register, 1);
        }
        this.draw();
    }

    /**
     * Toggles the show hide attribute of a register/row
     * @param type "Row" | "Register"
     * @param row Row that should be toggled or the row where the register should be toggled
     * @param register If "Register" defines the register to be toggled
     */
    public showHide(type: "Row" | "Register", row: number, register: number) {
        if (type === "Row") {
            G_settings.rows[row].show = !G_settings.rows[row].show;
        } else {
            G_settings.rows[row].registers[register].show = !G_settings.rows[row].registers[register].show;
        }
        this.draw();
    }

    /**
     * Moves a Row or Register from one place to another (registers cannot jump rows)
     * @param type "Row" | "Register"
     * @param from fromId
     * @param to toId
     * @param row If "Register" defines the row where the register is moved in
     */
    public move(type: "Row" | "Register", from: number, to: number, row: number) {
        let r: Array<I_RegisterSettings | I_RowSettings>;
        if (type === "Row") {
            r = G_settings.rows;
        } else {
            r = G_settings.rows[row].registers;
        }
        let temp = r[from];
        r[from] = r[to];
        r[to] = temp;
        this.draw();
    }

    /**
     * Renders the form for a row
     * @param id Id of the row
     * @returns html form string
     */
    private drawRow(id: number): string {
        let r = G_settings.rows[id];
        let form = `
            <div class="w3-panel ${id % 2 === 0 ? "w3-light-blue" : "w3-cyan"} w3-card-4">
            <h3>
                <button class="w3-button w3-blue-grey w3-medium" onclick="OG_move('Row', ${id}, ${id - 1})"`;
        if (id === 0) form += ` disabled`;
        form += `>&uarr;</button><button class="w3-button w3-blue-grey w3-medium" onclick="OG_move('Row', ${id}, ${id + 1})"`;
        if (id === G_settings.rows.length - 1) form += ` disabled`;
        form += `>&darr;</button><button class="w3-button w3-blue-grey w3-medium" onclick="OG_showHide('Row', ${id})">`;
        form += r.show ? `Hide &and;` : `Show &or;`;
        form += `</button>
                Row ${id + 1}
                <button class="w3-right w3-button w3-blue-grey w3-medium" onclick="OG_remove('Row', ${id})">X</button>
            </h3>`;
        if (!r.show) return (form += `</div>`);
        form += `<p>Radius (in px):
                <input type="number" id="OG_Row_${id}_Radius" class="w3-input"
                    name="Radius Row" value="${r.radius}" oninput="OG_update()" size="5">
            </p>
            <p>Left Border (in °):
                <input type="number" id="OG_Row_${id}_LeftBorder" class="w3-input"
                    name="Left Border Row" value="${r.leftAngle}" oninput="OG_update()" size="5">
            </p>
            <p>Right Border (in °):
                <input type="number" id="OG_Row_${id}_RightBorder" class="w3-input"
                    name="Right Border Row" value="${r.rightAngle}" oninput="OG_update()" size="5"`;
        if (r.sync) form += ` disabled`;
        form += `>
            </p>
            <p><input type="checkbox" id="OG_Row_${id}_Sync" class="w3-check"
                    name="Sync Border Row"`;
        if (r.sync) form += ` checked`;
        form += ` onchange="OG_update(1)"><label> Sync</label>
            </p>`;
        for (let i = 0; i < r.registers.length; i++) form += this.drawRegister(i, id);
        form += `<p><button class="w3-button w3-block w3-blue-grey" onclick="OG_add('Register', ${id})">Add Register</button></p></div>`;
        return form;
    }

    /**
     * Updates the settings for a row
     * @param id Row id
     */
    private updateRow(id: number): void {
        let r = G_settings.rows[id];
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

    /**
     * Renders the form for a register
     * @param id Id of the register
     * @param row Row that the register is in
     * @returns html form string
     */
    private drawRegister(id: number, row: number): string {
        let r = G_settings.rows[row].registers[id];
        let form = `
            <div class="w3-panel ${id % 2 === 0 ? "w3-aqua" : row % 2 === 0 ? "w3-cyan" : "w3-light-blue"} w3-card-4">    
            <h4><button class="w3-button w3-blue-grey w3-medium" onclick="OG_move('Register', ${id}, ${id - 1}, ${row})"`;
        if (id === 0) form += ` disabled`;
        form += `>&uarr;</button><button class="w3-button w3-blue-grey w3-medium" onclick="OG_move('Register', ${id}, ${id + 1}, ${row})"`;
        if (id === G_settings.rows[row].registers.length - 1) form += ` disabled`;
        form += `>&darr;</button><button class="w3-button w3-blue-grey w3-medium" onclick="OG_showHide('Register', ${row}, ${id})">`;
        form += r.show ? `Hide &and;` : `Show &or;`;
        form += `</button> <span id="OG_Register_${row}:${id}_nameTag">`;
        form += r.name ? r.name : `Register ${id + 1}`;
        form += `</span> <button class="w3-right w3-button w3-blue-grey w3-medium" onclick="OG_remove('Register', ${row}, ${id})">X</button></h4>`;
        if (!r.show) return (form += `</div>`);
        form += `<p>Name:
                <input type="text" id="OG_Register_${row}:${id}_name" class="w3-input"
                    name="Name Register" value="${r.name}" oninput="OG_update()" size="20">
            </p>
            <p>Count:
                <input type="number" id="OG_Register_${row}:${id}_count" class="w3-input"
                    name="Count Register" value="${r.count}" oninput="OG_update()" size="5">
            </p>
            </div>
        `;
        return form;
    }

    /**
     * Updates the settings for a register
     * @param id Id of the register
     * @param row Row that the register is in
     */
    private updateRegister(id: number, row: number): void {
        let r = G_settings.rows[row].registers[id];
        if (!r.show) return;
        let nameElement = <HTMLInputElement>document.getElementById(`OG_Register_${row}:${id}_name`);
        let countElement = <HTMLInputElement>document.getElementById(`OG_Register_${row}:${id}_count`);
        r.name = this.sanitizeString(nameElement.value);
        document.getElementById(`OG_Register_${row}:${id}_nameTag`).innerHTML = r.name ? r.name : `Register ${id + 1}`;
        r.count = Number(countElement.value);
    }

    /**
     * Renders the general settings
     * @returns html form string
     */
    private drawSettings(): string {
        let form = this.drawSettingsConductor();
        return form;
    }

    /**
     * Updates the general settings
     */
    private updateSettings(): void {
        this.updateSettingsConductor();
    }

    /**
     * Renders the settings for the conductor
     * @returns html form string
     */
    private drawSettingsConductor(): string {
        let form = `<div class="w3-panel w3-light-green w3-card-4">
            <h3>Conductor:</h3>
            <p>Position: 
                <input type="number" id="OG_Conductor_Pos" class="w3-input"
                    name="Position Conductor" value="${G_settings.conductorPos}" oninput="OG_update()" size="5">
                0 equals circle center point
            </p></div>`;
        return form;
    }

    /**
     * Updates the settings for the conductor
     */
    private updateSettingsConductor(): void {
        let posElement = <HTMLInputElement>document.getElementById("OG_Conductor_Pos");
        G_settings.conductorPos = Number(posElement.value);
    }

    /**
     * Replaces common html characters
     * @param str unsanitized string
     * @returns sanitized string
     */
    private sanitizeString(str: string): string {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        return str;
    }
}
