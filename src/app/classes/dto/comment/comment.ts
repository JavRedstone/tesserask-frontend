import { UserView } from "../../view/user-view/user-view";
import { Answer } from "../answer/answer";
import { User } from "../user/user";

export class Comment {
    public id: number = 0;
    public author !: UserView;
    public authorDTO !: User;
    public answerDTO !: Answer;
    public description: string = '';
    public edited: boolean = false;
    public timeCreated: Date = new Date();
}