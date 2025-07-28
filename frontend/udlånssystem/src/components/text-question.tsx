import { Input } from "./ui/input";

interface TextQuestionProps {
  editMode?: boolean;
  label: string;
  type?: "text" | "number" | "password";
  value?: string | number;
  setValue?: (value: any) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function TextQuestion({
  editMode = true,
  label,
  type = "text",
  value,
  setValue = (_value: any) => {},
  required = true,
  placeholder = "",
  disabled = false,
}: TextQuestionProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newValue: string | number = e.target.value;

    if (type === "number") newValue = Number(newValue);

    setValue(newValue);
  }

  return (
    <div className="question">
      <label htmlFor="text">
        {label}
        {required && editMode && !disabled && (
          <span className="required-tag">*</span>
        )}
      </label>

      <Input
        autoComplete="off"
        disabled={!editMode || disabled}
        value={value}
        onChange={handleChange}
        className="rounded-xl"
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
