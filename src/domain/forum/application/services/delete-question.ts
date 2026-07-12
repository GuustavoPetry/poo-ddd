import { Either, left, rigth } from "@/core/errors/either";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { QuestionRepo } from "../repositories/question-repo";

interface DeleteQuestionRequest {
    authorId: string;
    questionId: string;
}

type DeleteQuestionResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>;

export class DeleteQuestionService {
    constructor(
        private questionRepo: QuestionRepo
    ) { }

    async execute({
        authorId,
        questionId,
    }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
        const question = await this.questionRepo.findById(questionId);

        if (!question) return left(new ResourceNotFoundError());

        if (authorId !== question.authorId.toString()) return left(new NotAllowedError());

        await this.questionRepo.delete(question);

        return rigth({});
    }
}