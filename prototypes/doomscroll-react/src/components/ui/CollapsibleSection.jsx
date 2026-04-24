/**
 * Animated expand/collapse wrapper using max-height CSS transition.
 * Avoids layout jumps while keeping the DOM mounted (good for forms with
 * local state that should not reset when collapsed).
 *
 * @param {object} props
 * @param {boolean} props.open - Whether the content is expanded.
 * @param {React.ReactNode} props.children
 */
export default function CollapsibleSection({ open, children }) {
  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: open ? '2000px' : '0px' }}
    >
      {children}
    </div>
  );
}
