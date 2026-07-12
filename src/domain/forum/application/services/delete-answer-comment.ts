import { Either, left, rigth } from "@/core/errors/either";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { AnswerCommentRepo } from "../repositories/answer-comments-repo";

interface DeleteAnswerCommentRequest {
    authorId: string;
    answerCommentId: string;
}

type DeleteAnswerCommentResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>;

export class DeleteAnswerCommentService {
    constructor(
        private answerCommentRepo: AnswerCommentRepo
    ) { }

    async execute({
        authorId,
        answerCommentId
    }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
        const answerComment = await this.answerCommentRepo.findById(answerCommentId);

        if (!answerComment) return left(new ResourceNotFoundError());

        if (authorId !== answerComment.authorId.toString()) return left(new NotAllowedError());

        await this.answerCommentRepo.delete(answerComment);

        return rigth({ answerComment });
    }
}
