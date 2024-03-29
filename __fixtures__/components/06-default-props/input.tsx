import { For, Show, useDefaultProps, useMetadata } from "@genomoic/stubs";
import Stack from "../stack";
import Box from "../box";
import Card from "./card";
import Skeleton from "./skeleton";
import type { MyComponentProps, MyComponent2Props } from "./types";

useMetadata({
  rsc: {
    componentType: "client",
  },
});

useDefaultProps(MyComponent, {
  propA: "hello world!",
  propB: [1, 2, 3],
  propC: { a: "1", b: "2" },
});

export function MyComponent(props: MyComponentProps) {
  return (
    <Box>
      <Stack
        space="$10"
        attributes={{
          flexWrap: "nowrap",
        }}
      >
        <For each={props.list}>
          {(item, index: number) => (
            <Box width="33.33%" key={item.title}>
              <Show when={!props.isLoading} fallback={<Skeleton />}>
                <Card title={item.title} content={item.content} />
              </Show>
            </Box>
          )}
        </For>
      </Stack>
    </Box>
  );
}

useDefaultProps(MyComponent2, {
  propA: "hello world!",
  propB: [1, 2, 3],
  propC: { a: "1", b: "2" },
});

export function MyComponent2(props: MyComponent2Props) {
  return (
    <Box>
      <Stack
        space="$10"
        attributes={{
          flexWrap: "nowrap",
        }}
      >
        <For each={props.list}>
          {(item, index: number) => (
            <Box width="33.33%" key={item.title}>
              <Show when={!props.isLoading} fallback={<Skeleton />}>
                <Card title={item.title} content={item.content} />
              </Show>
            </Box>
          )}
        </For>
      </Stack>
    </Box>
  );
}
