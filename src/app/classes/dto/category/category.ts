import { SpaceView } from "../../view/space-view/space-view";
import { UserView } from "../../view/user-view/user-view";
import { Space } from "../space/space";
import { User } from "../user/user";

export class Category {
    public id: number = 0;
    public author !: UserView;
    public authorDTO !: User;
    public space !: SpaceView;
    public spaceDTO !: Space;
    public title: string = '';
    public description: string = '';
}