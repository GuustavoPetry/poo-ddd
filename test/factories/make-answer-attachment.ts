import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachment";
import { randomUUID } from "node:crypto";

export function makeAnswerAttachment(
    override?: Partial<AnswerAttachmentProps>,
    id?: UniqueEntityID,
) {
    const answerAttachment = AnswerAttachment.create({
        attachmentId: new UniqueEntityID(randomUUID()),
        answerId: new UniqueEntityID(randomUUID()),
        ...override,
    },
        id
    );

    return answerAttachment;
}