import { UserView } from "src/app/classes/view/user-view/user-view"

export interface UserResult {
    _embedded: {
        users: UserView[]
    }
    page: {
        totalPages: number;
        number: number;
    }
}
