import { environment } from "src/environments/environment";

export default {
    minHeight: 150,
    width: environment.itemWidth - 25,
    descriptionLength: 1500,
    maxListAmount: 50,
    maxAttachmentAmount: 5,
    maxAttachmentSize: 5,
    attachmentType: 'attachment'
}