/**
interface Props {
    name: string,
    age: number,
}

let props: Optional<Props, "name">;

props.name is optional
*/

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
