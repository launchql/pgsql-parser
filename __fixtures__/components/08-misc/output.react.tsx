"use client";
import * as React from "react";
import { useRef } from "react";
  
export default function MyComponent(props) {
    const buttonRef = useRef<HTMLInputElement>(null);
    return (
        <button
            type="button"
            ref={buttonRef}
        >
            Click me
        </button>
    );
};
  