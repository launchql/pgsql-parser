import * as React from "react";
import { forwardRef } from "react";
import clsx from "clsx";
import omit from "lodash/omit";
import { rainbowSprinkles } from "../../styles/rainbow-sprinkles.css";
import type { BoxProps } from "./box.types";
import { DEFAULT_VALUES } from "./box.types";

const Box = forwardRef<any, BoxProps>(function Box(
  props: BoxProps,
  boxRef: BoxProps["boxRef"]
) {
  function finalPassThroughProps() {
    return boxStyles().passThroughProps;
  }

  function boxStyles() {
    const sprinklesObj = rainbowSprinkles({
      ...omit(props, ["attributes", "as", "boxRef"]),
      ...props.attributes,
    });
    return {
      className: clsx(sprinklesObj.className, props.className),
      style: sprinklesObj.style,
      passThroughProps: sprinklesObj.otherProps,
    };
  }

  return (
    <props.as
      style={{
        ...boxStyles().style,
        ...props.rawCSS,
      }}
      {...finalPassThroughProps()}
      ref={props.boxRef ?? boxRef}
      className={boxStyles().className}
    >
      {props.children}
    </props.as>
  );
});

Box.defaultProps = { as: DEFAULT_VALUES.as };

export default Box;
