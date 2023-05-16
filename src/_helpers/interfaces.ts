interface I_Config {
    version: T_VersionNumber;
    environment: "dev" | "testing" | "production";
    name: string;
    debug: boolean;
    graphicAnchorId: string;
    formAnchorId: string;
    diagramSettings: {
        paddingTopBottom: number;
        paddingSide: number;
        conductorSize: number;
        playerSize: number;
        registerPadding: number;
        drawCircles: boolean;
        colors: Array<string>;
    };
}

type T_VersionNumber = `${number}.${number}.${number}`;