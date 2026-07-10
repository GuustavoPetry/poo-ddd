import { AnswerCommentRepo } from "@/domain/forum/application/repositories/answer-comments-repo";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";


export class InMemoryAnswerCommentRepo implements AnswerCommentRepo {
    public items: AnswerComment[] = [];

    async create(answercomment: AnswerComment): Promise<AnswerComment> {
        this.items.push(answercomment);

        return answercomment;
    }

    async save(answercomment: AnswerComment): Promise<AnswerComment> {
        const itemIndex = this.items.findIndex((a) => a.equals(answercomment));

        this.items[itemIndex] = answercomment;

        return answercomment;
    }

    async delete(answercomment: AnswerComment): Promise<void> {
        const itemIndex = this.items.findIndex((a) => a.equals(answercomment));

        this.items.splice(itemIndex, 1);
    }

    async findById(id: string): Promise<AnswerComment | null> {
        return this.items.find((answercomment) => answercomment.id.toString() === id) ?? null;
    }

    async findManyByAnswerId(answerId: string): Promise<AnswerComment[]> {
        return this.items.filter((comment) => comment.answerId.equals(answerId)) ?? null;
    }

    async deleteManyByAnswerId(answerId: string): Promise<void> {
        this.items = this.items.filter((comment) => !comment.answerId.equals(answerId));
    }
}