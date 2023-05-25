let G_settings: I_Settings = {
    rows: [],
    conductorEnabled: true,
    conductorPos: 0,
    conductorSize: 20,
    conductorColor: "#aaaaaa",
    playerSize: 10,
    playerColor: "#aaaaaa",
    display: "none",
    colorPalette: [],
    customColors: [],
};

interface I_Settings {
    rows: Array<I_RowSettings>;
    conductorEnabled: boolean;
    conductorPos: number;
    conductorSize: number;
    conductorColor: string;
    playerSize: number;
    playerColor: string;
    display: "none" | "table";
    colorPalette: Array<string>;
    customColors: Array<string>;
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
    showMove: boolean;
}
