import { Either, left, rigth } from "@/core/errors/either";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepo } from "../repositories/answer-repo";
import { QuestionRepo } from "../repositories/question-repo";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentsList } from "../../enterprise/entities/answer-attachments-list";

interface CreateAnswerToQuestionRequest {
    content: string;
    attachmentIds: string[];
    questionId: string;
    authorId: string;
}

type CreateAnswerToQuestionResponse = Either<
    ResourceNotFoundError,
    {
        answer: Answer,
    }
>;

export class CreateAnswerToQuestionService {
    constructor(
        private answerRepo: AnswerRepo,
        private questionRepo: QuestionRepo,
    ) { }

    async execute({
        content,
        attachmentIds,
        questionId,
        authorId,
    }: CreateAnswerToQuestionRequest): Promise<CreateAnswerToQuestionResponse> {
        const question = await this.questionRepo.findById(questionId);

        if (!question) return left(new ResourceNotFoundError());

        const answer = Answer.create({
            content,
            questionId: new UniqueEntityID(questionId),
            authorId: new UniqueEntityID(authorId),
        });

        const answerAttachments = attachmentIds.map((attachmentId) => {
            return new AnswerAttachment({
                attachmentId: new UniqueEntityID(attachmentId),
                answerId: answer.id,
            });
        });

        const answerAttachmentList = new AnswerAttachmentsList(answerAttachments);

        answer.attachments = answerAttachmentList;

        await this.answerRepo.create(answer);

        return rigth({ answer });

    }
}