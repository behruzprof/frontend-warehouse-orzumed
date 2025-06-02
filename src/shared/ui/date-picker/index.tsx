import { TextField } from '@mui/material';

export const DatePicker = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => (
  <TextField
    type="date"
    label={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    InputLabelProps={{ shrink: true }}
    size="small"
  />
);