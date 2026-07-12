import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment";
import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { beforeEach, describe, expect, it } from "vitest";
import { makeQuestion } from "@test/factories/make-question";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment";
import { CreateAnswerToQuestionService } from "./create-answer-to-question";

let inMemoryQuestionAttachmentRepo: InMemoryQuestionAttachmentRepo;
let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryQuestionRepo: InMemoryQuestionRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let sut: CreateAnswerToQuestionService;

describe("Create Answer to Question Service", () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepo = new InMemoryQuestionAttachmentRepo();
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryQuestionRepo = new InMemoryQuestionRepo(inMemoryQuestionAttachmentRepo);
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);
        sut = new CreateAnswerToQuestionService(inMemoryAnswerRepo, inMemoryQuestionRepo);
    });

    it("should be able to create a answer to question", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepo.create(question);

        const result = await sut.execute({
            content: "new answer to question",
            attachmentIds: ["1", "2", "3"],
            authorId: "author-1",
            questionId: question.id.toString(),
        });

        expect(result.isRigth()).toBe(true);
        if (result.isRigth())
            expect(inMemoryAnswerRepo.items[0]).toEqual(result.value.answer);
        expect(inMemoryAnswerAttachmentRepo.items).toHaveLength(3);
    });
});