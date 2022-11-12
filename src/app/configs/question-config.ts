import { environment } from "src/environments/environment";

export default {
    height: 110,
    width: environment.itemWidth,
    titleLength: 200,
    descriptionLength: 2000,
    maxAttachmentAmount: 10,
    maxAttachmentSize: 10,
    titleType: 'title',
    attachmentType: 'attachment'
}