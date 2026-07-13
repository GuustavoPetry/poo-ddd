import { Either, left, rigth } from "@/core/errors/either";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/exceptions/resource-not-found-error";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepo } from "../repositories/notification-repo";

interface ReadNotificationRequest {
    recipientId: string;
    notificationId: string;
}

type ReadNotificationResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        notification: Notification,
    }
>;

export class ReadNotification {
    constructor(
        private notificationRepo: NotificationRepo,
    ) { }

    async execute({
        recipientId,
        notificationId,
    }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
        const notification = await this.notificationRepo.findById(notificationId);

        if (!notification) return left(new ResourceNotFoundError());

        if (recipientId !== notification.recipientId.toString()) return left(new NotAllowedError());

        notification.read();

        await this.notificationRepo.save(notification);

        return rigth({ notification });
    }
}