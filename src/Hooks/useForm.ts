import { ChangeEvent, useState } from "react";

interface FormValue {
  [key: string]: string | number | boolean;
}

export const useForm = <T extends FormValue>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;

    let newValue: string | number | boolean = value;

    if (type === "number") {
      newValue = Number(value);
    } else if (type === "checkbox") {
      newValue = (event.target as HTMLInputElement).checked;
    }

    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const resetForm = (newValues?: typeof initialValues) => {
    setValues(newValues ?? initialValues);
  };

  return {
    values,
    handleChange,
    resetForm,
  };
};
