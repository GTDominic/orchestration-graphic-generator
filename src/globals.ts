let G_settings: I_Settings = {
    rows: [],
    dirPos: 0,
};

interface I_Settings {
    rows: Array<I_RowSettings>;
    dirPos: number;
}

interface I_RowSettings {
    radius: number;
    leftAngle: number;
    rightAngle: number;
    registers: Array<I_RegisterSettings>;
}

interface I_RegisterSettings {
    name: string;
    count: number;
}
