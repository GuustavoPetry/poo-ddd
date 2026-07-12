import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment";
import { makeAnswer } from "@test/factories/make-answer";
import { EditAnswerService } from "./edit-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment";

let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let sut: EditAnswerService;

describe("Edit Answer Service", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo()
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);
        sut = new EditAnswerService(inMemoryAnswerRepo, inMemoryAnswerAttachmentRepo);
    });

    it("should be able to edit a answer", async () => {
        const answer = makeAnswer();

        inMemoryAnswerAttachmentRepo.items.push(
            new AnswerAttachment({
                attachmentId: new UniqueEntityID(),
                answerId: answer.id,
            }),
            new AnswerAttachment({
                attachmentId: new UniqueEntityID(),
                answerId: answer.id,
            }),
        )

        await inMemoryAnswerRepo.create(answer);

        expect(inMemoryAnswerAttachmentRepo.items).toHaveLength(2);

        const result = await sut.execute({
            content: "answer content",
            attachmentIds: ["1", "2", "3"],
            authorId: answer.authorId.toString(),
            answerId: answer.id.toString(),
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryAnswerRepo.items[0]).toMatchObject({
            content: "answer content"
        });
        expect(inMemoryAnswerAttachmentRepo.items).toHaveLength(3);
        expect(inMemoryAnswerAttachmentRepo.items).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
            expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
        ]);
    });
});