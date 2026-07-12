import { Either, left, rigth } from "@/core/errors/either";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepo } from "../repositories/answer-comments-repo";

interface EditAnswerCommentRequest {
    authorId: string;
    answerCommentId: string;
    content?: string
}

type EditAnswerCommentResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        answerComment: AnswerComment,
    }
>;

export class EditAnswerCommentService {
    constructor(
        private answerCommentRepo: AnswerCommentRepo,
    ) { }

    async execute({
        authorId,
        answerCommentId,
        content,
    }: EditAnswerCommentRequest): Promise<EditAnswerCommentResponse> {
        const answerComment = await this.answerCommentRepo.findById(answerCommentId);

        if (!answerComment) return left(new ResourceNotFoundError());

        if (authorId !== answerComment.authorId.toString()) return left(new NotAllowedError());

        if (
            content !== null &&
            content !== undefined &&
            content !== ""
        ) {
            answerComment.content = content;
        }

        return rigth({ answerComment });
    }
}