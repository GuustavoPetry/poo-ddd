import { Entity } from "@/core/entities/entitiy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CommentProps {
    comment: string;
    createdAt: Date;
    udpatedAt?: Date;
    authorId: UniqueEntityID;
}

export abstract class Comment<Props extends CommentProps> extends Entity<Props> {
    get comment() {
        return this.props.comment
    }

    get authorId() {
        return this.props.authorId;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.udpatedAt;
    }

    touch() {
        this.props.udpatedAt = new Date();
    }

}