import { CommentView } from "../../view/comment-view/comment-view";
import { UserView } from "../../view/user-view/user-view";
import { Question } from "../question/question";
import { User } from "../user/user";

export class Answer {
    public id: number = 0;
    public author !: UserView;
    public authorDTO !: User;
    public questionDTO !: Question;
    public comments: CommentView[] = [];
    public upvoteUsers: UserView[] = [];
    public upvoteUsersDTO: User[] = [];
    public downvoteUsers: UserView[] = [];
    public downvoteUsersDTO: User[] = [];
    public description: string = '';
    public edited: boolean = false;
    public accepted: boolean = false;
    public timeCreated: Date = new Date();
}
