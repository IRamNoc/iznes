import * as E from './FundShareEnum';

const ClassCodeValue = {
    [E.ClassCodeEnum.ClassA]: 'Class A',
    [E.ClassCodeEnum.ClassC]: 'Class C',
    [E.ClassCodeEnum.ClassD]: 'Class D',
    [E.ClassCodeEnum.ClassR]: 'Class R',
    [E.ClassCodeEnum.ClassI]: 'Class I',
};

const CurrencyValue = {
    [E.CurrencyEnum.EUR]: 'EUR',
    [E.CurrencyEnum.GBP]: 'GBP',
    [E.CurrencyEnum.USD]: 'USD',
};

const TimeZoneOffsetValue = {
    [E.TimezonesEnum.UTCP11]: -11,
    [E.TimezonesEnum.UTCP10]: -10,
    [E.TimezonesEnum.UTCP9]: -9,
    [E.TimezonesEnum.UTCP8]: -8,
    [E.TimezonesEnum.UTCP7]: -7,
    [E.TimezonesEnum.UTCP6]: -6,
    [E.TimezonesEnum.UTCP5]: -5,
    [E.TimezonesEnum.UTCP4]: -4,
    [E.TimezonesEnum.UTCP3]: -3,
    [E.TimezonesEnum.UTCP2]: -2,
    [E.TimezonesEnum.UTCP1]: -1,
    [E.TimezonesEnum.UTC]: 0,
    [E.TimezonesEnum.UTCM1]: 1,
    [E.TimezonesEnum.UTCM2]: 2,
    [E.TimezonesEnum.UTCM3]: 3,
    [E.TimezonesEnum.UTCM4]: 4,
    [E.TimezonesEnum.UTCM5]: 5,
    [E.TimezonesEnum.UTCM6]: 6,
    [E.TimezonesEnum.UTCM7]: 7,
    [E.TimezonesEnum.UTCM8]: 8,
    [E.TimezonesEnum.UTCM9]: 9,
    [E.TimezonesEnum.UTCM10]: 10,
    [E.TimezonesEnum.UTCM11]: 11,
};

export {
    ClassCodeValue,
    CurrencyValue,
    TimeZoneOffsetValue,
};
