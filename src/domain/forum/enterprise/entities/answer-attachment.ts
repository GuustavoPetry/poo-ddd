import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Entity } from "@/core/entities/entitiy";

export interface AnswerAttachmentProps {
    attachmentId: UniqueEntityID;
    answerId: UniqueEntityID;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
    get attachmentId() {
        return this.props.attachmentId;
    }

    get answerId() {
        return this.props.answerId;
    }

    static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
        const answerAttachment = new AnswerAttachment(props, id);

        return answerAttachment;
    }
}