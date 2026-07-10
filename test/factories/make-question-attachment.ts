import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachment, QuestionAttachmentProps } from "@/domain/forum/enterprise/entities/question-attachment";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export function makeQuestionAttachment(
    override?: Partial<QuestionAttachmentProps>,
    id?: UniqueEntityID,
) {
    const questionattachment = QuestionAttachment.create({
        title: faker.lorem.sentences(3),
        link: faker.system.filePath(),
        createdAt: new Date(),
        attachmentId: new UniqueEntityID(randomUUID()),
        questionId: new UniqueEntityID(randomUUID()),
        ...override,
    },
        id
    );

    return questionattachment;
}