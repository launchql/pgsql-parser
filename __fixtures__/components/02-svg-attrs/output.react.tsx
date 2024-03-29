"use client";
import * as React from "react";
import { useState, useRef } from "react";

export default function MyComponent(props) {
  const buttonRef = useRef<HTMLInputElement>(null);
  const [count, setCount] = useState(() => 0);

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        className={props.className}
        onClick={() => setCount(count + 1)}
      >
        Click me
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            fillRule="evenodd"
            shapeRendering="auto"
            clipPath="auto"
            clipRule="evenodd"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      <blockquote contentEditable="true">
        <p>Edit this content to add your own quote</p>
      </blockquote>
    </>
  );
}