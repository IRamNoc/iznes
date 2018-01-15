import { trigger, animate, transition, style, query } from '@angular/animations';

const slideDistance = 20;
const slideDuration = 1500;

export const FadeSlideTop =
    trigger('routerTransition', [
        transition('* <=> *', [
            query(':enter', [
                style({
                    position: 'fixed',
                    width: 'calc(100% - 230px)',
                    opacity: 0,
                    transform: `translateY(${slideDistance}px)`,
                }),
                animate(`${slideDuration}ms ease`, style({
                    position: 'fixed',
                    width: 'calc(100% - 230px)' ,
                    opacity: 1,
                    transform: 'translateY(0%)'
                })),
                style({
                    position: 'relative',
                })
            ], { optional: true }),
        ])
    ]);
