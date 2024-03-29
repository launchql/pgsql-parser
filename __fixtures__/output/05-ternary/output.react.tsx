"use client";

import * as React from "react";
import Stack from '../stack';
import Box from '../box';
import Card from './card';
import Skeleton from './skeleton';
import { MyComponentProps } from './types';
export default function MyComponent(props: MyComponentProps) {
  return <Box>
      <Stack space='$10' attributes={{
      flexWrap: 'nowrap'
    }}>
        {props.list?.map((item, index) => <Box width='33.33%' key={item.title}>
              {!props.isLoading ? <Card title={item.title} content={item.content} /> : <Skeleton />}
            </Box>)}
      </Stack>
    </Box>;
}