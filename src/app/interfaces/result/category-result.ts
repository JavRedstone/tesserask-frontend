import { CategoryView } from "src/app/classes/view/category-view/category-view";

export interface CategoryResult {
    _embedded: {
        categories: CategoryView[];
    }
    page: {
        totalPages: number;
        number: number;
    }
}