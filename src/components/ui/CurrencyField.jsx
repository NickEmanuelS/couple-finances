import { forwardRef } from "react";
import { NumericFormat } from "react-number-format";
import { TextField } from "@mui/material";

const NumericInput = forwardRef(({ onChange, ...props }, ref) => (
  <NumericFormat
    {...props}
    getInputRef={ref}
    thousandSeparator="."
    decimalSeparator=","
    decimalScale={2}
    fixedDecimalScale
    allowNegative={false}
    prefix="R$ "
    onValueChange={({ floatValue }) => onChange({ target: { value: floatValue ?? "" } })}
  />
));
NumericInput.displayName = "NumericInput";

export const CurrencyField = ({ label, value, onChange, placeholder, size = "small", ...rest }) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    placeholder={placeholder ?? "R$ 0,00"}
    size={size}
    fullWidth
    InputProps={{ inputComponent: NumericInput }}
    {...rest}
  />
);
