import React from "react";
import DOMPurify from "dompurify";

const RichTextDisplay = ({ content, className = "", isDark = false }) => {
  const baseClasses = isDark 
    ? "prose prose-invert max-w-none" 
    : "prose prose-slate max-w-none";
  
  const combinedClasses = `${baseClasses} ${className} rich-text-display`;

  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
      "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
      "sub", "sup", "span", "div",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "className", "style",
      "target", "rel", "width", "height", "loading",
    ],
  });

  return (
    <>
      <div 
        className={combinedClasses}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-display ul {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
            margin: 1rem 0 !important;
          }
          .rich-text-display ol {
            list-style-type: decimal !important;
            padding-left: 1.5rem !important;
            margin: 1rem 0 !important;
          }
          .rich-text-display li {
            display: list-item !important;
            margin: 0.25rem 0 !important;
          }
          .rich-text-display p {
            margin: 0.75rem 0 !important;
          }
          .rich-text-display strong {
            font-weight: bold !important;
          }
          .rich-text-display em {
            font-style: italic !important;
          }
          .rich-text-display u {
            text-decoration: underline !important;
          }
          .rich-text-display s {
            text-decoration: line-through !important;
          }
          .rich-text-display code {
            background-color: ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'} !important;
            padding: 0.125rem 0.25rem !important;
            border-radius: 0.25rem !important;
            font-family: monospace !important;
            font-size: 0.875rem !important;
          }
          .rich-text-display a {
            color: ${isDark ? '#06b6d4' : '#0891b2'} !important;
            text-decoration: underline !important;
          }
          .rich-text-display sub {
            vertical-align: sub !important;
            font-size: 0.75rem !important;
          }
          .rich-text-display sup {
            vertical-align: super !important;
            font-size: 0.75rem !important;
          }
          .rich-text-display [style*="text-align: center"] {
            text-align: center !important;
          }
          .rich-text-display [style*="text-align: right"] {
            text-align: right !important;
          }
          .rich-text-display [style*="text-align: justify"] {
            text-align: justify !important;
          }
        `
      }} />
    </>
  );
};

export default RichTextDisplay;