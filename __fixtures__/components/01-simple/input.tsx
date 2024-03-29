import {
    useStore,
    useState,
    useRef,
    useDefaultProps,
    onMount,
    onUnMount,
    onUpdate
} from "@genomoic/stubs";

useMetadata({
    rsc: {
      componentType: "client",
    }
});
  
useDefaultProps(CounterComponent, {
    myDefaultProp1: 'hello world!'
})

export default function CounterComponent() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [count, setCount] = useState(0);
    const state = useStore({
        prop1: "web",
        prop2: 'ibc',
        prop3: [],
        prop4: {
            hello: 'world!'
        },
        isShown: false,
        hide(el) {
            el.style.display = "none";
        }
    });

    function mycoolfunction() {
        return 1;
    }

    return (
        <div>
            <button
                css={{
                    color: "blue",
                }}
                onClick={() => setCount(count + 1)}
            >
                Increment
            </button>
            <p>Count: {count}</p>
        </div>
    );
}

export const CounterComponent2 = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [count, setCount] = useState(0);
    const state = useStore({
        var1: "web",
        var2: 'ibc',
        var3: [],
        var4: {
            hello: 'world!'
        },
        isShown: false,
        hide(el) {
            el.style.display = "none";
        }
    });

    function mycoolfunction() {
        state.var1 = 2;
        state.hide(3);
        return 1;
    }

    onMount(() => {
        if (inputRef) {
            state.hide(inputRef);
        }
    });

    onUnMount(() => {
        if (inputRef) {
            state.var3.push(3)
            state.isShown = false;
            state.hide(inputRef);
        }
    });

    onUpdate(() => {
        if (inputRef) {
            state.isShown = true;
            state.hide(inputRef);
        }
    }, [inputRef, state.var1]);

    return (
        <div>
            <button
                css={{
                    color: "blue",
                }}
                onClick={() => setCount(count + 1)}
            >
                Increment
            </button>
            <p>Count: {count}</p>
        </div>
    );
}
