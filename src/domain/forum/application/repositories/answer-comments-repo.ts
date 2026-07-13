import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentRepo {
    create(answerComment: AnswerComment): Promise<AnswerComment>;

    save(answerComment: AnswerComment): Promise<AnswerComment>;

    delete(answerComment: AnswerComment): Promise<void>;

    findById(id: string): Promise<AnswerComment | null>;

    findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>;

    deleteManyByAnswerId(answerId: string): Promise<void>;
}