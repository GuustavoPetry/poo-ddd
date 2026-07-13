import { CreateAnswerCommentService } from "@/domain/forum/application/services/create-answer-comment";
import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment-repo";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment-repo";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { InMemoryNotificationRepo } from "@test/repositories/in-memory-notification-repo";
import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment-repo";
import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";
import { SendNotificationRequest, SendNotificationResponse, SendNotificationService } from "../services/send-notification";
import { OnChoosedBestAnswerToQuestion } from "./on-choosed-best-answer-to-question";
import { makeQuestion } from "@test/factories/make-question";
import { makeAnswer } from "@test/factories/make-answer";

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


describe("On Choosed Best Answer To Question Event", () => {
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

        new OnChoosedBestAnswerToQuestion(inMemoryAnswerRepo, sendNotification);
    });

    it("should be able to send notification when choose best answer to question", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepo.create(question);

        const answer = makeAnswer({ questionId: question.id });

        await inMemoryAnswerRepo.create(answer);

        question.bestAnswerId = answer.id;

        expect(question.domainEvents).toHaveLength(1);

        await inMemoryQuestionRepo.save(question);

        expect(question.domainEvents).toHaveLength(0);
        expect(sendNotificationSpyOn).toHaveBeenCalled();
        expect(inMemoryNotificationRepo.items).toHaveLength(1);
        expect(inMemoryNotificationRepo.items[0]?.recipientId).toEqual(answer.authorId);
    });
});