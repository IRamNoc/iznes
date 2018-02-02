import {FormControl} from '@angular/forms';

export interface CouponTab {
    title: {
        icon: string;
        text: string;
    };
    couponId: number;
    formControl?: FormControl;
    active: boolean;
}

export interface OfiCouponState {
    ofiCouponList: Array<any>;
    openedTabs: Array<CouponTab>;
}
