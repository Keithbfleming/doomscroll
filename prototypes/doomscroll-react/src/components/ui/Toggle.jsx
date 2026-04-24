/**
 * Reusable on/off toggle switch.
 *
 * @param {object} props
 * @param {boolean} props.value - Current on/off state.
 * @param {function} props.onChange - Called with the new boolean value when toggled.
 * @param {string} [props.label] - Optional accessible label for screen readers.
 */
export default function Toggle({ value, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-label={label}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        value ? 'bg-blue-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
