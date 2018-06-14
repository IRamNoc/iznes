export interface ProductConfiguration {
    holidayManagement: HolidayManagement;
}

export interface HolidayManagement {
    dates: string[];
}

export interface OfiProductConfigState {
    configuration: ProductConfiguration;
    requestedConfiguration: boolean;
}
