import { Entity } from "@/core/entities/entitiy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface AnswerCommentProps {
    comment: string;
    answerId: UniqueEntityID;
}

export class AnswerComment extends Entity<AnswerCommentProps> {
    get comment() {
        return this.props.comment;
    }

    get answerId() {
        return this.props.answerId;
    }

    static create(props: AnswerCommentProps, id?: UniqueEntityID) {
        const comment = new AnswerComment(props, id);

        return comment;
    }
}