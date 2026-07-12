import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { beforeEach, describe, expect, it } from "vitest";
import { DeleteAnswerService } from "./delete-answer";
import { makeAnswer } from "@test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerAttachment } from "@test/factories/make-answer-attachment";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment";
import { makeAnswerComment } from "@test/factories/make-answer-comment";

let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let sut: DeleteAnswerService;

describe("Delete Answer Service", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);
        sut = new DeleteAnswerService(inMemoryAnswerRepo);
    });

    it("should be able to delete a answer and your attachments", async () => {
        const answer = makeAnswer();

        await inMemoryAnswerRepo.create(answer);

        inMemoryAnswerAttachmentRepo.items.push(
            makeAnswerAttachment({
                answerId: answer.id,
                attachmentId: new UniqueEntityID(),
            }),
            makeAnswerAttachment({
                answerId: answer.id,
                attachmentId: new UniqueEntityID(),
            }),
        );

        inMemoryAnswerCommentRepo.items.push(
            makeAnswerComment({
                answerId: answer.id,
            }),
            makeAnswerComment({
                answerId: answer.id,
            }),
        );

        expect(inMemoryAnswerRepo.items).toHaveLength(1);
        expect(inMemoryAnswerAttachmentRepo.items).toHaveLength(2);
        expect(inMemoryAnswerCommentRepo.items).toHaveLength(2);

        const result = await sut.execute({
            authorId: answer.authorId.toString(),
            answerId: answer.id.toString(),
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryAnswerRepo.items).toHaveLength(0);
        expect(inMemoryAnswerAttachmentRepo.items).toHaveLength(0);
        expect(inMemoryAnswerCommentRepo.items).toHaveLength(0);

    });
});