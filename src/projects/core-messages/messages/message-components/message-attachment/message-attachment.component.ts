import { Component, Input } from '@angular/core';
/**
 * SETL Message Attachment Component
 *
 * Displays uploaded files as attachments to messages
 *
 * @uses FileViewerComponent to download display the attachment
 */
@Component({
    selector: 'setl-message-attachment',
    templateUrl: './message-attachment.component.html',
    styleUrls: ['./message-attachment.component.css'],
})
export class SetlMessageAttachmentComponent {
    @Input() attachmentType: string = null;
    @Input() attachmentId: string = null;
}
