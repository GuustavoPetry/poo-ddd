import { Entity } from "@/core/entities/entitiy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface QuestionAttachmentsProps {
    attachmentId: UniqueEntityID,
    questionId: UniqueEntityID,
}

export class QuestionAttachment extends Entity<QuestionAttachmentsProps> {
    get attachmentId() {
        return this.props.attachmentId;
    }

    get questionId() {
        return this.props.questionId;
    }

    static create(props: QuestionAttachmentsProps, id?: UniqueEntityID) {
        const questionAttachment = new QuestionAttachment(props, id);

        return questionAttachment;
    }
}