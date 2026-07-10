import { QuestionAttachmentRepo } from "@/domain/forum/application/repositories/question-attachments-repo";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentRepo implements QuestionAttachmentRepo {
    public items: QuestionAttachment[] = [];

    async create(questionAttachments: QuestionAttachment[]): Promise<QuestionAttachment[]> {
        questionAttachments.forEach((a) => this.items.push(a));

        return questionAttachments;
    }

    async save(questionAttachment: QuestionAttachment): Promise<QuestionAttachment> {
        const itemIndex = this.items.findIndex((a) => a.equals(questionAttachment));

        this.items[itemIndex] = questionAttachment;

        return questionAttachment;
    }

    async delete(questionAttachments: QuestionAttachment[]): Promise<void> {
        questionAttachments.forEach((a) => {
            const itemIndex = this.items.findIndex((b) => a.equals(b));

            this.items.splice(itemIndex, 1);
        });
    }

    async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        return this.items.filter((a) => a.questionId.equals(questionId)) ?? null;
    }

    async deleteManyByQuestionId(questionId: string): Promise<void> {
        this.items = this.items.filter((a) => !a.questionId.equals(questionId));
    }
}