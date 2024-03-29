"use client";

import * as React from "react";
import { forwardRef } from "react";
interface BoxProps {
  prop1: string;
}
const Box = forwardRef<any, BoxProps>(function Box(props: BoxProps, boxRef: BoxProps["boxRef"]) {
  return <props.as ref={props.boxRef ?? boxRef}>
      {props.children}
    </props.as>;
});
Box.defaultProps = {
  as: 'div'
};
export default Box;