import { ReadonlySignal } from '@preact/signals';
import { JSX, RefObject } from 'preact';
export type HintComponentProps<T> = {
    value: ReadonlySignal<string>;
    onSelect: (value: T) => void;
};
type CustomHint<T> = {
    type: 'custom';
    component: (props: HintComponentProps<T>) => JSX.Element;
};
type ListHint<T extends Record<string, unknown>> = {
    type: 'list';
    item: (props: T) => JSX.Element;
    getOptions: (partialValue: string) => T[];
};
type Hint<T> = (T extends Record<string, unknown> ? ListHint<T> | CustomHint<T> : unknown extends T ? ListHint<{}> | CustomHint<T> : CustomHint<T>) & {
    format: (value: T) => string;
    deserialize: (value: string) => T;
};
export declare const BubblesSearch: {
    <T extends Record<string, unknown>>(props: {
        hints: { [K in keyof T]: Hint<T[K]>; };
        onInput: (values: { [K in keyof T]: T[K][]; } & {
            rowText: string;
        }) => void;
    }): JSX.Element;
    mount<T extends Record<string, unknown>>(selector: string, props: {
        hints: { [K in keyof T]: Hint<T[K]>; };
        onInput: (values: { [K in keyof T]: T[K][]; } & {
            rowText: string;
        }) => void;
    }): void;
};
declare const Hint: <T extends unknown>(props: {
    position: ReadonlySignal<{
        x: number;
        y: number;
    } | undefined>;
    hint: ReadonlySignal<Hint<T> | undefined>;
    closeHint: () => void;
    partialValue: ReadonlySignal<string>;
    anchor: RefObject<HTMLElement>;
    textboxRef: RefObject<HTMLElement>;
}) => JSX.Element | null;
export {};
