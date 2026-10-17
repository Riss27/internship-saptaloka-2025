import React from "react";
import { CircleAlert } from "lucide-react";

/**
 * Inline field error.
 *
 * Consumers must wire the input to this message so screen readers announce
 * it together with the field:
 *
 *   <input
 *     name="name"
 *     aria-invalid={error ? true : undefined}
 *     aria-describedby={error ? `${name}-error` : undefined}
 *     className={error ? "... border-red-400" : "..."}
 *   />
 *   <FieldError name="name" message={error} />
 *
 * The id below matches the aria-describedby value above. Renders nothing
 * while the message is empty, so layouts do not shift during validation.
 */
const FieldError = ({ name, message }) => {
  if (!message) return null;

  return (
    <p
      id={`${name}-error`}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-meta text-red-400"
    >
      <CircleAlert
        className="w-4 h-4 shrink-0 mt-px"
        aria-hidden="true"
      />
      <span>{message}</span>
    </p>
  );
};

export default FieldError;
