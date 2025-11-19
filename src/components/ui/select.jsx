import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

export function Select({ children, value, onValueChange, placeholder }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          w-full flex justify-between items-center px-3 py-2
          border rounded-lg bg-white text-left text-sm
          hover:bg-gray-50 transition
        "
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder || "Select..."}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {open && (
        <div
          className="
            absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg 
            border divide-y max-h-60 overflow-auto
          "
        >
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onSelect: (val) => {
                onValueChange && onValueChange(val);
                setOpen(false);
              },
            })
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------
 * Select Trigger (Wrapper)
 ---------------------------*/
export function SelectTrigger({ children }) {
  return <>{children}</>;
}

/* --------------------------
 * Select Value
 ---------------------------*/
export function SelectValue({ placeholder }) {
  return <span className="text-gray-400">{placeholder || "Select..."}</span>;
}

/* --------------------------
 * Content container
 ---------------------------*/
export function SelectContent({ children }) {
  return <div>{children}</div>;
}

/* --------------------------
 * Select Item (Option)
 ---------------------------*/
export function SelectItem({ children, value, onSelect }) {
  return (
    <button
      className="
        w-full text-left px-3 py-2 text-sm hover:bg-gray-100 
        flex items-center justify-between
      "
      onClick={() => onSelect && onSelect(value)}
    >
      <span>{children}</span>
      <Check
        size={16}
        className="text-gray-500 opacity-0 group-hover:opacity-100"
      />
    </button>
  );
}
