let G_settings: I_Settings = {
    rows: [],
    conductorPos: 0,
    conductorSize: 20,
    playerSize: 10,
    display: "none",
};

interface I_Settings {
    rows: Array<I_RowSettings>;
    conductorPos: number;
    conductorSize: number;
    playerSize: number;
    display: "none" | "table";
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
    show: boolean;
}
