import { Either, rigth } from "@/core/errors/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepo } from "../repositories/notification-repo";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface SendNotificationRequest {
    recipientId: string;
    title: string;
    content: string;
}

export type SendNotificationResponse = Either<
    null,
    {
        notification: Notification,
    }
>;

export class SendNotificationService {
    constructor(
        private notificationRepo: NotificationRepo,
    ) { }

    async execute({
        recipientId,
        title,
        content,
    }: SendNotificationRequest): Promise<SendNotificationResponse> {
        const notification = Notification.create({
            recipientId: new UniqueEntityID(recipientId),
            title: title,
            content: content,
        });

        await this.notificationRepo.create(notification);

        return rigth({ notification });
    }
}