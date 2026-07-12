import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAnswerRepo } from "@test/repositories/in-memory-answer-repo";
import { InMemoryAnswerAttachmentRepo } from "@test/repositories/in-memory-answer-attachment";
import { InMemoryAnswerCommentRepo } from "@test/repositories/in-memory-answer-comment";
import { InMemoryQuestionAttachmentRepo } from "@test/repositories/in-memory-question-attachment";
import { InMemoryQuestionRepo } from "@test/repositories/in-memory-question-repo";
import { ChooseBestAnswerToQuestionService } from "./choose-best-answer-to-question";
import { makeAnswer } from "@test/factories/make-answer";
import { makeQuestion } from "@test/factories/make-question";

let inMemoryAnswerAttachmentRepo: InMemoryAnswerAttachmentRepo;
let inMemoryAnswerCommentRepo: InMemoryAnswerCommentRepo;
let inMemoryAnswerRepo: InMemoryAnswerRepo;

let inMemoryQuestionAttachmentRepo: InMemoryQuestionAttachmentRepo;
let inMemoryQuestionRepo: InMemoryQuestionRepo;

let sut: ChooseBestAnswerToQuestionService;

describe("Choose Best Answer to Question", () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentRepo = new InMemoryAnswerAttachmentRepo();
        inMemoryAnswerCommentRepo = new InMemoryAnswerCommentRepo();
        inMemoryAnswerRepo = new InMemoryAnswerRepo(inMemoryAnswerAttachmentRepo, inMemoryAnswerCommentRepo);

        inMemoryQuestionAttachmentRepo = new InMemoryQuestionAttachmentRepo();
        inMemoryQuestionRepo = new InMemoryQuestionRepo(inMemoryQuestionAttachmentRepo)

        sut = new ChooseBestAnswerToQuestionService(inMemoryQuestionRepo, inMemoryAnswerRepo);
    });

    it("should be able to choose best answer to question", async () => {
        const question = makeQuestion();

        await inMemoryQuestionRepo.create(question);

        const answer = makeAnswer({
            questionId: question.id
        });

        await inMemoryAnswerRepo.create(answer);

        const result = await sut.execute({
            answerId: answer.id.toString(),
            questionId: question.id.toString(),
            authorId: question.authorId.toString(),
        });

        expect(result.isRigth()).toBe(true);
        expect(inMemoryQuestionRepo.items[0]?.bestAnswerId).toEqual(answer.id);
    });
});