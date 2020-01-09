import {trigger, animate, transition, style, query} from '@angular/animations';

const slideDistance = 20;
const slideDuration = 1500;

const animation = [
    style({
        opacity: 0,
        transform: `translateX(${slideDistance}px)`,
    }),
    animate(`${slideDuration}ms ease`, style({
        opacity: 1,
        transform: 'translateX(0%)'
    })),
];

export const FadeSlideRight =
    trigger('routerTransition', [
        transition('* <=> *', [
            query('.router-container', style({overflow : 'hidden'})),
            query('.fade-slide-right', animation, {optional: true}),
            query('.router-container', style({overflow : 'visible'}))
        ])
    ])
;