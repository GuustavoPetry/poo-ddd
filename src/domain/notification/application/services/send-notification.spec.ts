import { InMemoryNotificationRepo } from "@test/repositories/in-memory-notification-repo";
import { beforeEach, describe, expect, it } from "vitest";
import { SendNotificationService } from "./send-notification";

let inMemoryNotificationRepo: InMemoryNotificationRepo;
let sut: SendNotificationService;

describe("Send Notification Service", () => {
    beforeEach(() => {
        inMemoryNotificationRepo = new InMemoryNotificationRepo();
        sut = new SendNotificationService(inMemoryNotificationRepo);
    });

    it("should be able to send notification", async () => {
        const result = await sut.execute({
            recipientId: "recipient-1",
            title: "new notification",
            content: "notification content",
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryNotificationRepo.items).toHaveLength(1);
        expect(inMemoryNotificationRepo.items[0]).toEqual(result.value?.notification);
    });
});