let G_settings: I_Settings = {
    rows: [],
    conductorPos: 0,
};

interface I_Settings {
    rows: Array<I_RowSettings>;
    conductorPos: number;
}

interface I_RowSettings {
    radius: number;
    linked: boolean;
    leftAngle: number;
    rightAngle: number;
    sync: boolean;
    show: boolean;
    registers: Array<I_RegisterSettings>;
}

interface I_RegisterSettings {
    name: string;
    count: number;
    show: boolean;
}