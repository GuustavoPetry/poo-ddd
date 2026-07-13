import { NotificationRepo } from "@/domain/notification/application/repositories/notification-repo";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationRepo implements NotificationRepo {
    public items: Notification[] = [];

    async create(notification: Notification): Promise<Notification> {
        this.items.push(notification);

        return notification;
    }

    async save(notification: Notification): Promise<Notification> {
        const itemIndex = this.items.findIndex((item) => item.equals(notification));

        this.items[itemIndex] = notification;

        return notification;
    }

    async findById(id: string): Promise<Notification | null> {
        const notification = this.items.find((item) => item.id.equals(id));

        return notification ?? null;
    }
}