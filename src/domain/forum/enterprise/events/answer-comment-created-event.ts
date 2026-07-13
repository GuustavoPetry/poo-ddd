import { DomainEvent } from "@/core/events/domain-event";
import { AnswerComment } from "../entities/answer-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class AnswerCommentCreatedEvent implements DomainEvent {
    private _ocurredAt: Date;
    private _answerComment: AnswerComment;
    private _recipientId: UniqueEntityID;

    get ocurredAt() {
        return this._ocurredAt;
    }

    get answerComment() {
        return this._answerComment;
    }

    get recipientId() {
        return this._recipientId;
    }

    constructor(
        answerComment: AnswerComment,
        recipientId: UniqueEntityID
    ) {
        this._answerComment = answerComment;
        this._recipientId = recipientId;
        this._ocurredAt = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this._answerComment.answerId;
    }
}