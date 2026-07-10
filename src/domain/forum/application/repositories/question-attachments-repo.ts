import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

export interface QuestionAttachmentRepo {
    create(questionAttachments: QuestionAttachment[]): Promise<QuestionAttachment[]>;

    save(questionAttachment: QuestionAttachment): Promise<QuestionAttachment>;

    delete(questionAttachments: QuestionAttachment[]): Promise<void>;

    findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;

    deleteManyByQuestionId(questionId: string): Promise<void>;
}