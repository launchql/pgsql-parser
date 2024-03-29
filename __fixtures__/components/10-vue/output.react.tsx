import { useState, useStore } from "@genomoic/stubs";
import { Stack, InputCard } from "../components"

export default function MyComponent(props) {
    const [name, setName] = useState("Steve");
    const state = useStore({
        prop1: 1
    })

    return (
        <Stack>
            <InputCard>
                <input
                    css={{
                        color: "red",
                    }}
                    value={name}
                    onChange={(event) => {
                        state.prop1 = state.prop1 + 1;
                        console.log('hi')
                        setName(event.target.value)
                        return true;
                    }
                    }
                />
            </InputCard>
            Hello! I can run in React, Vue, Solid, or Liquid!
        </Stack>
    );
}