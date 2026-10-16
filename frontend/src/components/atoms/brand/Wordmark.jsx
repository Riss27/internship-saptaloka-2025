/**
 * The brand mark.
 *
 * This is a typographic wordmark, not an image. The previous mark was a raster
 * PNG with its background colour baked into the pixels, which forced every
 * placement to sit on a matching green panel and cost 336 KB. Rendering the
 * word as text removes both problems: it inherits the surrounding colour, it
 * scales with the surrounding font size, and it costs no request.
 *
 * Keep it the only place the wordmark is defined. When it sits inside a link,
 * the link's accessible name becomes the word itself, which is what we want.
 */
const Wordmark = ({ size = "text-base", className = "", ...props }) => (
  <span
    className={`font-sans font-medium uppercase leading-none tracking-[0.22em] select-none ${size} ${className}`}
    {...props}
  >
    Ask
  </span>
);

export default Wordmark;
