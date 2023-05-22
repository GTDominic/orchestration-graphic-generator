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

type T_VersionNumber = `${number}.${number}.${number}${"" | `-${"dev" | "beta"}`}`;
