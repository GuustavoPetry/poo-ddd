import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment-repo";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment-repo";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { InMemoryNotificationRepo } from "@test/repositories/in-memory-notification-repo";
import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment-repo";
import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";
import { SendNotificationRequest, SendNotificationResponse, SendNotificationService } from "../services/send-notification";
import { OnAnswerCommentCreated } from "./on-answer-comment-created";
import { makeQuestion } from "@test/factories/make-question";
import { makeAnswer } from "@test/factories/make-answer";
import { makeAnswerComment } from "@test/factories/make-answer-comment";
import { CreateAnswerCommentService } from "@/domain/forum/application/services/create-answer-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryQuestionAttachmentRepo: InMemoryQuestionAttachmentRepo;
let inMemoryQuestionRepo: InMemoryQuestionRepo;
let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let inMemoryNotificationRepo: InMemoryNotificationRepo;

let createAnswerComment: CreateAnswerCommentService;
let sendNotification: SendNotificationService;
let sendNotificationSpyOn: MockInstance<
    (request: SendNotificationRequest) => Promise<SendNotificationResponse>
>;

describe("On Answer Comment Created Event", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepo = new InMemoryQuestionAttachmentRepo();
        inMemoryQuestionRepo = new InMemoryQuestionRepo(inMemoryQuestionAttachmentRepo);

        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);

        inMemoryNotificationRepo = new InMemoryNotificationRepo();

        createAnswerComment = new CreateAnswerCommentService(inMemoryAnswerRepo, inMemoryAnswerCommentRepo);
        sendNotification = new SendNotificationService(inMemoryNotificationRepo);
        sendNotificationSpyOn = vi.spyOn(sendNotification, "execute");

        new OnAnswerCommentCreated(sendNotification);
    });

    it("should be able to send notification when answer comment created", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepo.create(question);

        const answer = makeAnswer({ questionId: question.id });

        await inMemoryAnswerRepo.create(answer);

        await createAnswerComment.execute({
            authorId: "author-1",
            answerId: answer.id.toString(),
            content: "comment content"
        });

        expect(answer.domainEvents).toHaveLength(0);
        expect(sendNotificationSpyOn).toHaveBeenCalled();
        expect(inMemoryNotificationRepo.items).toHaveLength(1);
        expect(inMemoryNotificationRepo.items[0]?.recipientId).toEqual(answer.authorId);
    });
})