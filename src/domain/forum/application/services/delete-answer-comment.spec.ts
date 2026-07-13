import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment-repo";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { beforeEach, describe, expect, it } from "vitest";
import { makeAnswer } from "@test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerAttachment } from "@test/factories/make-answer-attachment";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment-repo";
import { makeAnswerComment } from "@test/factories/make-answer-comment";
import { DeleteAnswerCommentService } from "./delete-answer-comment";

let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let sut: DeleteAnswerCommentService;

describe("Delete Answer Service", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);
        sut = new DeleteAnswerCommentService(inMemoryAnswerCommentRepo);
    });

    it("should be able to delete a answer and your attachments", async () => {
        const answer = makeAnswer();

        await inMemoryAnswerRepo.create(answer);

        const comment = makeAnswerComment({ answerId: answer.id });

        await inMemoryAnswerCommentRepo.create(comment);

        expect(inMemoryAnswerCommentRepo.items).toHaveLength(1);

        const result = await sut.execute({
            authorId: comment.authorId.toString(),
            answerCommentId: comment.id.toString(),
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryAnswerCommentRepo.items).toHaveLength(0);
    });
});