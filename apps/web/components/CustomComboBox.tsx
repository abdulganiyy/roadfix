import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

interface Option {
  readonly label: string;
  readonly value: string;
}

type Props = {
  form: UseFormReturn<any>;
  defaultOptions: Option[];
  onChange: (value: any) => void;
  value: Option[];
  name: string;
};

const createOption = (label: string) => ({
  label,
  value: label,
});

export default function CustomComboBox({
  defaultOptions,
  onChange,
  value,
  form,
  name,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      form.setValue(name, [...form.getValues(name), newOption]);
    }, 1000);
  };

  return (
    <CreatableSelect
      isMulti
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={(newValue) => onChange(newValue)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
}
