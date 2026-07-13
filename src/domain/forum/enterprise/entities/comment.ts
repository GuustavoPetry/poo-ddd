import { Entity } from "@/core/entities/entitiy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CommentProps {
    content: string;
    createdAt: Date;
    udpatedAt?: Date;
    authorId: UniqueEntityID;
}

export abstract class Comment<Props extends CommentProps> extends Entity<Props> {
    get content() {
        return this.props.content;
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

    get excerpt() {
        return this.content.substring(0, 140).trimEnd().concat("...");
    }

    touch() {
        this.props.udpatedAt = new Date();
    }

    set content(content: string) {
        this.props.content = content;
        this.touch();
    }

}