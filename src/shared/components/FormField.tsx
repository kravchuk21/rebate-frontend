'use client';

import { FieldError, Input, Label, TextField } from '@heroui/react';
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
  isRequired?: boolean;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  error,
  isRequired,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          type={type}
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={!!error}
          isRequired={isRequired}
          fullWidth
        >
          <Label>{label}</Label>
          <Input placeholder={placeholder} />
          <FieldError>{error}</FieldError>
        </TextField>
      )}
    />
  );
}
