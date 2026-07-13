import { DomainEvent } from "@/core/events/domain-event";
import { Answer } from "../entities/answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class AnswerCreatedEvent implements DomainEvent {
    private _ocurredAt: Date;
    private _answer: Answer;

    get ocurredAt() {
        return this._ocurredAt;
    }

    get answer() {
        return this._answer;
    }

    constructor(answer: Answer) {
        this._answer = answer;
        this._ocurredAt = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.answer.id;
    }
}