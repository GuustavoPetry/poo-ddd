import { InMemoryNotificationRepo } from "@test/repositories/in-memory-notification-repo";
import { beforeEach, describe, expect, it } from "vitest";
import { ReadNotification } from "./read-notification";
import { makeNotification } from "@test/factories/make-notification";
import { NotAllowedError } from "@/core/errors/exceptions/not-allowed-error";

let inMemoryNotificationRepo: InMemoryNotificationRepo;
let sut: ReadNotification;

describe("Send Notification Service", () => {
    beforeEach(() => {
        inMemoryNotificationRepo = new InMemoryNotificationRepo();
        sut = new ReadNotification(inMemoryNotificationRepo);
    });

    it("should be able to read notification", async () => {
        const notification = makeNotification();

        await inMemoryNotificationRepo.create(notification);

        expect(inMemoryNotificationRepo.items[0]?.readAt).toEqual(undefined);

        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString(),
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryNotificationRepo.items[0]?.readAt).toEqual(expect.any(Date));
    });

    it("should not be able to read notification from another user", async () => {
        const notification = makeNotification();

        await inMemoryNotificationRepo.create(notification);

        const result = await sut.execute({
            recipientId: "another-user",
            notificationId: notification.id.toString(),
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});