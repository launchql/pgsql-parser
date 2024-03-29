import { For, Show, useMetadata } from "@genomoic/stubs";
import Stack from "../stack";
import Box from "../box";
import Card from "./card";
import Skeleton from "./skeleton";
import { MyComponentProps } from "./types";

useMetadata({
  rsc: {
    componentType: "client",
  },
});

export default function MyComponent(props: MyComponentProps) {
  return (
    <Box>
      <Stack
        space="$10"
        attributes={{
          flexWrap: "nowrap",
        }}
      >
        <For each={props.list}>
          {(item, index) => (
            <Box width="33.33%" key={item.title}>
              <Show when={!props.isLoading} fallback={<Skeleton />}>
                <Card title={item.title} content={item.content} />
                <For each={props.list}>
                  {(item2, index) => (
                    <Box width="33.33%" key={item2.title}>
                      <Show when={!props.isLoading} fallback={<Skeleton />}>
                        <Card title={item.title} content={item.content} />
                      </Show>
                    </Box>
                  )}
                </For>

              </Show>
            </Box>
          )}
        </For>
      </Stack>
    </Box>
  );
}
