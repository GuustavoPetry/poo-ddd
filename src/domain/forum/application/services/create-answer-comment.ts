import { Either, left, rigth } from "@/core/errors/either";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerRepo } from "../repositories/answer-repo";
import { AnswerCommentRepo } from "../repositories/answer-comments-repo";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerCommentCreatedEvent } from "../../enterprise/events/answer-comment-created-event";

interface CreateAnswerCommentRequest {
    content: string;
    answerId: string;
    authorId: string;
}

type CreateAnswerCommentResponse = Either<
    ResourceNotFoundError,
    {
        comment: AnswerComment,
    }
>;

export class CreateAnswerCommentService {
    constructor(
        private answerRepo: AnswerRepo,
        private answerCommentRepo: AnswerCommentRepo,
    ) { }

    async execute({
        content,
        answerId,
        authorId,
    }: CreateAnswerCommentRequest): Promise<CreateAnswerCommentResponse> {
        const answer = await this.answerRepo.findById(answerId);

        if (!answer) return left(new ResourceNotFoundError());

        const comment = AnswerComment.create({
            content,
            answerId: answer.id,
            authorId: new UniqueEntityID(authorId),
        });

        answer.addDomainEvent(new AnswerCommentCreatedEvent(comment, answer.authorId));

        await this.answerCommentRepo.create(comment);
        await this.answerRepo.save(answer);

        return rigth({ comment });
    }
}