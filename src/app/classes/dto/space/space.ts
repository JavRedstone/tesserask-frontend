import { AttachmentView } from "../../view/attachment-view/attachment-view";
import { UserView } from "../../view/user-view/user-view";
import { User } from "../user/user";

export class Space {
    public id: number = 0;
    public author !: UserView;
    public authorDTO !: User;
    public attachments: AttachmentView[] = [];
    public users: UserView[] = [];
    public usersDTO: User[] = [];
    public title: string = '';
    public description: string = '';
    public code: string = '';
    public shared: boolean = false;
    public timeCreated: Date = new Date();
}
