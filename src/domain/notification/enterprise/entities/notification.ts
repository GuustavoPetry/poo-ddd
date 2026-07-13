import { Entity } from "@/core/entities/entitiy";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface NotificationProps {
    recipientId: UniqueEntityID;
    title: string;
    content: string;
    readAt?: Date;
}

export class Notification extends Entity<NotificationProps> {
    get recipientId() {
        return this.props.recipientId;
    }

    get title() {
        return this.props.title;
    }

    get content() {
        return this.props.content;
    }

    get readAt() {
        return this.props.readAt;
    }

    read() {
        this.props.readAt = new Date();
    }

    static create(props: NotificationProps, id?: UniqueEntityID) {
        const notification = new Notification(props, id);

        return notification;
    }
}