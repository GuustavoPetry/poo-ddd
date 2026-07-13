import { AnswerAttachmentRepo } from "@/domain/forum/application/repositories/answer-attachments-repo";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentRepo implements AnswerAttachmentRepo {
    public items: AnswerAttachment[] = [];

    async create(answerAttachments: AnswerAttachment[]): Promise<AnswerAttachment[]> {
        answerAttachments.forEach((a) => this.items.push(a));

        return answerAttachments;
    }

    async save(answerAttachment: AnswerAttachment): Promise<AnswerAttachment> {
        const itemIndex = this.items.findIndex((a) => a.equals(answerAttachment));

        this.items[itemIndex] = answerAttachment;

        return answerAttachment;
    }

    async delete(answerAttachments: AnswerAttachment[]): Promise<void> {
        answerAttachments.forEach((a) => {
            const itemIndex = this.items.findIndex((b) => a.equals(b));

            this.items.splice(itemIndex, 1);
        });
    }

    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        return this.items.filter((a) => a.answerId.equals(answerId));
    }

    async deleteManyByAnswerId(answerId: string): Promise<void> {
        this.items = this.items.filter((a) => !a.answerId.equals(answerId));
    }
}