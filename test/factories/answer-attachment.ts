import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachment";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export function makeAnswerattachment(
    override?: Partial<AnswerAttachmentProps>,
    id?: UniqueEntityID,
) {
    const answerAttachment = AnswerAttachment.create({
        title: faker.lorem.sentences(3),
        link: faker.system.filePath(),
        createdAt: new Date(),
        attachmentId: new UniqueEntityID(randomUUID()),
        answerId: new UniqueEntityID(randomUUID()),
        ...override,
    },
        id
    );

    return answerAttachment;
}