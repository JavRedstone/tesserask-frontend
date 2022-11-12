import { AttachmentView } from "src/app/classes/view/attachment-view/attachment-view";

export interface AttachmentResult {
    _embedded: {
        attachments: AttachmentView[]
    }
    page: {
        totalPages: number;
        number: number;
    }
}