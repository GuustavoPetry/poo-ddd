import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentsList } from "./answer-attachments-list";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Optional } from "@/core/types/optional";
import { AnswerCreatedEvent } from "../events/answer-created-event";

export interface AnswerProps {
    content: string;
    attachments: AnswerAttachmentsList;
    createdAt: Date;
    updatedAt?: Date;
    authorId: UniqueEntityID;
    questionId: UniqueEntityID;
}

export class Answer extends AggregateRoot<AnswerProps> {
    get content() {
        return this.props.content;
    }

    get attachments() {
        return this.props.attachments;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    get authorId() {
        return this.props.authorId;
    }

    get questionId() {
        return this.props.questionId;
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat("...");
    }

    touch(): void {
        this.props.updatedAt = new Date();
    }

    set content(content: string) {
        this.props.content = content;
    }

    set attachments(attachments: AnswerAttachmentsList) {
        this.props.attachments = attachments;
    }

    static create(props: Optional<AnswerProps, "createdAt" | "attachments">, id?: UniqueEntityID) {
        const answer = new Answer({
            createdAt: new Date(),
            attachments: props.attachments ?? new AnswerAttachmentsList(),
            ...props,
        }, id);

        const isNewAnswer = !id;

        if (isNewAnswer) {
            answer.addDomainEvent(new AnswerCreatedEvent(answer));
        }

        return answer;
    }
}