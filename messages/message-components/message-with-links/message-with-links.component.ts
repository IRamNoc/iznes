import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LinkConfig } from './message-with-links.model';

@Component({
    selector: 'setl-message-with-links',
    templateUrl: './message-with-links.component.html',
})
export class SetlMessageWithLinksComponent implements OnInit{
    @Input()
    data: any;

    @Input()
    content: string;

    safeHtml: string;

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.safeHtml = this.buildSafeHtml(this.content, this.data);
    }

    /**
     * Build safe html with links from unsafe html and unsafe links
     * 1. sanitize all the links
     * 2. replace all the links with with anchor tags.
     *
     * @param {string} unsafeContent
     * @param {LinkConfig[]}} data
     * @return {string}
     */
    buildSafeHtml(unsafeContent: string, data: {links: LinkConfig[]}): string {
        if (!unsafeContent || !data) {
            return '';
        }

        const sanitiseLinks = data.links.map((link: LinkConfig) => {
            return Object.assign({}, link, { link: this.sanitizer.sanitize(SecurityContext.URL, link.link) });
        });

        // replace the link links with anchor tag.
        sanitiseLinks.forEach((link: LinkConfig) => {
            const linkHtml = `<a class="${link.anchorCss}" href="${link.link}">${link.anchorText}</a>`;
            unsafeContent = unsafeContent.replace('%@link@%', linkHtml);
        });

        return this.sanitizer.sanitize(SecurityContext.HTML, unsafeContent);
    }

}
