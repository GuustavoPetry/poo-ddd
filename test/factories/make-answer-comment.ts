import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment, AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export function makeAnswerComment(
    override?: Partial<AnswerCommentProps>,
    id?: UniqueEntityID,
) {
    const answercomment = AnswerComment.create({
        comment: faker.lorem.sentences(8),
        answerId: new UniqueEntityID(randomUUID()),
        authorId: new UniqueEntityID(randomUUID()),
        createdAt: new Date(),
        ...override,
    },
        id
    );

    return answercomment;
}