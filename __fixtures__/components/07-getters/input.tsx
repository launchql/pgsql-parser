import { useDefaultProps, useMetadata, useStore } from "@genomoic/stubs";
import clsx from "clsx";
import omit from "lodash/omit";
import { rainbowSprinkles } from "../../styles/rainbow-sprinkles.css";
import type { BoxProps } from "./box.types";
import { DEFAULT_VALUES } from "./box.types";

useMetadata({
  isAttachedToShadowDom: true,
  rsc: {
    componentType: "client",
  },
});

useDefaultProps(Box, {
  as: "div",
});

export default function Box(props: BoxProps) {
  const state = useStore({
    get finalPassThroughProps() {
      return state.boxStyles.passThroughProps;
    },
    get boxStyles() {
      const sprinklesObj = rainbowSprinkles({
        ...omit(props, ["attributes", "as", "boxRef"]),
        ...props.attributes,
      });

      return {
        className: clsx(sprinklesObj.className, props.className),
        style: sprinklesObj.style,
        passThroughProps: sprinklesObj.otherProps,
      };
    },
  });

  return (
    <props.as
      className={state.boxStyles.className}
      style={{
        ...state.boxStyles.style,
        ...props.rawCSS,
      }}
      {...state.finalPassThroughProps}
      ref={props.boxRef}
    >
      {props.children}
    </props.as>
  );
}
