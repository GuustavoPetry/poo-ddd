import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question, QuestionProps } from "@/domain/forum/enterprise/entities/question";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export function makeQuestion(
    override?: Partial<QuestionProps>,
    id?: UniqueEntityID,
) {
    const question = Question.create({
        title: faker.lorem.sentence(3),
        content: faker.lorem.sentences(8),
        authorId: new UniqueEntityID(randomUUID()),
        ...override,
    },
        id
    );

    return question;
}