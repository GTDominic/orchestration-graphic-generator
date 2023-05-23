class FormGenerator {
    private html: HTMLHandler;
    private form: Array<I_HTML_tree> = [];

    // Old Attributes:
    private colorPickerIds: Array<string>;
    private palletesActive: boolean = false;
    private activePalette: number = null;

    /**
     * Generates a form and draws it
     */
    constructor() {
        this.html = new HTMLHandler();
        this.draw();
    }

    /**
     * (Re)draws the form
     */
    public draw(): void {
        this.form = [];
        this.colorPickerIds = [];
        let topHDiv = this.html.addDiv(null, "w3-container w3-indigo");
        this.form.push(topHDiv);
        this.html.addText(this.html.addHeader(1, topHDiv), "Orchestration Graphic Generator");

        let rowHTML = this.html.addDiv(null, "w3-container w3-teal");
        this.form.push(rowHTML);
        this.html.addText(this.html.addHeader(2, rowHTML), "Rows:");
        for (let i = 0; i < G_settings.rows.length; i++) this.drawRow(rowHTML, i);
        let rowHTMLp = this.html.addP(rowHTML);
        let rowHTMLpButton = this.html.addButton(
            rowHTMLp,
            "w3-button w3-block w3-dark-grey",
            "OG_add('Row')"
        );
        this.html.addText(rowHTMLpButton, "Add Row");

        let settingsDiv = this.html.addDiv(null, "w3-container w3-green");
        this.form.push(settingsDiv);
        this.html.addText(this.html.addHeader(2, settingsDiv), "General Settings:");
        this.drawSettings(settingsDiv);

        this.html.draw(this.form, config.formAnchorId);
    }

    /**
     * Draws one row
     * @param context HTML context the Row is drawn in
     * @param i Row index
     */
    private drawRow(context: I_HTML_tree, i: number): void {
        let r = G_settings.rows[i];
        let wrapperClass = `w3-panel ${i % 2 === 0 ? "w3-light-blue" : "w3-cyan"} w3-card-4`;
        let wrapper = this.html.addDiv(context, wrapperClass);

        let heading = this.html.addHeader(3, wrapper);

        let buttonHeaderCss = "w3-button w3-blue-grey w3-medium";
        let buttonUp = this.html.addButton(
            heading,
            buttonHeaderCss,
            `OG_move('Row',${i},${i - 1})`,
            i === 0
        );
        this.html.addText(buttonUp, "&uarr;");
        let buttonDown = this.html.addButton(
            heading,
            buttonHeaderCss,
            `OG_move('Row',${i},${i + 1})`,
            i === G_settings.rows.length - 1
        );
        this.html.addText(buttonDown, "&darr;");
        let buttonShow = this.html.addButton(heading, buttonHeaderCss, `OG_showHide('Row',${i})`);
        this.html.addText(buttonShow, r.show ? "Hide &and;" : "Show &or;");
        this.html.addText(heading, ` Row ${i + 1}`);
        buttonHeaderCss += " w3-right";
        let buttonX = this.html.addButton(heading, buttonHeaderCss, `OG_remove('Row',${i})`);
        this.html.addText(buttonX, "X");
        if (!r.show) return;

        let inputCss = "w3-input";
        let checkCss = "w3-check";

        let radiusP = this.html.addP(wrapper);
        this.html.addText(radiusP, "Radius (in px):");
        this.html.addInput(
            radiusP,
            "number",
            inputCss,
            `OG_Row_${i}_Radius`,
            "Radius Row",
            String(r.radius),
            "OG_update()",
            r.linked,
            1
        );

        let linkRow = this.html.addP(wrapper);
        this.html.addCheckbox(
            linkRow,
            checkCss,
            `OG_Row_${i}_Linked`,
            "Link to previous row",
            "OG_update(1)",
            r.linked,
            i === 0
        );
        let linkRowLabel = this.html.addLabel(linkRow);
        this.html.addText(linkRowLabel, " Link Radius to previous row");

        let leftBorder = this.html.addP(wrapper);
        this.html.addText(leftBorder, "Left Border (in °):");
        this.html.addInput(
            leftBorder,
            "number",
            inputCss,
            `OG_Row_${i}_LeftBorder`,
            "Left Border Row",
            String(r.leftAngle),
            "OG_update()"
        );

        let leftAngleBorder = this.html.addP(wrapper);
        let players = 0;
        for(let reg of G_settings.rows[i].registers) players += reg.count;
        this.html.addCheckbox(
            leftAngleBorder,
            checkCss,
            `OG_Row_${i}_LeftAngleBorder`,
            "Left Angle by Border",
            "OG_update()",
            r.leftAngleBorder,
            players <= 1
        );
        let leftAngleBorderLabel = this.html.addLabel(
            leftAngleBorder,
            `OG_Row_${i}_LeftAngleBorder_Label`
        );
        this.html.addText(
            leftAngleBorderLabel,
            ` Angle by Border or Player (currently ${r.leftAngleBorder ? "Player" : "Border"})`
        );

        let rightBorder = this.html.addP(wrapper);
        this.html.addText(rightBorder, "Left Border (in °):");
        this.html.addInput(
            rightBorder,
            "number",
            inputCss,
            `OG_Row_${i}_RightBorder`,
            "Right Border Row",
            String(r.rightAngle),
            "OG_update()",
            r.sync
        );

        let rightAngleBorder = this.html.addP(wrapper);
        this.html.addCheckbox(
            rightAngleBorder,
            checkCss,
            `OG_Row_${i}_RightAngleBorder`,
            "Right Angle by Border",
            "OG_update()",
            r.rightAngleBorder,
            r.sync || players <= 1
        );
        let rightAngleBorderLabel = this.html.addLabel(
            rightAngleBorder,
            `OG_Row_${i}_RightAngleBorder_Label`
        );
        this.html.addText(
            rightAngleBorderLabel,
            ` Angle by Border or Player (currently ${r.rightAngleBorder ? "Player" : "Border"})`
        );

        let sync = this.html.addP(wrapper);
        this.html.addCheckbox(
            sync,
            checkCss,
            `OG_Row_${i}_Sync`,
            "Sync Border Row",
            "OG_update(1)",
            r.sync
        );
        let syncLabel = this.html.addLabel(sync);
        this.html.addText(syncLabel, " Sync");

        for (let j = 0; j < r.registers.length; j++) this.drawRegister(wrapper, j, i);

        let addP = this.html.addP(wrapper);
        let addPButton = this.html.addButton(
            addP,
            "w3-button w3-block w3-blue-grey",
            `OG_add('Register',${i})`
        );
        this.html.addText(addPButton, "Add Register");
    }

    /**
     * Draws one Register
     * @param context HTML Context the register is drawn in
     * @param i Id of the register
     * @param row Id of the row
     */
    private drawRegister(context: I_HTML_tree, i: number, row: number): void {
        let r = G_settings.rows[row].registers[i];
        let wrapper = this.html.addDiv(
            context,
            `w3-panel ${
                i % 2 === 0 ? "w3-aqua" : row % 2 === 0 ? "w3-cyan" : "w3-light-blue"
            } w3-card-4`
        );

        let heading = this.html.addHeader(4, wrapper);

        let buttonHeaderCss = "w3-button w3-blue-grey w3-medium";
        let buttonUp = this.html.addButton(
            heading,
            buttonHeaderCss,
            `OG_move('Register',${i},${i - 1},${row})`,
            i === 0
        );
        this.html.addText(buttonUp, "&uarr;");
        let buttonDown = this.html.addButton(
            heading,
            buttonHeaderCss,
            `OG_move('Register',${i},${i + 1},${row})`,
            i === G_settings.rows[row].registers.length - 1
        );
        this.html.addText(buttonDown, "&darr;");
        let buttonShow = this.html.addButton(
            heading,
            buttonHeaderCss,
            `OG_showHide('Register',${row},${i})`
        );
        this.html.addText(buttonShow, r.show ? "Hide &and;" : "Show &or;");
        let headerTextSpan = this.html.addSpan(heading, `OG_Register_${row}:${i}_nameTag`);
        let headerText = r.name ? ` ${r.name}` : ` Register ${i + 1}`;
        this.html.addText(headerTextSpan, headerText);
        buttonHeaderCss += " w3-right";
        let buttonX = this.html.addButton(
            heading,
            buttonHeaderCss,
            `OG_remove('Register',${row},${i})`
        );
        this.html.addText(buttonX, "X");
        if (!r.show) return;

        let inputCss = "w3-input";

        let name = this.html.addP(wrapper);
        this.html.addText(name, "Name:");
        this.html.addInput(
            name,
            "text",
            inputCss,
            `OG_Register_${row}:${i}_name`,
            "Name Register",
            r.name,
            "OG_update()"
        );

        let count = this.html.addP(wrapper);
        this.html.addText(count, "Count:");
        this.html.addInput(
            count,
            "number",
            inputCss,
            `OG_Register_${row}:${i}_count`,
            "Count Register",
            String(r.count),
            "OG_update()",
            false,
            1
        );
        this.drawColorPicker(wrapper, 1, { row, register: i });
    }

    /**
     * Draws the general Settings
     * @param context HTML context the settings are drawn in
     */
    private drawSettings(context: I_HTML_tree): void {
        this.drawColorPicker(context, 0, {});
        this.drawColorPalettes(context);

        let display = this.html.addP(context);
        this.html.addText(display, "Register Display Type:");
        let displaySelect = this.html.addSelect(
            display,
            "w3-select",
            "OG_Display",
            "Display Type",
            "OG_update()"
        );
        let displaySelectOp1 = this.html.addOption(
            displaySelect,
            "none",
            G_settings.display === "none"
        );
        this.html.addText(displaySelectOp1, "None");
        let displaySelectOp2 = this.html.addOption(
            displaySelect,
            "table",
            G_settings.display === "table"
        );
        this.html.addText(displaySelectOp2, "Table");

        this.drawSettingsConductor(context);

        let playerSize = this.html.addP(context);
        this.html.addText(playerSize, "Player Size:");
        this.html.addInput(
            playerSize,
            "number",
            "w3-input",
            "OG_Player_Size",
            "Size Player",
            String(G_settings.playerSize),
            "OG_update()",
            false,
            1
        );

        this.drawColorPicker(context, 2, { id: "player", bkgColor: G_settings.playerColor });
    }

    /**
     * Draws the conductor settings
     * @param context HTML context the settings are drawn in
     */
    private drawSettingsConductor(context: I_HTML_tree): void {
        let div = this.html.addDiv(context, "w3-panel w3-light-green w3-card-4");
        let heading = this.html.addHeader(3, div);
        this.html.addText(heading, "Conductor:");

        let position = this.html.addP(div);
        this.html.addText(position, "Position:");
        this.html.addInput(
            position,
            "number",
            "w3-input",
            "OG_Conductor_Pos",
            "Position Conductor",
            String(G_settings.conductorPos),
            "OG_update()"
        );
        this.html.addText(position, "0 equals circle center point");

        let size = this.html.addP(div);
        this.html.addText(size, "Size:");
        this.html.addInput(
            size,
            "number",
            "w3-input",
            "OG_Conductor_Size",
            "Size Conductor",
            String(G_settings.conductorSize),
            "OG_update()",
            false,
            1
        );

        this.drawColorPicker(div, 2, { id: "conductor", bkgColor: G_settings.conductorColor });
    }

    /**
     * Draws the color palettes
     * @param context HTML context the palettes are drawn in
     */
    private drawColorPalettes(context: I_HTML_tree): void {
        let showHide = this.html.addButton(
            context,
            "w3-button w3-blue-grey w3-medium",
            "OG_showHide('Palettes')"
        );
        let showHideText = this.palletesActive
            ? "Hide Palettes &and;"
            : "Choose Color Palette &or;";
        this.html.addText(showHide, showHideText);
        if (!this.palletesActive) return;
        let none = this.html.addDiv(context, "w3-row w3-margin-top w3-light-green OG_palette", "", {
            onclick: "OG_choosePalette(null)",
        });
        this.html.addText(none, "None");
        for (let i = 0; i < config.colorPalettes.length; i++) {
            let palette = config.colorPalettes[i];
            let size = 100 / palette.length;
            let row = this.html.addDiv(context, "w3-row w3-margin-top OG_palette", "", {
                onclick: `OG_choosePalette(${i})`,
            });
            for (let c of palette) {
                let element = this.html.addDiv(row, "w3-col", "", {
                    style: `width:${size}%;background-color:${c};color:${OGG_getTextColor(c)}`,
                });
                this.html.addText(element, c);
            }
        }
    }

    /**
     * Draws a color picker
     * @param context HTML Context the Picker is drawn in
     * @param mode Mode 0: Global; Mode 1: Register; Mode 2: Identifier
     * @param attr Defines necessary attributes (Mode 1: Set row and register; Mode 2: Set id and bkg color)
     */
    private drawColorPicker(
        context: I_HTML_tree,
        mode: 0 | 1 | 2,
        attr: { row?: number; register?: number; id?: string; bkgColor?: string }
    ): void {
        let listId =
            mode === 0
                ? "OG_Color_List"
                : mode === 1
                ? `OG_Register_${attr.row}:${attr.register}_colorList`
                : `OG_Color_List_${attr.id}`;
        if (mode === 2) this.colorPickerIds.push(listId);

        let topP = this.html.addP(context);
        this.html.addText(
            topP,
            `${mode === 0 ? "Custom colors" : "Color"} (click color to ${
                mode === 0 ? "remove from list" : "choose"
            }):`
        );

        let colorList = this.html.addDiv(context, "w3-bar", listId, {
            style: `background-color: ${
                mode === 0
                    ? "white"
                    : mode === 1
                    ? G_settings.rows[attr.row].registers[attr.register].color
                    : attr.bkgColor
            }`,
        });

        for (
            let i = 0;
            i < (mode === 0 ? G_settings.customColors.length : G_settings.colorPalette.length);
            i++
        ) {
            let color = mode === 0 ? G_settings.customColors[i] : G_settings.colorPalette[i];
            let colorElement = this.html.addDiv(colorList, "w3-bar-item OG_color_element", "", {
                onclick: `${
                    mode === 0
                        ? `OG_remove('Color', ${i})`
                        : `OG_chooseColor('${attr.id}', ${attr.row}, ${attr.register}, '${color}')`
                }`,
                style: `background-color:${color};color:${OGG_getTextColor(color)}`,
            });
            this.html.addText(colorElement, color);
        }
        this.html.addInput(
            context,
            "text",
            "w3-input w3-margin-top",
            `${
                mode === 0
                    ? "OG_Color"
                    : mode === 1
                    ? `OG_Register_${attr.row}:${attr.register}_color`
                    : `OG_Color_${attr.id}`
            }`,
            "Input Color",
            "",
            "OG_update()"
        );
        let noteP = this.html.addP(context);
        this.html.addText(
            noteP,
            'Enter Colors as HTML Color Code (e.g. "#ffffff") in the format "#rrggbb".'
        );
    }

    // Old Functions:

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
            let radius =
                G_settings.rows.length === 0
                    ? 100
                    : G_settings.rows[G_settings.rows.length - 1].radius + 50;
            let linked = G_settings.rows.length === 0 ? false : true;
            let leftAngle =
                G_settings.rows.length === 0
                    ? 90
                    : G_settings.rows[G_settings.rows.length - 1].leftAngle;
            let rightAngle =
                G_settings.rows.length === 0
                    ? 90
                    : G_settings.rows[G_settings.rows.length - 1].rightAngle;
            let sync = G_settings.rows.length === 0 ? true : G_settings.rows[G_settings.rows.length - 1].sync;
            G_settings.rows.push({
                radius,
                linked,
                leftAngle,
                leftAngleBorder: false,
                rightAngle,
                rightAngleBorder: false,
                sync,
                show: true,
                registers: [],
            });
            G_settings.rows[G_settings.rows.length - 1].registers.push({
                name: "",
                count: 1,
                show: true,
                color: "#000000",
            });
            this.assignDefaultColor(G_settings.rows.length - 1, 0);
        } else {
            G_settings.rows[row].registers.push({
                name: "",
                count: 1,
                show: true,
                color: "#000000",
            });
            this.assignDefaultColor(row, G_settings.rows[row].registers.length - 1);
        }
        this.draw();
    }

    /**
     * Removes a row or register
     * @param type "Row" | "Register"
     * @param row Defines the row that is removed or where the register is removed from | Defines the color position
     * @param register If "Register" defines the register to be removed
     */
    public remove(type: "Row" | "Register" | "Color", row: number, register: number): void {
        if (type === "Row") {
            let r = G_settings.rows[row].radius;
            let l = G_settings.rows[row].linked;
            G_settings.rows.splice(row, 1);
            if (row < G_settings.rows.length) {
                let e = G_settings.rows[row];
                if (e.linked === true) {
                    e.radius = r;
                    e.linked = l;
                }
            }
        } else if (type === "Register") {
            G_settings.rows[row].registers.splice(register, 1);
            this.updateRow(row);
        } else {
            G_settings.customColors.splice(row, 1);
        }
        this.draw();
    }

    /**
     * Toggles the show hide attribute of a register/row
     * @param type "Row" | "Register" | "Palettes"
     * @param row Row that should be toggled or the row where the register should be toggled
     * @param register If "Register" defines the register to be toggled
     */
    public showHide(type: "Row" | "Register" | "Palettes", row: number, register: number) {
        if (type === "Row") {
            G_settings.rows[row].show = !G_settings.rows[row].show;
        } else if (type === "Register") {
            G_settings.rows[row].registers[register].show =
                !G_settings.rows[row].registers[register].show;
        } else this.palletesActive = !this.palletesActive;
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
     * Chooses the color for a specified register
     * @param row id of the row the register is in
     * @param register id of the register
     * @param color html color string
     */
    public chooseColor(id: string, row: number, register: number, color: string): void {
        if (!id || id === "undefined") G_settings.rows[row].registers[register].color = color;
        else if (id === "conductor") G_settings.conductorColor = color;
        else if (id === "player") G_settings.playerColor = color;
        if (config.environment === "dev" && config.debug) console.log(G_settings);
        this.draw();
    }

    /**
     * Chooses a color palette as base
     * @param id Id of the color palette
     */
    public choosePalette(id: number): void {
        if (id === null) G_settings.colorPalette = G_settings.customColors;
        else {
            G_settings.colorPalette = [...config.colorPalettes[id]];
            for (let c of G_settings.customColors) G_settings.colorPalette.push(c);
        }
        this.activePalette = id;
        this.draw();
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
        let leftBorderElement = <HTMLInputElement>(
            document.getElementById(`OG_Row_${id}_LeftBorder`)
        );
        let leftTypeElement = <HTMLInputElement>(
            document.getElementById(`OG_Row_${id}_LeftAngleBorder`)
        );
        let leftTypeLabel = document.getElementById(`OG_Row_${id}_LeftAngleBorder_Label`);
        let rightBorderElement = <HTMLInputElement>(
            document.getElementById(`OG_Row_${id}_RightBorder`)
        );
        let rightTypeElement = <HTMLInputElement>(
            document.getElementById(`OG_Row_${id}_RightAngleBorder`)
        );
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
        leftTypeLabel.innerText = ` Angle by Border or Player (currently ${
            r.leftAngleBorder ? "Player" : "Border"
        })`;
        r.sync = syncElement.checked;
        if (r.sync) {
            r.rightAngle = r.leftAngle;
            rightBorderElement.value = String(r.rightAngle);
            r.rightAngleBorder = r.leftAngleBorder;
            rightTypeLabel.innerText = ` Angle by Border or Player (currently ${
                r.rightAngleBorder ? "Player" : "Border"
            })`;
            rightTypeElement.checked = r.leftAngleBorder;
        } else {
            r.rightAngle = Number(rightBorderElement.value);
            r.rightAngleBorder = rightTypeElement.checked;
            rightTypeLabel.innerText = ` Angle by Border or Player (currently ${
                r.rightAngleBorder ? "Player" : "Border"
            })`;
        }
        for (let i = 0; i < r.registers.length; i++) this.updateRegister(i, id);
        let players = 0;
        for(let reg of G_settings.rows[id].registers) players += reg.count;
        if(players <= 1) {
            r.leftAngleBorder = false;
            leftTypeElement.checked = false;
            r.rightAngleBorder = false;
            rightTypeElement.checked = false;
        }
        leftTypeElement.disabled = players <= 1;
        rightTypeElement.disabled = r.sync || players <= 1;
    }

    /**
     * Updates the settings for a register
     * @param id Id of the register
     * @param row Row that the register is in
     */
    private updateRegister(id: number, row: number): void {
        this.updateColorPicker(1, { row, register: id });
        let r = G_settings.rows[row].registers[id];
        if (!r.show) return;
        let nameElement = <HTMLInputElement>(
            document.getElementById(`OG_Register_${row}:${id}_name`)
        );
        let countElement = <HTMLInputElement>(
            document.getElementById(`OG_Register_${row}:${id}_count`)
        );
        r.name = this.sanitizeString(nameElement.value);
        document.getElementById(`OG_Register_${row}:${id}_nameTag`).innerHTML = r.name
            ? ` ${r.name}`
            : ` Register ${id + 1}`;
        r.count = this.handleNumber(countElement);
    }

    /**
     * Updates the general settings
     */
    private updateSettings(): void {
        this.updateSettingsConductor();
        let color = this.updateColorPicker(2, { id: "player" });
        if (color) G_settings.playerColor = color;
        this.updateColorPicker(0, {});
        let sizeElement = <HTMLInputElement>document.getElementById("OG_Player_Size");
        let displayElement = <HTMLInputElement>document.getElementById("OG_Display");
        G_settings.playerSize = this.handleNumber(sizeElement);
        G_settings.display = <"none" | "table">displayElement.value;
    }

    /**
     * Updates the settings for the conductor
     */
    private updateSettingsConductor(): void {
        let color = this.updateColorPicker(2, { id: "conductor" });
        if (color) G_settings.conductorColor = color;
        let posElement = <HTMLInputElement>document.getElementById("OG_Conductor_Pos");
        let sizeElement = <HTMLInputElement>document.getElementById("OG_Conductor_Size");
        G_settings.conductorPos = Number(posElement.value);
        G_settings.conductorSize = this.handleNumber(sizeElement);
    }

    /**
     * Updates the color pickers
     * @param global Defines wether it is the global or a register specific color picker
     * @param row In Register Mode defines row id
     * @param register In Register Mode defines register id
     */
    private updateColorPicker(
        mode: 0 | 1 | 2,
        attr: { row?: number; register?: number; id?: string }
    ): string {
        if (
            mode === 1 &&
            (!G_settings.rows[attr.row].registers[attr.register].show ||
                !G_settings.rows[attr.row].show)
        )
            return;
        let id =
            mode === 0
                ? "OG_Color"
                : mode === 1
                ? `OG_Register_${attr.row}:${attr.register}_color`
                : `OG_Color_${attr.id}`;
        let colorInput = <HTMLInputElement>document.getElementById(id);
        colorInput.value = colorInput.value.toLowerCase();
        if (!colorInput.value.match(/^#[0-9a-f]{6}$/i)) return null;
        if (G_settings.customColors.indexOf(colorInput.value) !== -1) {
            colorInput.value = "";
            return null;
        }
        let value = colorInput.value;
        G_settings.customColors.push(value);
        if (this.activePalette === null) G_settings.colorPalette = G_settings.customColors;
        else {
            G_settings.colorPalette = [...config.colorPalettes[this.activePalette]];
            for (let c of G_settings.customColors) G_settings.colorPalette.push(c);
        }
        if (mode === 1) {
            G_settings.rows[attr.row].registers[attr.register].color = value;
            document
                .getElementById(`OG_Register_${attr.row}:${attr.register}_colorList`)
                .setAttribute("style", `background-color: ${colorInput.value}`);
        }
        if (mode === 2) {
            document
                .getElementById(`OG_Color_List_${attr.id}`)
                .setAttribute("style", `background-color: ${colorInput.value}`);
        }
        colorInput.value = "";
        let form = "";
        for (let i = 0; i < G_settings.customColors.length; i++) {
            let color = G_settings.customColors[i];
            form += `<div class="w3-bar-item OG_color_element" onclick="OG_remove('Color', ${i})"
                style="background-color:${color};color:${OGG_getTextColor(color)}">${color}</div>`;
        }
        document.getElementById("OG_Color_List").innerHTML = form;
        for (let i = 0; i < G_settings.rows.length; i++) {
            for (let j = 0; j < G_settings.rows[i].registers.length; j++) {
                let reg = G_settings.rows[i].registers[j];
                if (!reg.show) continue;
                form = "";
                for (let k = 0; k < G_settings.colorPalette.length; k++) {
                    let color = G_settings.colorPalette[k];
                    form += `<div class="w3-bar-item OG_color_element" onclick="OG_chooseColor('', ${i}, ${j}, '${color}')"
                        style="background-color:${color};color:${OGG_getTextColor(
                        color
                    )}">${color}</div>`;
                }
                document.getElementById(
                    `OG_Register_${attr.row}:${attr.register}_colorList`
                ).innerHTML = form;
            }
        }
        for (let id of this.colorPickerIds) {
            form = "";
            for (let i = 0; i < G_settings.colorPalette.length; i++) {
                let color = G_settings.colorPalette[i];
                form += `<div class="w3-bar-item OG_color_element" onclick="OG_chooseColor('${id}', 0, 0, '${color}')"
                    style="background-color:${color};color:${OGG_getTextColor(
                    color
                )}">${color}</div>`;
            }
            document.getElementById(id).innerHTML = form;
        }
        return value;
    }

    /**
     * Assigns a default background color
     * @param row rowId
     * @param register registerId
     */
    private assignDefaultColor(row: number, register: number): void {
        let freeColors = [...G_settings.colorPalette];
        for (let row of G_settings.rows) {
            for (let reg of row.registers) {
                let i = freeColors.indexOf(reg.color);
                if (i !== -1) freeColors.splice(i, 1);
            }
        }
        if (freeColors.length >= 1) G_settings.rows[row].registers[register].color = freeColors[0];
        else if (G_settings.colorPalette.length >= 1)
            G_settings.rows[row].registers[register].color = G_settings.colorPalette[0];
        else G_settings.rows[row].registers[register].color = "#000000";
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
