"use client";
import * as React from "react";
import { useState, useRef, useEffect  } from "react";
CounterComponent.defaultProps = {
    myDefaultProp1: 'hello world!'
};
export default function CounterComponent() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [count, setCount] = useState(() => 0);
    const [prop1, setProp1] = useState(() => "web");
    const [prop2, setProp2] = useState(() => 'ibc');
    const [prop3, setProp3] = useState(() => []);
    const [prop4, setProp4] = useState(() => ({
        hello: 'world!'
    }));
    const [isShown, setIsShown] = useState(() => false);
    function hide(el) {
        el.style.display = "none";
    }
    function mycoolfunction() {
        return 1;
    }
    return (<div>
        <button css={{
            color: "blue"
        }} onClick={() => setCount(count + 1)}>
            Increment
        </button>
        <p>Count: {count}</p>
    </div>);
}
export const CounterComponent2 = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [count, setCount] = useState(() => 0);
    const [var1, setVar1] = useState(() => "web");
    const [var2, setVar2] = useState(() => 'ibc');
    const [var3, setVar3] = useState(() => []);
    const [var4, setVar4] = useState(() => ({
        hello: 'world!'
    }));
    const [isShown, setIsShown] = useState(() => false);
    function hide(el) {
        el.style.display = "none";
    }
    function mycoolfunction() {
        setVar1(2);
        hide(3);
        return 1;
    }
    useEffect(() => {
        if (inputRef.current) {
            hide(inputRef.current);
        }
    }, []);
    useEffect(() => {
        if (inputRef.current) {
            var3.push(3);
            setIsShown(false);
            hide(inputRef.current);
        }
    });
    useEffect(() => {
        if (inputRef.current) {
            setIsShown(true);
            hide(inputRef.current);
        }
    }, [inputRef.current, var1]);
    return (<div>
        <button css={{
            color: "blue"
        }} onClick={() => setCount(count + 1)}>
            Increment
        </button>
        <p>Count: {count}</p>
    </div>);
};