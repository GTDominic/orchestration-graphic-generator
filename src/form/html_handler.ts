class HTMLHandler {
    /**
     * Draws a specified html tree
     * @param tree Tree to draw (array)
     * @param anchorId Id to anchor the document to (should be div)
     */
    public draw(tree: Array<I_HTML_tree>, anchorId: string): void {
        let form = "";
        for(let element of tree) form += this.drawElement(element);
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
        }
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
    public addDiv(context: I_HTML_tree, cssClass: string, id: string = "", attr: I_HTML_attr = {}): I_HTML_tree {
        attr.class = cssClass;
        if(id) attr.id = id;
        let element: I_HTML_tree = {
            type: "div",
            attr,
            children: [],
        }
        if(context !== null) context.children.push(element);
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
        }
        if(context !== null) context.children.push(element);
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
        }
        if(context !== null) context.children.push(element);
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
    public addButton(context: I_HTML_tree, cssClass: string, onclick: string, disabled: boolean = false, attr: I_HTML_attr = {}): I_HTML_tree {
        attr.class = cssClass;
        attr.onclick = onclick;
        let element: I_HTML_tree = {
            type: "button",
            disabled,
            attr,
            children: [],
        }
        if(context !== null) context.children.push(element);
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
        let additionals = `${e.disabled ? " disabled" : ""}${e.checked ? " checked" : ""}${e.selected ? " selected" : ""}`;
        if(e.type === "text") form += e.content;
        else if (e.type === "input") form += `<${e.type} ${attr}${additionals}>`; 
        else {
            form += `<${e.type} ${attr}${additionals}>`;
            for (let child of e.children) form += this.drawElement(child);
            form += `</${e.type}>`
        }
        return form;
    }

    /**
     * Converts HTML_attr element to string
     * @param attr HTML_attr element
     * @returns attributes as string
     */
    private convertAttributesToString(attr: I_HTML_attr): string {
        let attributes: {[index: string]: string} = <{[index: string]: string}>attr;
        let attrString = "";
        for(let key in attributes) attrString += `${key}="${attributes[key]}" `;
        return attrString;
    }
}