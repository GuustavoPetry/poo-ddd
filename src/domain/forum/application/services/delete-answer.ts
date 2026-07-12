import { Either, left, rigth } from "@/core/errors/either";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { AnswerRepo } from "../repositories/answer-repo";

interface DeleteAnswerRequest {
    authorId: string;
    answerId: string;
}

type DeleteAnswerResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>;

export class DeleteAnswerService {
    constructor(
        private answerRepo: AnswerRepo,
    ) { }

    async execute({
        authorId,
        answerId,
    }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
        const answer = await this.answerRepo.findById(answerId);

        if (!answer) return left(new ResourceNotFoundError());

        if (authorId !== answer.authorId.toString()) return left(new NotAllowedError());

        await this.answerRepo.delete(answer);

        return rigth({});
    }
}