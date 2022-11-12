import { AttachmentView } from "../../view/attachment-view/attachment-view";

export class User {
    public id: number = 0;
    public attachments: AttachmentView[] = [];
    public uid: string = '';
    public title: string = '';
    public email: string = '';
    public description: string = '';
    public curiosityPoints: number = 0;
    public helperPoints: number = 0;
    public timeCreated: Date = new Date();
}