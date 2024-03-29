import * as React from "react";
import { useState } from "react";
import { Stack, InputCard } from '../components';
export default function MyComponent(props) {
  const [name, setName] = useState(() => 'Steve');
  const [prop1, setProp1] = useState(() => 1);
  return <Stack>
            <InputCard>
                <input css={{
        color: 'red'
      }} value={name} onChange={event => {
        setProp1(prop1 + 1);
        console.log('hi');
        setName(event.target.value);
        return true;
      }} />
            </InputCard>
            Hello! I can run in React, Vue, Solid, or Liquid!
        </Stack>;
}