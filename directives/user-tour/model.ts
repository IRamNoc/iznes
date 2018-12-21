export interface TourConfig {
    tourName: string;
    autostart?: boolean;
    stages: StagesConfig;
}

interface StagesConfig {
    [stageName: string]: {
        title: string;
        text: string;
        mustComplete?: () => {};
        highlight?: boolean;
        position?: PositionEnum;
        preserveWidth?: boolean;
    };
}

enum PositionEnum {
    'top-left',
    'top-middle',
    'top-right',
    'right-top',
    'right-middle',
    'right-bottom',
    'bottom-left',
    'bottom-middle',
    'bottom-right',
    'left-top',
    'left-middle',
    'left-bottom',
}
