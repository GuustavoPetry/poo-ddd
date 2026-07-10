import { Either, rigth } from "@/core/errors/either";
import { QuestionRepo } from "../repositories/question-repo";
import { Question } from "../../enterprise/entities/question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentsList } from "../../enterprise/entities/question-attachments-list";

interface CreateQuestionRequest {
    title: string;
    content: string;
    attachmentIds: string[];
    authorId: string;
}

type CreateQuestionResponse = Either<
    null,
    {
        question: Question,
    }
>;

export class CreateQuestionService {
    constructor(private questionRepo: QuestionRepo) { }

    async execute({
        title,
        content,
        attachmentIds,
        authorId
    }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
        const question = Question.create({
            title,
            content,
            authorId: new UniqueEntityID(authorId),
        });

        const questionAttachments = attachmentIds.map((attachmentId) => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                questionId: question.id,
            });
        });

        const questionAttachmentList = new QuestionAttachmentsList(questionAttachments);

        question.attachments = questionAttachmentList;

        await this.questionRepo.create(question);

        return rigth({ question });
    }
}