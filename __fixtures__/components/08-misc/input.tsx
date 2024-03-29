import { useRef } from "@genomoic/stubs";
  
export default function MyComponent(props) {
    const buttonRef = useRef<HTMLInputElement>(null);
    return (
        <>
        <button
            type="button"
            ref={buttonRef}
        >
            Click me
        </button>
    </>
    );
};
  