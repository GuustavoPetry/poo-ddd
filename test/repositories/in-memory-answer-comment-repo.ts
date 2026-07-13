import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentRepo } from "@/domain/forum/application/repositories/answer-comments-repo";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";


export class InMemoryAnswerCommentRepo implements AnswerCommentRepo {
    public items: AnswerComment[] = [];

    async create(answerComment: AnswerComment): Promise<AnswerComment> {
        this.items.push(answerComment);

        return answerComment;
    }

    async save(answerComment: AnswerComment): Promise<AnswerComment> {
        const itemIndex = this.items.findIndex((a) => a.equals(answerComment));

        this.items[itemIndex] = answerComment;

        return answerComment;
    }

    async delete(answerComment: AnswerComment): Promise<void> {
        const itemIndex = this.items.findIndex((a) => a.equals(answerComment));

        this.items.splice(itemIndex, 1);
    }

    async findById(id: string): Promise<AnswerComment | null> {
        return this.items.find((answerComment) => answerComment.id.toString() === id) ?? null;
    }

    async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
        return this.items
            .filter((Comment) => Comment.answerId.equals(answerId))
            .slice((page - 1) * 20, page * 20);
    }

    async deleteManyByAnswerId(answerId: string): Promise<void> {
        this.items = this.items.filter((Comment) => !Comment.answerId.equals(answerId));
    }
}