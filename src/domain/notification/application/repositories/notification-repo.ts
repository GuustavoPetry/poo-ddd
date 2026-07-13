import { Notification } from "../../enterprise/entities/notification";

export interface NotificationRepo {
    create(notification: Notification): Promise<Notification>;

    save(notification: Notification): Promise<Notification>;

    findById(id: string): Promise<Notification | null>;
}