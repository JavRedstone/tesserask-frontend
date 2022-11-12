import { AnswerView } from "../../view/answer-view/answer-view";
import { CategoryView } from "../../view/category-view/category-view";
import { SpaceView } from "../../view/space-view/space-view";
import { UserView } from "../../view/user-view/user-view";
import { Category } from "../category/category";
import { Space } from "../space/space";
import { User } from "../user/user";

export class Question {
    public id: number = 0;
    public author !: UserView;
    public authorDTO !: User;
    public space !: SpaceView;
    public spaceDTO !: Space;
    public answers: AnswerView[] = [];
    public categories: CategoryView[] = [];
    public categoriesDTO: Category[] = [];
    public upvoteUsers: UserView[] = [];
    public upvoteUsersDTO: User[] = [];
    public downvoteUsers: UserView[] = [];
    public downvoteUsersDTO: User[] = [];
    public title: string = '';
    public description: string = '';
    public edited: boolean = false;
    public timeCreated: Date = new Date();
}
