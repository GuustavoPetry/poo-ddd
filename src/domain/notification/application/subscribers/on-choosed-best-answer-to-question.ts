import { EventHandler } from "@/core/events/event-handler";
import { AnswerRepo } from "@/domain/forum/application/repositories/answer-repo";
import { SendNotificationService } from "../services/send-notification";
import { DomainEvents } from "@/core/events/DomainEvents";
import { ChoosedBestAnswerToQuestionEvent } from "@/domain/forum/enterprise/events/choosed-best-answer-to-question-event";

export class OnChoosedBestAnswerToQuestion implements EventHandler {
    constructor(
        private answerRepo: AnswerRepo,
        private sendNotification: SendNotificationService,
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendSetBestAnswerNotification.bind(this),
            ChoosedBestAnswerToQuestionEvent.name,
        );
    }

    private async sendSetBestAnswerNotification({ question }: ChoosedBestAnswerToQuestionEvent) {
        const answer = await this.answerRepo.findById(question.bestAnswerId!.toString());

        if (answer) {
            await this.sendNotification.execute({
                recipientId: answer.authorId.toString(),
                title: `Parábens! Você deu a melhor resposta`,
                content: `Sua resposta foi a melhor em '${question.title.substring(0, 40).concat("...")}'`
            });
        }
    }
}