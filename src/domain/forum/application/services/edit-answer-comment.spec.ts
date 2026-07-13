import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment-repo";
import { makeAnswer } from "@test/factories/make-answer";
import { EditAnswerService } from "./edit-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment-repo";
import { makeAnswerComment } from "@test/factories/make-answer-comment";
import { EditAnswerCommentService } from "./edit-answer-comment";
import { AnswerComment } from "../../enterprise/entities/answer-comment";

let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let sut: EditAnswerCommentService;

describe("Edit Answer Service", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);
        sut = new EditAnswerCommentService(inMemoryAnswerCommentRepo);
    });

    it("should be able to edit a answer", async () => {
        const answer = makeAnswer();

        await inMemoryAnswerRepo.create(answer);

        const comment = makeAnswerComment({ answerId: answer.id });

        await inMemoryAnswerCommentRepo.create(comment);

        const result = await sut.execute({
            authorId: comment.authorId.toString(),
            answerCommentId: comment.id.toString(),
            content: "edit comment",
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryAnswerCommentRepo.items).toHaveLength(1);
        expect(inMemoryAnswerCommentRepo.items[0]).toMatchObject({
            content: "edit comment"
        });
    });
});