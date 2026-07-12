import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

export interface AnswerAttachmentRepo {
    create(answerAttachments: AnswerAttachment[]): Promise<AnswerAttachment[]>;

    save(answerAttachment: AnswerAttachment): Promise<AnswerAttachment>;

    delete(answerAttachments: AnswerAttachment[]): Promise<void>;

    findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;

    deleteManyByAnswerId(answerId: string): Promise<void>;
}