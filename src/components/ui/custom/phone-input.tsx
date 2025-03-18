"use client";

import { Input } from "@/components/ui/input";
import { parseToNumber } from "@/lib/utils";
import { ChangeEvent, useState } from "react";

interface InputPhoneProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function InputPhone({
  value,
  onChange,
  placeholder = "+55 (00) 00000-0000",
}: InputPhoneProps) {
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseToNumber(e.target.value);
    
    if (rawValue.length > 11) return;
    
    let formattedValue = rawValue;
    
    if (rawValue.length > 2) {
      formattedValue = `(${rawValue.slice(0, 2)})${rawValue.slice(2)}`;
    }
    
    if (rawValue.length > 7) {
      formattedValue = `(${rawValue.slice(0, 2)})${rawValue.slice(2, 7)}-${rawValue.slice(7)}`;
    }
    
    setInputValue(formattedValue);
    onChange(rawValue);
  };

  return (
    <Input
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
    />
  );
} 