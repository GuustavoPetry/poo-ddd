import { Either, left, rigth } from "@/core/errors/either";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { Answer } from "../../enterprise/entities/answer";
import { QuestionRepo } from "../repositories/question-repo";
import { AnswerRepo } from "../repositories/answer-repo";

interface ChooseBestAnswerToQuestionRequest {
    questionId: string;
    answerId: string;
    authorId: string;
}

type ChooseBestAnswerToQuestionResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        bestAnswer: Answer,
    }
>;

export class ChooseBestAnswerToQuestionService {
    constructor(
        private questionRepo: QuestionRepo,
        private answerRepo: AnswerRepo,
    ) { }

    async execute({
        questionId,
        answerId,
        authorId,
    }: ChooseBestAnswerToQuestionRequest): Promise<ChooseBestAnswerToQuestionResponse> {
        const question = await this.questionRepo.findById(questionId);

        const answer = await this.answerRepo.findById(answerId);

        if (!question || !answer) return left(new ResourceNotFoundError());

        if (questionId !== answer.questionId.toString()) return left(new NotAllowedError());

        if (authorId !== question.authorId.toString()) return left(new NotAllowedError());

        question.bestAnswerId = answer.id;

        await this.questionRepo.save(question);

        return rigth({
            bestAnswer: answer
        });
    }
}