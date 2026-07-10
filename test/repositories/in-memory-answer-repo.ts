import { AnswerRepo } from "@/domain/forum/application/repositories/answer-repo";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswerRepo implements AnswerRepo {
    public items: Answer[] = [];

    async create(answer: Answer): Promise<Answer> {
        this.items.push(answer);

        return answer;
    }

    async save(answer: Answer): Promise<Answer> {
        const itemIndex = this.items.findIndex((a) => a.equals(answer));

        this.items[itemIndex] = answer;

        return answer;
    }

    async delete(answer: Answer): Promise<void> {
        const itemIndex = this.items.findIndex((a) => a.equals(answer));

        this.items.splice(itemIndex, 1);
    }

    async findById(id: string): Promise<Answer | null> {
        return this.items.find((answer) => answer.id.toString() === id) ?? null;
    }
}