export abstract class WatchedList<T> {
    private _current: T[];
    private _initial: T[];
    private _new: T[];
    private _removed: T[];

    constructor(initialItems?: T[]) {
        this._current = initialItems?.slice() || [];
        this._initial = initialItems?.slice() || [];
        this._new = [];
        this._removed = [];
    }

    get current() {
        return this._current;
    }

    get initial() {
        return this._initial;
    }

    get new() {
        return this._new;
    }

    get removed() {
        return this._removed;
    }

    abstract compareItems(a: T, b: T): boolean;

    private isCurrentItem(item: T): boolean {
        return (
            this.current.filter((v) => this.compareItems(item, v)).length !== 0
        );
    }

    private isInitialItem(item: T): boolean {
        return (
            this.initial.filter((v) => this.compareItems(item, v)).length !== 0
        );
    }

    private isNewItem(item: T): boolean {
        return (
            this.new.filter((v) => this.compareItems(item, v)).length !== 0
        );
    }

    private isRemovedItem(item: T): boolean {
        return (
            this.removed.filter((v) => this.compareItems(item, v)).length !== 0
        );
    }

    private removeFromCurrent(item: T): void {
        this._current = this._current.filter((v) => !this.compareItems(item, v));
    }

    private removeFromNew(item: T): void {
        this._new = this._new.filter((v) => !this.compareItems(item, v));
    }

    private removeFromRemoved(item: T): void {
        this._removed = this._removed.filter((v) => !this.compareItems(item, v));
    }

    public add(item: T): void {
        if (this.isRemovedItem(item)) {
            this.removeFromRemoved(item);
        }

        if (!this.isNewItem(item) && !this.isInitialItem(item)) {
            this._new.push(item);
        }

        if (!this.isCurrentItem(item)) {
            this._current.push(item);
        }
    }

    public remove(item: T): void {
        this.removeFromCurrent(item);

        if (this.isNewItem(item)) {
            this.removeFromNew(item);
            return;
        }

        if (!this.isRemovedItem(item)) {
            this._removed.push(item);
        }
    }

    public update(items: T[]): void {
        const newItems = items.filter((a) => {
            return !this._current.some((b) => this.compareItems(a, b));
        });

        const removedItems = this._current.filter((a) => {
            return !items.some((b) => this.compareItems(a, b));
        });

        this._current = items;
        this._new = newItems;
        this._removed = removedItems;
    }
}