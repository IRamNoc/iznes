import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LinkConfig } from './message-with-links.model';
import { PermissionsService } from '@setl/utils/services/permissions';

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

    constructor(
        private sanitizer: DomSanitizer,
        public permissionsService: PermissionsService,
    ) {
    }

    ngOnInit() {
        this.buildSafeHtml(this.content, this.data).then((safeHtml) => {
            this.safeHtml = safeHtml;
        });
    }

    /**
     * Build safe html with links from unsafe html and unsafe links
     * 1. sanitize all the links
     * 2. replace all the links with with anchor tags (depending on permission)
     *
     * @param {string} unsafeContent
     * @param {LinkConfig[]} data
     * @return {Promise}
     */
    async buildSafeHtml(unsafeContent: string, data: { links: LinkConfig[] }): Promise<string> {
        if (!unsafeContent || !data) {
            return '';
        }

        const sanitiseLinks = data.links.map((link: LinkConfig) => {
            return Object.assign({}, link, { link: this.sanitizer.sanitize(SecurityContext.URL, link.link) });
        });

        // replace the link links with anchor tags (depending on permission)
        return await this.processContentLinks(unsafeContent, sanitiseLinks);
    }

    /**
     * Process the links within the content depending on permission
     *
     * @param {string} content
     * @param {object} links array
     * @return {Promise}
     */
    async processContentLinks(content: string, links: any): Promise<string> {
        await Promise.all(links.map(async (link) => {
            const linkHtml = `<a class="${link.anchorCss}" href="${link.link}">${link.anchorText}</a>`;

            if (!link.permissionName) {
                content = content.replace('%@link@%', linkHtml);
            } else {
                await this.permissionsService.hasPermission('link.permissionName', 'link.permissionType')
                .then((hasPermission) => {
                    content = content.replace('%@link@%', (hasPermission) ? linkHtml : '&nbsp;');
                });
            }
        }));

        return content;
    }
}
