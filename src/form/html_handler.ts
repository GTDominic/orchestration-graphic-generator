class HTMLHandler {
    /**
     * Draws a specified html tree
     * @param tree Tree to draw (array)
     * @param anchorId Id to anchor the document to (should be div)
     */
    public draw(tree: Array<I_HTML_tree>, anchorId: string): void {
        let form = "";
        for (let element of tree) form += this.drawElement(element);
        document.getElementById(anchorId).innerHTML = form;
    }

    /**
     * Adds text to an HTML Element
     * @param context HTML Context to put the text in
     * @param content Text content
     */
    public addText(context: I_HTML_tree, content: string): void {
        let element: I_HTML_tree = {
            type: "text",
            content,
        };
        context.children.push(element);
    }

    /**
     * Adds a div to an HTML Element
     * @param context HTML Context to put the text in (null if no context)
     * @param cssClass css Class
     * @param id css ID
     * @param attr attribute object
     * @returns Created element
     */
    public addDiv(
        context: I_HTML_tree,
        cssClass: string,
        id: string = "",
        attr: I_HTML_attr = {}
    ): I_HTML_tree {
        attr.class = cssClass;
        if (id) attr.id = id;
        let element: I_HTML_tree = {
            type: "div",
            attr,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Adds a heading element to an HTML Element
     * @param type Heading type (h1, h2, h3)
     * @param context HTML Context to put the text in (null if no context)
     * @param attr attribute object
     * @returns Created element
     */
    public addHeader(type: number, context: I_HTML_tree, attr: I_HTML_attr = {}): I_HTML_tree {
        let element: I_HTML_tree = {
            type: `h${type}`,
            attr,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Adds a p element to an HTML Element
     * @param context HTML Context to put the text in (null if no context)
     * @param attr attribute object
     * @returns Created element
     */
    public addP(context: I_HTML_tree, attr: I_HTML_attr = {}): I_HTML_tree {
        let element: I_HTML_tree = {
            type: "p",
            attr,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Adds a label element to an HTML Element
     * @param context HTML Context to put the text in (null if no context)
     * @param id css id
     * @param attr attribute object
     * @returns Created element
     */
    public addLabel(context: I_HTML_tree, id: string = "", attr: I_HTML_attr = {}): I_HTML_tree {
        if (id) attr.id = id;
        let element: I_HTML_tree = {
            type: "label",
            attr,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Adds a span element to an HTML Element
     * @param context HTML Context to put the text in (null if no context)
     * @param id css id
     * @param cssClass css class
     * @param attr attribute object
     * @returns Created element
     */
    public addSpan(
        context: I_HTML_tree,
        id: string,
        cssClass: string = "",
        attr: I_HTML_attr = {}
    ): I_HTML_tree {
        attr.id = id;
        if (cssClass) attr.class = cssClass;
        let element: I_HTML_tree = {
            type: "span",
            attr,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Adds a button to an HTML Element
     * @param context HTML Context to put the text in (null if no context)
     * @param cssClass css Class
     * @param onclick Function to be executed onclick
     * @param disabled true if disabled; false otherwise
     * @param attr attribute object
     * @returns Created element
     */
    public addButton(
        context: I_HTML_tree,
        cssClass: string,
        onclick: string,
        disabled: boolean = false,
        attr: I_HTML_attr = {}
    ): I_HTML_tree {
        attr.class = cssClass;
        attr.onclick = onclick;
        let element: I_HTML_tree = {
            type: "button",
            disabled,
            attr,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Adds an input to an HTML Element (not to use for checkboxes)
     * @param context HTML Context to put the text in
     * @param type type of input
     * @param cssClass css Class
     * @param id css Id
     * @param name name attribute
     * @param value value of the input
     * @param oninput function executed oninput
     * @param disabled true if disabled
     * @param min minimum value
     * @param attr attribute object
     */
    public addInput(
        context: I_HTML_tree,
        type: string,
        cssClass: string,
        id: string,
        name: string,
        value: string,
        oninput: string,
        disabled: boolean = false,
        min?: number,
        attr: I_HTML_attr = {}
    ): void {
        attr.type = type;
        attr.class = cssClass;
        attr.id = id;
        attr.name = name;
        attr.value = value;
        attr.oninput = oninput;
        if (min) attr.min = String(min);
        let element: I_HTML_tree = {
            type: "input",
            disabled,
            attr,
            children: [],
        };
        context.children.push(element);
    }

    /**
     * Adds a checkbox to an HTML Element
     * @param context HTML Context to put the text in (null if no context)
     * @param cssClass css Class
     * @param id css Id
     * @param name name attribute
     * @param onchange function executed onchange
     * @param checked true if checked
     * @param disabled true if disabled
     * @param attr attribute object
     * @returns Created element
     */
    public addCheckbox(
        context: I_HTML_tree,
        cssClass: string,
        id: string,
        name: string,
        onchange: string,
        checked: boolean,
        disabled: boolean = false,
        attr: I_HTML_attr = {}
    ): I_HTML_tree {
        attr.type = "checkbox";
        attr.class = cssClass;
        attr.id = id;
        attr.name = name;
        attr.onchange = onchange;
        let element: I_HTML_tree = {
            type: "input",
            disabled,
            checked,
            attr,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Adds a select to an HTML Element
     * @param context HTML Context to put the text in (null if no context)
     * @param cssClass css Class
     * @param id css Id
     * @param name name attribute
     * @param onchange function executed onchange
     * @param attr attribute object
     * @returns Created element
     */
    public addSelect(
        context: I_HTML_tree,
        cssClass: string,
        id: string,
        name: string,
        onchange: string,
        attr: I_HTML_attr = {}
    ): I_HTML_tree {
        attr.class = cssClass;
        attr.id = id;
        attr.name = name;
        attr.onchange = onchange;
        let element: I_HTML_tree = {
            type: "select",
            attr,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Adds an option to an HTML Element
     * @param context HTML Context to put the text in (null if no context)
     * @param value value attribute
     * @param selected true if selected
     * @param attr attribute object
     * @returns Created element
     */
    public addOption(
        context: I_HTML_tree,
        value: string,
        selected: boolean,
        disabled: boolean = false,
        attr: I_HTML_attr = {}
    ): I_HTML_tree {
        attr.value = value;
        let element: I_HTML_tree = {
            type: "option",
            attr,
            selected,
            disabled,
            children: [],
        };
        if (context !== null) context.children.push(element);
        return element;
    }

    /**
     * Draws a element of the tree and his children
     * @param e Tree Element
     * @returns form string
     */
    private drawElement(e: I_HTML_tree): string {
        let attr = this.convertAttributesToString(e.attr);
        let form = "";
        let additionals = `${e.disabled ? " disabled" : ""}${e.checked ? " checked" : ""}${
            e.selected ? " selected" : ""
        }`;
        if (e.type === "text") form += e.content;
        else if (e.type === "input") form += `<${e.type} ${attr}${additionals}>`;
        else {
            form += `<${e.type} ${attr}${additionals}>`;
            for (let child of e.children) form += this.drawElement(child);
            form += `</${e.type}>`;
        }
        return form;
    }

    /**
     * Converts HTML_attr element to string
     * @param attr HTML_attr element
     * @returns attributes as string
     */
    private convertAttributesToString(attr: I_HTML_attr): string {
        let attributes: { [index: string]: string } = <{ [index: string]: string }>attr;
        let attrString = "";
        for (let key in attributes) attrString += `${key}="${attributes[key]}" `;
        return attrString;
    }
}
