
export type DevicePatternPassword = {
    type: "pattern";
    dimensions: number;
    points: number[];
};

export type DeviceNumericPassword = {
    type: "numeric";
    password: string;
};

export type DevicePassword = DevicePatternPassword | DeviceNumericPassword;
