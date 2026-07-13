import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { describe, expect, it, beforeEach } from "vitest";
import { CreateQuestionService } from "./create-question";
import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment-repo";

let inMemoryQuestionAttachmentRepo: InMemoryQuestionAttachmentRepo;
let inMemoryQuestionRepo: InMemoryQuestionRepo;
let sut: CreateQuestionService;

describe("Create Question Service", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepo = new InMemoryQuestionAttachmentRepo()
        inMemoryQuestionRepo = new InMemoryQuestionRepo(inMemoryQuestionAttachmentRepo);
        sut = new CreateQuestionService(inMemoryQuestionRepo);
    });

    it("should be able to create a question", async () => {
        const result = await sut.execute({
            title: "new question",
            content: "question content",
            attachmentIds: ["1", "2", "3"],
            authorId: "author-1"
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryQuestionRepo.items[0]).toEqual(result.value?.question);
        expect(inMemoryQuestionAttachmentRepo.items).toHaveLength(3);
    });
});