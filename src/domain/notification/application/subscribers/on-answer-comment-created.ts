import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationService } from "../services/send-notification";
import { DomainEvents } from "@/core/events/DomainEvents";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-comment-created-event";

export class OnAnswerCommentCreated implements EventHandler {
    constructor(
        private sendNotification: SendNotificationService,
    ) {
        this.setupSubscriptions();
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewAnswerCommentNotification.bind(this),
            AnswerCommentCreatedEvent.name,
        );
    }

    private async sendNewAnswerCommentNotification({ answerComment, recipientId }: AnswerCommentCreatedEvent) {
        await this.sendNotification.execute({
            recipientId: recipientId.toString(),
            title: `Nova comentário na sua resposta`,
            content: answerComment.excerpt,
        });
    }


}