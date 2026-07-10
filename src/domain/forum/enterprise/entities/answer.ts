import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentsList } from "./answer-attachments-list";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Optional } from "@/core/types/optional";

export interface AnswerProps {
    content: string;
    attachments?: AnswerAttachmentsList;
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

    touch(): void {
        this.props.updatedAt = new Date();
    }

    static create(props: Optional<AnswerProps, "createdAt">, id?: UniqueEntityID) {
        const answer = new Answer({
            createdAt: new Date(),
            ...props,
        }, id);

        return answer;
    }
}