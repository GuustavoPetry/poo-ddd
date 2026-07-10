import { Either, left, rigth } from "@/core/errors/either";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { Question } from "../../enterprise/entities/question";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";
import { QuestionRepo } from "../repositories/question-repo";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachmentsList } from "../../enterprise/entities/question-attachments-list";
import { QuestionAttachmentRepo } from "../repositories/question-attachments-repo";

interface EditQuestionRequest {
    questionId: string;
    authorId: string;
    title?: string;
    content?: string;
    attachmentIds?: string[];
}

type EditQuestionResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        question: Question,
    }
>;

export class EditQuestionService {
    constructor(
        private questionRepo: QuestionRepo,
        private questionAttachmentRepo: QuestionAttachmentRepo,
    ) { }

    async execute({
        questionId,
        authorId,
        title,
        content,
        attachmentIds
    }: EditQuestionRequest): Promise<EditQuestionResponse> {
        const question = await this.questionRepo.findById(questionId);

        if (!question) return left(new ResourceNotFoundError());

        if (authorId !== question.authorId.toString()) return left(new NotAllowedError());

        if (attachmentIds) {
            const currentAttachments = await this.questionAttachmentRepo.findManyByQuestionId(question.id.toString());

            const attachmentList = new QuestionAttachmentsList(currentAttachments);

            const newAttachments = attachmentIds.map((attachmentId) => {
                return new QuestionAttachment({
                    attachmentId: new UniqueEntityID(attachmentId),
                    questionId: question.id,
                });
            });

            attachmentList.update(newAttachments);

            question.attachments = attachmentList;
        }

        question.title = title ?? question.title;
        question.content = content ?? question.content;

        await this.questionRepo.save(question);

        return rigth({ question });
    }
}