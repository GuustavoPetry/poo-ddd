import { describe, expect, it } from "vitest";
import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<Number> {
    compareItems(a: Number, b: Number): boolean {
        return a === b;
    }
}

describe("Watched List", () => {
    it("should be able to create watched list with initial items", () => {
        const list = new NumberWatchedList([1, 2, 3]);

        expect(list.current).toEqual([1, 2, 3]);
        expect(list.initial).toEqual([1, 2, 3]);
        expect(list.new).toEqual([]);
        expect(list.removed).toEqual([]);
    });

    it("should be able to add a new item", () => {
        const list = new NumberWatchedList([1, 2, 3]);

        list.add(4);

        expect(list.current).toEqual([1, 2, 3, 4]);
        expect(list.initial).toEqual([1, 2, 3]);
        expect(list.new).toEqual([4]);
        expect(list.removed).toEqual([]);
    });

    it("should be able to remove a item", () => {
        const list = new NumberWatchedList([1, 2, 3]);

        list.remove(2);

        expect(list.current).toEqual([1, 3]);
        expect(list.initial).toEqual([1, 2, 3]);
        expect(list.new).toEqual([]);
        expect(list.removed).toEqual([2]);
    });

    it("should be able to update the list with new values", () => {
        const list = new NumberWatchedList([1, 2, 3]);

        list.update([1, 3, 5]);

        expect(list.current).toEqual([1, 3, 5]);
        expect(list.initial).toEqual([1, 2, 3]);
        expect(list.new).toEqual([5]);
        expect(list.removed).toEqual([2]);
    });

    it("should be able to add item even if it has been removed before", () => {
        const list = new NumberWatchedList([1, 2, 3]);

        list.remove(2);

        list.add(2);

        expect(list.current).toEqual([1, 3, 2]);
        expect(list.initial).toEqual([1, 2, 3]);
        expect(list.new).toEqual([]);
        expect(list.removed).toEqual([]);
    });

    it("should be able to remove item even if it has been added before", () => {
        const list = new NumberWatchedList([1, 2, 3]);

        list.add(4);

        list.remove(4);

        expect(list.current).toEqual([1, 2, 3]);
        expect(list.initial).toEqual([1, 2, 3]);
        expect(list.new).toEqual([]);
        expect(list.removed).toEqual([]);
    })
});