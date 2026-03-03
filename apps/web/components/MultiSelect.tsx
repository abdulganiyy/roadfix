"use client";

import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="border rounded-md p-2 min-h-10.5 flex flex-wrap gap-2 cursor-pointer"
      >
        {value.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}

        {value.map((val) => {
          const option = options.find((o) => o.value === val);
          return (
            <span
              key={val}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
            >
              {option?.label}
            </span>
          );
        })}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-2 w-full border rounded-md bg-white shadow-md max-h-60 overflow-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => toggleOption(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
