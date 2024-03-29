import * as React from "react";
import Stack from "../stack";
import Box from "../box";
import Card from "./card";
import Skeleton from "./skeleton";
import type { MyComponentProps, MyComponent2Props } from "./types";

export function MyComponent(props: MyComponentProps) {
  const {
    propA = "hello world!",
    propB = [1, 2, 3],
    propC = { a: "1", b: "2" },
  } = props;

  return (
    <Box>
      <Stack
        space="$10"
        attributes={{
          flexWrap: "nowrap",
        }}
      >
        {props.list?.map((item, index) => (
          <Box width="33.33%" key={item.title}>
            {!props.isLoading ? (
              <Card title={item.title} content={item.content} />
            ) : null}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function MyComponent2(props: MyComponent2Props) {
  const {
    propA = "hello world!",
    propB = [1, 2, 3],
    propC = { a: "1", b: "2" },
  } = props;

  return (
    <Box>
      <Stack
        space="$10"
        attributes={{
          flexWrap: "nowrap",
        }}
      >
        {props.list?.map((item, index) => (
          <Box width="33.33%" key={item.title}>
            {!props.isLoading ? (
              <Card title={item.title} content={item.content} />
            ) : null}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
