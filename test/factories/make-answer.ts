import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export function makeAnswer(
    override?: Partial<AnswerProps>,
    id?: UniqueEntityID,
) {
    const answer = Answer.create({
        content: faker.lorem.sentences(8),
        authorId: new UniqueEntityID(randomUUID()),
        questionId: new UniqueEntityID(randomUUID()),
        ...override,
    },
        id
    );

    return answer;
}