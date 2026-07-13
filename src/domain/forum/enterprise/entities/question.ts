import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Slug } from "./value-objects/slug";
import { QuestionAttachmentsList } from "./question-attachments-list";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Optional } from "@/core/types/optional";
import { ChoosedBestAnswerToQuestionEvent } from "../events/choosed-best-answer-to-question-event";

export interface QuestionProps {
    title: string;
    content: string;
    attachments: QuestionAttachmentsList;
    slug: Slug;
    createdAt: Date;
    updatedAt?: Date;
    bestAnswerId?: UniqueEntityID | undefined;
    authorId: UniqueEntityID;
}

export class Question extends AggregateRoot<QuestionProps> {
    get title() {
        return this.props.title;
    }

    get content() {
        return this.props.content;
    }

    get attachments() {
        return this.props.attachments;
    }

    get slug() {
        return this.props.slug;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    get bestAnswerId() {
        return this.props.bestAnswerId;
    }

    get authorId() {
        return this.props.authorId;
    }

    touch(): void {
        this.props.updatedAt = new Date();
    }

    set title(title: string) {
        this.props.title = title;
    }

    set content(content: string) {
        this.props.content = content;
    }

    set attachments(attachments: QuestionAttachmentsList) {
        this.props.attachments = attachments;
    }

    set slug(value: Slug) {
        this.props.slug = value;
    }

    set bestAnswerId(answerId: UniqueEntityID | undefined) {
        this.props.bestAnswerId = answerId;

        this.addDomainEvent(new ChoosedBestAnswerToQuestionEvent(this));
    }

    static create(
        props: Optional<QuestionProps, "createdAt" | "attachments" | "slug">,
        id?: UniqueEntityID
    ) {
        const question = new Question({
            createdAt: new Date(),
            slug: new Slug(props.title),
            attachments: props.attachments ?? new QuestionAttachmentsList(),
            ...props,
        }, id);

        return question;
    }
}