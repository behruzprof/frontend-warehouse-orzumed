import { Stack, Typography, Chip } from '@mui/material';

export default function Chart2Header({ total }: { total: number }) {
  return (
    <Stack sx={{ justifyContent: 'space-between' }}>
      <Stack
        direction="row"
        sx={{
          alignContent: { xs: 'center', sm: 'flex-start' },
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="h4" component="p">
          {total}
        </Typography>
        <Chip size="small" color="success" label="+12%" />
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Bo‘limlar bo‘yicha so‘rovlar oxirgi 6 oyda
      </Typography>
    </Stack>
  );
}
