import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Entity } from "@/core/entities/entitiy";

export interface QuestionAttachmentProps {
    attachmentId: UniqueEntityID,
    questionId: UniqueEntityID,
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
    get attachmentId() {
        return this.props.attachmentId;
    }

    get questionId() {
        return this.props.questionId;
    }

    static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
        const questionAttachment = new QuestionAttachment(props, id);

        return questionAttachment;
    }
}