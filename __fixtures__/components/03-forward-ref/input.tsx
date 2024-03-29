import { useDefaultProps, useMetadata } from "@genomoic/stubs";
interface BoxProps {
  prop1: string;
}

useMetadata({
  isAttachedToShadowDom: true,
  rsc: {
    componentType: "client",
  },
});

export default function Box(props: BoxProps) {
  return (
    <props.as
      ref={props.boxRef}
    >
      {props.children}
    </props.as>
  );
}

useDefaultProps(Box, {
  as: "div",
});
