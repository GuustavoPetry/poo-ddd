import { QuestionAttachmentRepo } from "@/domain/forum/application/repositories/question-attachments-repo";
import { QuestionRepo } from "@/domain/forum/application/repositories/question-repo";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionRepo implements QuestionRepo {
    public items: Question[] = [];

    constructor(private questionAttachmentRepo: QuestionAttachmentRepo) { }

    async create(question: Question): Promise<Question> {
        this.items.push(question);

        await this.questionAttachmentRepo.create(question.attachments.initial);

        return question;
    }

    async save(question: Question): Promise<Question> {
        const itemIndex = this.items.findIndex((a) => a.equals(question));

        this.items[itemIndex] = question;

        await this.questionAttachmentRepo.create(question.attachments.new);
        await this.questionAttachmentRepo.delete(question.attachments.removed);

        return question;
    }

    async delete(question: Question): Promise<void> {
        const itemIndex = this.items.findIndex((a) => a.equals(question));

        this.items.splice(itemIndex, 1);

        await this.questionAttachmentRepo.deleteManyByQuestionId(question.id.toString());
    }

    async findById(id: string): Promise<Question | null> {
        return this.items.find((question) => question.id.toString() === id) ?? null;
    }
}