import { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentRepo {
    create(answerComment: AnswerComment): Promise<AnswerComment>;

    save(answerComment: AnswerComment): Promise<AnswerComment>;

    findManyByAnswerId(answerId: string): Promise<AnswerComment[]>;

    deleteManyByAnswerId(answerId: string): Promise<void>;
}