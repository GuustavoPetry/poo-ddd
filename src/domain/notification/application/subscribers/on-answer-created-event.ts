import { EventHandler } from "@/core/events/event-handler";
import { QuestionRepo } from "@/domain/forum/application/repositories/question-repo";
import { SendNotificationService } from "../services/send-notification";
import { DomainEvents } from "@/core/events/DomainEvents";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";

export class OnAnswerCreatedEvent implements EventHandler {
    constructor(
        private questionRepo: QuestionRepo,
        private sendNotification: SendNotificationService,
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewAnswerNotification.bind(this),
            OnAnswerCreatedEvent.name,
        );
    }

    private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
        const question = await this.questionRepo.findById(answer.questionId.toString());

        if (question) {
            await this.sendNotification.execute({
                recipientId: question.authorId.toString(),
                title: `Nova resposta em "${question.title.substring(0, 40).concat("...")}"`,
                content: answer.excerpt,
            });
        }
    }
}