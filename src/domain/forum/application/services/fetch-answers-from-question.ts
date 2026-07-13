import { Either, rigth } from "@/core/errors/either";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepo } from "../repositories/answer-repo";
import { PaginationParams } from "@/core/repositories/pagination-params";

interface FetchAnswersFromQuestionRequest {
    questionId: string;
    page: number;
}

type FetchAnswersFromQuestionResponse = Either<
    null,
    {
        answers: Answer[],
    }
>;

export class FetchAnswersFromQuestionService {
    constructor(
        private answerRepo: AnswerRepo,
    ) { }

    async execute({
        questionId,
        page,
    }: FetchAnswersFromQuestionRequest): Promise<FetchAnswersFromQuestionResponse> {
        const answers = await this.answerRepo.findManyByQuestionId(questionId, { page });

        return rigth({ answers });
    }
}