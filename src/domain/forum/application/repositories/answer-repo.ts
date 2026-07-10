import { Answer } from "../../enterprise/entities/answer";

export interface AnswerRepo {
    create(answer: Answer): Promise<Answer>;

    save(answer: Answer): Promise<Answer>;

    findById(id: string): Promise<Answer | null>;

    delete(answer: Answer): Promise<void>;
}