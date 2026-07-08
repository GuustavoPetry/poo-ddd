import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/DomainEvents";
import { Entity } from "./entitiy";

export abstract class AggregateRoot<Props> extends Entity<Props> {
    private _domainEvents: DomainEvent[] = [];

    get domainEvents() {
        return this._domainEvents;
    }

    addDomainEvent(event: DomainEvent): void {
        this._domainEvents.push(event);

        DomainEvents.markAggregateForDispatch(this);
    }

    clearEvents(): void {
        this._domainEvents = [];
    }
}