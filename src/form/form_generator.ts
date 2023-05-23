class FormGeneratorNew {
    private html: HTMLHandler;
    private form: Array<I_HTML_tree> = [];

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
        console.log(this.form);
        this.html.draw(this.form, config.formAnchorId);
    }

    /**
     * Draws one row
     * @param context HTML context the Row is drawn in
     * @param i Row index
     */
    public drawRow(context: I_HTML_tree, i: number): void {
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
        let buttonShow = this.html.addButton(
            heading,
            buttonHeaderCss,
            `OG_showHide('Row',${i})`
        );
        this.html.addText(buttonShow, r.show ? "Hide &and;" : "Show &or;");
        this.html.addText(heading, `Row ${i + 1}`);
        buttonHeaderCss += " w3-right";
        let buttonX = this.html.addButton(
            heading,
            buttonHeaderCss,
            `OG_remove('Row',${i})`
        );
        this.html.addText(buttonX, "X");
        if(!r.show) return;
    }
}
