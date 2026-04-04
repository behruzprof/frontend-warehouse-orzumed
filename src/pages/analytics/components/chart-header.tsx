import { Typography, Chip, Stack } from '@mui/material';

export default function ChartHeader({ total }: { total: number }) {
  return (
    <Stack sx={{ justifyContent: 'space-between' }}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="h4">Jami olingan dorilar soni</Typography>
        <Chip size="small" color="success" label={`${total} ta so‘rov`} />
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Har bir kunda bo‘limlar bo‘yicha jami so‘rovlar
      </Typography>
    </Stack>
  );
}
