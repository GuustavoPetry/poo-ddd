import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";

type DomainEventCallback = (event: any) => void;

export class DomainEvents {
    private static handlersMap: Record<string, DomainEventCallback[]> = {};
    private static markedAggregates: AggregateRoot<any>[] = [];

    public static register(
        callback: DomainEventCallback,
        eventClassname: string,
    ): void {
        const eventAlreadyRegister: boolean = eventClassname in this.handlersMap;

        if (!eventAlreadyRegister) {
            this.handlersMap[eventClassname] = [];
        }

        this.handlersMap[eventClassname]?.push(callback);
    }

    public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
        const aggregateFound = !!this.findMarkedAggregateById(aggregate.id);

        if (!aggregateFound) {
            this.markedAggregates.push(aggregate);
        }
    }

    public static dispatchEventsForAggregate(aggregate: AggregateRoot<any>): void {
        const isMarkedAggregate: boolean = !!this.findMarkedAggregateById(aggregate.id);

        if (isMarkedAggregate) {
            aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event));

            aggregate.clearEvents();

            this.removeFromMarkedAggregates(aggregate);
        }
    }

    private static dispatch(event: DomainEvent): void {
        const eventClassname: string = event.constructor.name;

        const wasEventRegisterBefore: boolean = eventClassname in this.handlersMap;

        if (wasEventRegisterBefore) {
            this.handlersMap[eventClassname]?.forEach((handler) => handler(event));
        }
    }

    private static findMarkedAggregateById(id: UniqueEntityID): AggregateRoot<any> | null {
        return this.markedAggregates.find((aggregate) => aggregate.id === id) ?? null;
    }

    private static removeFromMarkedAggregates(aggregate: AggregateRoot<any>): void {
        const itemIndex = this.markedAggregates.findIndex((a) => aggregate.equals(a));

        this.markedAggregates.splice(itemIndex, 1);
    }

}