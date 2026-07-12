import { AnswerAttachmentRepo } from "@/domain/forum/application/repositories/answer-attachments-repo";
import { AnswerCommentRepo } from "@/domain/forum/application/repositories/answer-comments-repo";
import { AnswerRepo } from "@/domain/forum/application/repositories/answer-repo";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswerRepo implements AnswerRepo {
    public items: Answer[] = [];

    constructor(
        private answerAttachmentRepo: AnswerAttachmentRepo,
        private answerCommentRepo: AnswerCommentRepo
    ) { }

    async create(answer: Answer): Promise<Answer> {
        this.items.push(answer);

        await this.answerAttachmentRepo.create(answer.attachments.initial);

        return answer;
    }

    async save(answer: Answer): Promise<Answer> {
        const itemIndex = this.items.findIndex((a) => a.equals(answer));

        this.items[itemIndex] = answer;

        await this.answerAttachmentRepo.create(answer.attachments.new);
        await this.answerAttachmentRepo.delete(answer.attachments.removed);

        return answer;
    }

    async delete(answer: Answer): Promise<void> {
        const itemIndex = this.items.findIndex((a) => a.equals(answer));

        this.items.splice(itemIndex, 1);

        await this.answerAttachmentRepo.deleteManyByAnswerId(answer.id.toString());
        await this.answerCommentRepo.deleteManyByAnswerId(answer.id.toString());
    }

    async findById(id: string): Promise<Answer | null> {
        return this.items.find((answer) => answer.id.toString() === id) ?? null;
    }
}