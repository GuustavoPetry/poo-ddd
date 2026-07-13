import { DomainEvent } from "@/core/events/domain-event";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "../entities/question";

export class ChoosedBestAnswerToQuestionEvent implements DomainEvent {
    private _ocurredAt: Date;
    private _question: Question;

    get ocurredAt() {
        return this._ocurredAt;
    }

    get question() {
        return this._question;
    }

    constructor(question: Question) {
        this._question = question;
        this._ocurredAt = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.question.id;
    }
}