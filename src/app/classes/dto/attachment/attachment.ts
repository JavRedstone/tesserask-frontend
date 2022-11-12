import { Answer } from "../answer/answer";
import { Question } from "../question/question";
import { Space } from "../space/space";
import { User } from "../user/user";

export class Attachment {
    public id: number = 0;
    public userDTO: User | null = null;
    public spaceDTO: Space | null = null;
    public questionDTO: Question | null = null;
    public answerDTO: Answer | null = null;
    public name: string = '';
    public type: string = '';
    public size: number = 0;
    public lastModified: number = 0;
    public base64: string = '';
}
