import { QuestionView } from "src/app/classes/view/question-view/question-view"

export interface QuestionResult {
    _embedded: {
        questions: QuestionView[]
    }
    page: {
        totalPages: number;
        number: number;
    }
}