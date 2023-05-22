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
            let radius = G_settings.rows.length === 0 ? 100 : G_settings.rows[G_settings.rows.length - 1].radius + 50;
            let linked = G_settings.rows.length === 0 ? false : true;
            let leftAngle = G_settings.rows.length === 0 ? 90 : G_settings.rows[G_settings.rows.length - 1].leftAngle;
            let rightAngle = G_settings.rows.length === 0 ? 90 : G_settings.rows[G_settings.rows.length - 1].rightAngle;
            let leftAngleBorder = G_settings.rows.length === 0 ? false : G_settings.rows[G_settings.rows.length - 1].leftAngleBorder;
            let rightAngleBorder = G_settings.rows.length === 0 ? false : G_settings.rows[G_settings.rows.length - 1].rightAngleBorder;
            G_settings.rows.push({ radius, linked, leftAngle, leftAngleBorder, rightAngle, rightAngleBorder, sync: true, show: true, registers: [] });
            G_settings.rows[G_settings.rows.length - 1].registers.push({ name: "", count: 1, show: true });
        } else {
            G_settings.rows[row].registers.push({ name: "", count: 1, show: true });
        }
        this.draw();
    }

    /**
     * Removes a row or register
     * @param type "Row" | "Register"
     * @param i Defines the row that is removed or where the register is removed from | Defines the color position
     * @param register If "Register" defines the register to be removed
     */
    public remove(type: "Row" | "Register" | "Color", i: number, register: number): void {
        if (type === "Row") {
            let r = G_settings.rows[i].radius;
            let l = G_settings.rows[i].linked;
            G_settings.rows.splice(i, 1);
            if (i < G_settings.rows.length) {
                let e = G_settings.rows[i];
                if (e.linked === true) {
                    e.radius = r;
                    e.linked = l;
                }
            }
        } else if (type === "Register") {
            G_settings.rows[i].registers.splice(register, 1);
        } else {
            G_settings.colorPalette.splice(i, 1);
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
        let r1: number, r2: number, l1: boolean, l2: boolean;
        if (type === "Row") {
            r = G_settings.rows;
            r1 = (<I_RowSettings>r[from]).radius;
            r2 = (<I_RowSettings>r[to]).radius;
            l1 = (<I_RowSettings>r[from]).linked;
            l2 = (<I_RowSettings>r[to]).linked;
        } else {
            r = G_settings.rows[row].registers;
        }
        let temp = r[from];
        r[from] = r[to];
        r[to] = temp;
        if (type === "Row") {
            (<I_RowSettings>r[from]).radius = r1;
            (<I_RowSettings>r[to]).radius = r2;
            (<I_RowSettings>r[from]).linked = l1;
            (<I_RowSettings>r[to]).linked = l2;
        }
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
                    name="Radius Row" value="${r.radius}" min="1" oninput="OG_update()"
                    ${r.linked ? " disabled" : ""}>
            </p>
            <p><input type="checkbox" id="OG_Row_${id}_Linked" class="w3-check"
                    name="Link to previous row"${r.linked ? " checked" : ""}${id === 0 ? " disabled" : ""}
                    onchange="OG_update(1)">
                <label> Link Radius to previous row</label>
            <p>Left Border (in °):
                <input type="number" id="OG_Row_${id}_LeftBorder" class="w3-input"
                    name="Left Border Row" value="${r.leftAngle}" oninput="OG_update()">
            </p>
            <p><input type="checkbox" id="OG_Row_${id}_LeftAngleBorder" class="w3-check"
                    name="Left Angle by Border"${r.leftAngleBorder ? " checked" : ""} onchange="OG_update()">
                <label id="OG_Row_${id}_LeftAngleBorder_Label">
                    Angle by Border or Player (currently ${r.leftAngleBorder ? "Player" : "Border"})
                </label>
            </p>
            <p>Right Border (in °):
                <input type="number" id="OG_Row_${id}_RightBorder" class="w3-input"
                    name="Right Border Row" value="${r.rightAngle}" oninput="OG_update()"`;
        if (r.sync) form += ` disabled`;
        form += `>
            </p>
            <p><input type="checkbox" id="OG_Row_${id}_RightAngleBorder" class="w3-check"
                    name="Right Angle by Border"${r.rightAngleBorder ? " checked" : ""}${r.sync ? " disabled" : ""} onchange="OG_update()">
                <label id="OG_Row_${id}_RightAngleBorder_Label">
                    Angle by Border or Player (currently ${r.rightAngleBorder ? "Player" : "Border"})
                </label>
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
        if (!r.show) {
            if (r.linked && id !== 0) {
                r.radius = G_settings.rows[id - 1].radius + 50;
            }
            return;
        }
        let radiusElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_Radius`);
        let leftBorderElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_LeftBorder`);
        let leftTypeElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_LeftAngleBorder`);
        let leftTypeLabel = document.getElementById(`OG_Row_${id}_LeftAngleBorder_Label`);
        let rightBorderElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_RightBorder`);
        let rightTypeElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_RightAngleBorder`);
        let rightTypeLabel = document.getElementById(`OG_Row_${id}_RightAngleBorder_Label`);
        let syncElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_Sync`);
        let linkedElement = <HTMLInputElement>document.getElementById(`OG_Row_${id}_Linked`);
        r.linked = linkedElement.checked;
        if (r.linked && id !== 0) {
            r.radius = G_settings.rows[id - 1].radius + 50;
            radiusElement.value = String(r.radius);
        } else {
            r.radius = this.handleNumber(radiusElement);
        }
        r.leftAngle = Number(leftBorderElement.value);
        r.leftAngleBorder = leftTypeElement.checked;
        leftTypeLabel.innerText = ` Angle by Border or Player (currently ${r.leftAngleBorder ? "Player" : "Border"})`;
        r.sync = syncElement.checked;
        if (r.sync) {
            r.rightAngle = r.leftAngle;
            rightBorderElement.value = String(r.rightAngle);
            r.rightAngleBorder = r.leftAngleBorder;
            rightTypeLabel.innerText = ` Angle by Border or Player (currently ${r.rightAngleBorder ? "Player" : "Border"})`;
            rightTypeElement.checked = r.leftAngleBorder;
        } else {
            r.rightAngle = Number(rightBorderElement.value);
            r.rightAngleBorder = rightTypeElement.checked;
            rightTypeLabel.innerText = ` Angle by Border or Player (currently ${r.rightAngleBorder ? "Player" : "Border"})`;
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
                    name="Name Register" value="${r.name}" oninput="OG_update()">
            </p>
            <p>Count:
                <input type="number" id="OG_Register_${row}:${id}_count" class="w3-input"
                    name="Count Register" value="${r.count}" min="1" oninput="OG_update()">
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
        r.count = this.handleNumber(countElement);
    }

    /**
     * Renders the general settings
     * @returns html form string
     */
    private drawSettings(): string {
        let form = this.drawSettingsConductor();
        form += `<p>Player Size:
                <input type="number" id="OG_Player_Size" class="w3-input"
                    name="Size Player" value="${G_settings.playerSize}" min="1" oninput="OG_update()">
            </p>
            <p>Register Name Display Type:
                <select class="w3-select" id="OG_Display" name="Display Type" onchange="OG_update()">
                    <option value="none"${G_settings.display === "none" ? " selected" : ""}>None</option>
                    <option value="table"${G_settings.display === "table" ? " selected" : ""}>Table</option>
                </select>
            </p>
            <p>Colors (click color to remove from list):
            <div class="w3-bar w3-white" id="OG_Color_List">`;
        for (let i = 0; i < G_settings.colorPalette.length; i++) {
            let color = G_settings.colorPalette[i];
            form += `<div class="w3-bar-item OG_color_element" onclick="OG_remove('Color', ${i})"
                style="background-color:${color};color:${OGG_getTextColor(color)}">${color}</div>`;
        }
        form += `</div><input type="text" id="OG_Color" class="w3-input w3-margin-top"
                    name="Input Color" oninput="OG_update()">
                Enter Colors as HTML Color Code (e.g. "#ffffff") in the format "#rrggbb".
            </p>`;
        return form;
    }

    /**
     * Updates the general settings
     */
    private updateSettings(): void {
        this.updateSettingsConductor();
        let sizeElement = <HTMLInputElement>document.getElementById("OG_Player_Size");
        let displayElement = <HTMLInputElement>document.getElementById("OG_Display");
        let colorInput = <HTMLInputElement>document.getElementById("OG_Color");
        G_settings.playerSize = this.handleNumber(sizeElement);
        G_settings.display = <"none" | "table">displayElement.value;
        if (colorInput.value.match(/^#[0-9a-f]{6}$/i)) {
            G_settings.colorPalette.push(colorInput.value);
            colorInput.value = "";
            let form = "";
            for (let i = 0; i < G_settings.colorPalette.length; i++) {
                let color = G_settings.colorPalette[i];
                form += `<div class="w3-bar-item OG_color_element" onclick="OG_remove('Color', ${i})"
                    style="background-color:${color};color:${OGG_getTextColor(color)}">${color}</div>`;
            }
            document.getElementById("OG_Color_List").innerHTML = form;
        }
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
                    name="Position Conductor" value="${G_settings.conductorPos}" oninput="OG_update()">
                0 equals circle center point
            </p>
            <p>Size:
                <input type="number" id="OG_Conductor_Size" class="w3-input"
                    name="Size Conductor" value="${G_settings.conductorSize}" min="1" oninput="OG_update()">
            </p></div>`;
        return form;
    }

    /**
     * Updates the settings for the conductor
     */
    private updateSettingsConductor(): void {
        let posElement = <HTMLInputElement>document.getElementById("OG_Conductor_Pos");
        let sizeElement = <HTMLInputElement>document.getElementById("OG_Conductor_Size");
        G_settings.conductorPos = Number(posElement.value);
        G_settings.conductorSize = this.handleNumber(sizeElement);
    }

    /**
     * Replaces common html characters
     * @param str unsanitized string
     * @returns sanitized string
     */
    private sanitizeString(str: string): string {
        str = str.replace(/&/g, "&amp;");
        str = str.replace('"', "&quot;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        return str;
    }

    /**
     * Handles numbers smaller than minimum and updates the value of the input
     * @param element HTMLInput of type number
     * @param min Minimal value (default 1)
     * @returns value if higher than minimum / minimum if lower
     */
    private handleNumber(element: HTMLInputElement, min: number = 1): number {
        if (element.value === "") return min;
        if (Number(element.value) >= min) return Number(element.value);
        element.value = String(min);
        return 1;
    }
}
