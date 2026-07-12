import { Either, left, rigth } from "@/core/errors/either";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepo } from "../repositories/answer-repo";
import { AnswerAttachmentRepo } from "../repositories/answer-attachments-repo";
import { AnswerAttachmentsList } from "../../enterprise/entities/answer-attachments-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditAnswerRequest {
    authorId: string;
    answerId: string;
    content?: string;
    attachmentIds?: string[];
}

type EditAnswerResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        answer: Answer,
    }
>;

export class EditAnswerService {
    constructor(
        private answerRepo: AnswerRepo,
        private answerAttachmentRepo: AnswerAttachmentRepo,
    ) { }

    async execute({
        authorId,
        answerId,
        content,
        attachmentIds
    }: EditAnswerRequest): Promise<EditAnswerResponse> {
        const answer = await this.answerRepo.findById(answerId);

        if (!answer) return left(new ResourceNotFoundError());

        if (authorId !== answer.authorId.toString()) return left(new NotAllowedError());

        if (attachmentIds) {
            const currentAttachments = await this.answerAttachmentRepo.findManyByAnswerId(answerId);

            const attachmentList = new AnswerAttachmentsList(currentAttachments)

            const newAttachments = attachmentIds.map((attachmentId) => {
                return AnswerAttachment.create({
                    attachmentId: new UniqueEntityID(attachmentId),
                    answerId: answer.id,
                });
            });

            attachmentList.update(newAttachments);

            answer.attachments = attachmentList;
        }

        answer.content = content ?? answer.content;

        await this.answerRepo.save(answer);

        return rigth({ answer });
    }
}

