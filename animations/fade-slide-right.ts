import {trigger, animate, transition, style, query} from '@angular/animations';

const slideDistance = 20;
const slideDuration = 1500;

const FullSizeAnimation = [
    style({
        position: 'fixed',
        width: 'calc(100% - 230px)',
        opacity: 0,
        transform: `translateX(${slideDistance}px)`,
    }),
    animate(`${slideDuration}ms ease`, style({
        position: 'fixed',
        width: 'calc(100% - 230px)',
        opacity: 1,
        transform: 'translateX(0%)'
    })),
    style({
        position: 'relative',
    })
];

const SmallSizeAnimation = [
    style({
        position: 'fixed',
        width: 'calc(100% - 80px)',
        opacity: 0,
        transform: `translateX(${slideDistance}px)`,
    }),
    animate(`${slideDuration}ms ease`, style({
        position: 'fixed',
        width: 'calc(100% - 80px)',
        opacity: 1,
        transform: 'translateX(0%)'
    })),
    style({
        position: 'relative',
    })
];

export const FadeSlideRight =
    trigger('routerTransition', [
        transition('* <=> *', [
            query('main:not(.menuHideContent) .fade-slide-right', FullSizeAnimation, {optional: true}),
            query('.menuHideContent .fade-slide-right', SmallSizeAnimation, {optional: true})
        ])
    ]);