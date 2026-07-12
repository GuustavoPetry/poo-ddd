import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment";
import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { beforeEach, describe, expect, it } from "vitest";
import { DeleteQuestionService } from "./delete-question";
import { makeQuestion } from "@test/factories/make-question";
import { makeQuestionAttachment } from "@test/factories/make-question-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryQuestionAttachmentRepo: InMemoryQuestionAttachmentRepo;
let inMemoryQuestionRepo: InMemoryQuestionRepo;
let sut: DeleteQuestionService;

describe("Delete Question Service", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepo = new InMemoryQuestionAttachmentRepo();
        inMemoryQuestionRepo = new InMemoryQuestionRepo(inMemoryQuestionAttachmentRepo);
        sut = new DeleteQuestionService(inMemoryQuestionRepo);
    });

    it("should be able to delete a question and your attachments", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepo.create(question);

        inMemoryQuestionAttachmentRepo.items.push(
            makeQuestionAttachment({
                questionId: question.id,
                attachmentId: new UniqueEntityID(),
            }),
            makeQuestionAttachment({
                questionId: question.id,
                attachmentId: new UniqueEntityID(),
            }),
        );

        expect(inMemoryQuestionRepo.items).toHaveLength(1);
        expect(inMemoryQuestionAttachmentRepo.items).toHaveLength(2);

        const result = await sut.execute({
            authorId: question.authorId.toString(),
            questionId: question.id.toString(),
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryQuestionRepo.items).toHaveLength(0);
        expect(inMemoryQuestionAttachmentRepo.items).toHaveLength(0);
    });
});