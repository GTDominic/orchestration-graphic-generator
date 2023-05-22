let G_settings: I_Settings = {
    rows: [],
    conductorPos: 0,
    conductorSize: 20,
    conductorColor: "#aaaaaa",
    playerSize: 10,
    playerColor: "#aaaaaa",
    display: "none",
    colorPalette: ["#aa00dd", "#44bb55"],
};

interface I_Settings {
    rows: Array<I_RowSettings>;
    conductorPos: number;
    conductorSize: number;
    conductorColor: string;
    playerSize: number;
    playerColor: string;
    display: "none" | "table";
    colorPalette: Array<string>;
}

interface I_RowSettings {
    radius: number;
    linked: boolean;
    leftAngle: number;
    leftAngleBorder: boolean;
    rightAngle: number;
    rightAngleBorder: boolean;
    sync: boolean;
    show: boolean;
    registers: Array<I_RegisterSettings>;
}

interface I_RegisterSettings {
    name: string;
    count: number;
    color: string;
    show: boolean;
}
