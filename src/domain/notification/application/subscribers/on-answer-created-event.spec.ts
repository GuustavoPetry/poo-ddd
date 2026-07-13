import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment-repo";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment-repo";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { InMemoryNotificationRepo } from "@test/repositories/in-memory-notification-repo";
import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment-repo";
import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";
import { OnAnswerCreatedEvent } from "./on-answer-created-event";
import { SendNotificationRequest, SendNotificationResponse, SendNotificationService } from "../services/send-notification";
import { makeQuestion } from "@test/factories/make-question";
import { makeAnswer } from "@test/factories/make-answer";
import { waitFor } from "@test/utils/wait-for";

let inMemoryQuestionAttachmentRepo: InMemoryQuestionAttachmentRepo;
let inMemoryQuestionRepo: InMemoryQuestionRepo;
let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let inMemoryNotificationRepo: InMemoryNotificationRepo;
let sendNotification: SendNotificationService;

let sendNotificationExecuteSpy: MockInstance<
    (request: SendNotificationRequest) => Promise<SendNotificationResponse>
>;

describe("On Answer Created Event", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepo = new InMemoryQuestionAttachmentRepo();
        inMemoryQuestionRepo = new InMemoryQuestionRepo(inMemoryQuestionAttachmentRepo);
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);
        inMemoryNotificationRepo = new InMemoryNotificationRepo();
        sendNotification = new SendNotificationService(inMemoryNotificationRepo)

        sendNotificationExecuteSpy = vi.spyOn(sendNotification, "execute");
        new OnAnswerCreatedEvent(inMemoryQuestionRepo, sendNotification);
    });

    it("should be able to send a notification when created answer", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepo.create(question);

        const answer = makeAnswer({
            questionId: question.id,
        });

        expect(answer.domainEvents).toHaveLength(1);

        await inMemoryAnswerRepo.create(answer);

        waitFor(() => {
            expect(answer.domainEvents).toHaveLength(0);
            expect(sendNotificationExecuteSpy).toHaveBeenCalled();
            expect(inMemoryNotificationRepo.items).toHaveLength(1);
            expect(inMemoryNotificationRepo.items[0]?.recipientId).toEqual(question.authorId);
        });
    });
});