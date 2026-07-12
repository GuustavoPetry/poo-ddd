import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment";
import { makeQuestion } from "@test/factories/make-question";
import { EditQuestionService } from "./edit-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";

let inMemoryQuestionAttachmentRepo: InMemoryQuestionAttachmentRepo;
let inMemoryQuestionRepo: InMemoryQuestionRepo;
let sut: EditQuestionService;

describe("Edit Question Service", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepo = new InMemoryQuestionAttachmentRepo()
        inMemoryQuestionRepo = new InMemoryQuestionRepo(inMemoryQuestionAttachmentRepo);
        sut = new EditQuestionService(inMemoryQuestionRepo, inMemoryQuestionAttachmentRepo);
    });

    it("should be able to edit a question", async () => {
        const question = makeQuestion();

        inMemoryQuestionAttachmentRepo.items.push(
            new QuestionAttachment({
                attachmentId: new UniqueEntityID(),
                questionId: question.id,
            }),
            new QuestionAttachment({
                attachmentId: new UniqueEntityID(),
                questionId: question.id,
            }),
        )

        await inMemoryQuestionRepo.create(question);

        expect(inMemoryQuestionAttachmentRepo.items).toHaveLength(2);

        const result = await sut.execute({
            title: "edit question",
            content: "question content",
            attachmentIds: ["1", "2", "3"],
            authorId: question.authorId.toString(),
            questionId: question.id.toString(),
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryQuestionRepo.items[0]).toMatchObject({
            title: "edit question",
            content: "question content"
        });
        expect(inMemoryQuestionAttachmentRepo.items).toHaveLength(3);
        expect(inMemoryQuestionAttachmentRepo.items).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
            expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
        ]);
    });
});