import { SpaceView } from "src/app/classes/view/space-view/space-view";

export interface SpaceResult {
    _embedded: {
        spaces: SpaceView[];
    }
    page: {
        totalPages: number;
        number: number;
    }
}
