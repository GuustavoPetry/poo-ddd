import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment-repo";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment-repo";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchAnswersFromQuestionService } from "./fetch-answers-from-question";
import { makeQuestion } from "@test/factories/make-question";
import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment-repo";
import { makeAnswer } from "@test/factories/make-answer";

let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;
let inMemoryQuestionAttachmentRepo: InMemoryQuestionAttachmentRepo;
let inMemoryQuestionRepo: InMemoryQuestionRepo;
let sut: FetchAnswersFromQuestionService;

describe("Fetch Answers From Question", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);
        inMemoryQuestionAttachmentRepo = new InMemoryQuestionAttachmentRepo();
        inMemoryQuestionRepo = new InMemoryQuestionRepo(inMemoryQuestionAttachmentRepo);
        sut = new FetchAnswersFromQuestionService(inMemoryAnswerRepo);
    });

    it("should be able to fetch answers from question", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepo.create(question);

        for (let i = 0; i < 25; i++) {
            const answer = makeAnswer({ questionId: question.id });

            inMemoryAnswerRepo.create(answer);
        }

        const result = await sut.execute({
            questionId: question.id.toString(),
            page: 1,
        });

        expect(result.isRigth()).toBe(true);
        expect(result.value?.answers).toHaveLength(20);
    });

    it("should be able to fetch answers from question with paginations params", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepo.create(question);

        for (let i = 0; i < 25; i++) {
            const answer = makeAnswer({ questionId: question.id });

            inMemoryAnswerRepo.create(answer);
        }

        const result = await sut.execute({
            questionId: question.id.toString(),
            page: 2,
        });

        expect(result.isRigth()).toBe(true);
        expect(result.value?.answers).toHaveLength(5);
    });
});