interface I_Config {
    version: T_VersionNumber;
    environment: "dev" | "testing" | "production";
    name: string;
    debug: boolean;
    graphicAnchorId: string;
    formAnchorId: string;
    jsonImportId: string;
    errorId: string;
    jsonDownloadName: string;
    svgDownloadName: string;
    diagramSettings: {
        paddingTopBottom: number;
        paddingSide: number;
        registerPadding: number;
        tableHeight: number;
        drawCircles: boolean;
    };
    colorPalettes: Array<Array<string>>;
}

interface I_HTML_tree {
    type: "text" | "div" | "p" | `h${number}` | "input" | "option" | "select" | "label" | "button";
    content?: string;
    checked?: boolean;
    selected?: boolean;
    disabled?: boolean;
    attr?: I_HTML_attr;
    children?: Array<I_HTML_tree>;
}

interface I_HTML_attr {
    class?: string;
    id?: string;
    type?: string;
    name?: string;
    value?: string;
    onclick?: string;
    onchange?: string;
    oninput?: string;
}

type T_VersionNumber = `${number}.${number}.${number}${"" | `-${"dev" | "beta"}`}`;
