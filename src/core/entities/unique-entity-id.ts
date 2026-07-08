import { randomUUID } from "node:crypto";

export class UniqueEntityID {
    private _value: string;

    constructor(value?: string) {
        this._value = value ?? randomUUID();
    }

    toString(): string {
        return this._value;
    }

    equals(id: string): boolean {
        if (id === this._value) return true;

        return false;
    }
}