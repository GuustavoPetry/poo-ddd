import { describe, expect, test } from "vitest";
import { Either, left, rigth } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, number> {
    if (shouldSuccess) return rigth(1);

    return left("error");
}

describe("Either Error Handler", () => {
    test("success", () => {
        const result = doSomething(true);

        expect(result.isRigth()).toBe(true);
        expect(result.isLeft()).toBe(false);
    });

    test("errror", () => {
        const result = doSomething(false);

        expect(result.isLeft()).toBe(true);
        expect(result.isRigth()).toBe(false);
    });
});