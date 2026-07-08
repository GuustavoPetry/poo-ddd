import { describe, expect, it, vi } from "vitest";
import { DomainEvent } from "./domain-event";
import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvents } from "./DomainEvents";

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date;
    private aggregate: AggregateRoot<any>;

    constructor(aggregate: AggregateRoot<any>) {
        this.aggregate = aggregate;
        this.ocurredAt = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.aggregate.id;
    }
}

class CustomAggregate extends AggregateRoot<null> {
    static create() {
        const aggregate = new CustomAggregate(null);

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

        return aggregate;
    }
}

describe("Domain Events", () => {
    it("should be able to register event when create aggregate", () => {
        const callbackSpy = vi.fn(); // event callback

        DomainEvents.register(callbackSpy, CustomAggregateCreated.name); // register event (subscriber)

        const aggregate = CustomAggregate.create(); // create aggregate

        expect(aggregate.domainEvents).toHaveLength(1); // event created

        DomainEvents.dispatchEventsForAggregate(aggregate); // dispatch callbacks from event

        expect(callbackSpy).toHaveBeenCalled(); // callback was executed
        expect(aggregate.domainEvents).toHaveLength(0); // event removed
    })

});