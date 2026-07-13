import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment-repo";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment-repo";
import { CreateAnswerCommentService } from "./create-answer-comment";
import { makeAnswer } from "@test/factories/make-answer";

let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let sut: CreateAnswerCommentService;

describe("Create Answer to Question Service", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);
        sut = new CreateAnswerCommentService(inMemoryAnswerRepo, inMemoryAnswerCommentRepo);
    });

    it("should be able to create a comment to answer", async () => {
        const answer = makeAnswer();

        await inMemoryAnswerRepo.create(answer);

        const result = await sut.execute({
            content: "new comment to answer",
            answerId: answer.id.toString(),
            authorId: "another-author",
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryAnswerCommentRepo.items).toHaveLength(1);
        if (result.isRigth())
            expect(inMemoryAnswerCommentRepo.items[0]).toEqual(result.value?.comment);
    });
});