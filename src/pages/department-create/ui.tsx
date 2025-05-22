import * as React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import { useCreateDepartment } from '@/features/department'; // путь подкорректируйте
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '600px',
  },
}));

const Container = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  padding: theme.spacing(2),
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(circle at center, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function DepartmentCreatePage() {
  const { mutate, isPending } = useCreateDepartment();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      enqueueSnackbar('Iltimos, bo‘lim nomini kiriting.', { variant: 'warning' });
      return;
    }

    mutate(
      { name: name.trim() },
      {
        onSuccess: () => {
          enqueueSnackbar('Bo‘lim muvaffaqiyatli yaratildi!', { variant: 'success' });
          setTimeout(() => navigate('/departments'), 1500);
        },
        onError: () => {
          enqueueSnackbar('Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.', {
            variant: 'error',
          });
        },
      }
    );
  };

  return (
    <Container direction="column" justifyContent="center">
      <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <Card variant="outlined" sx={{ overflowY: 'auto' }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Orqaga
          </Button>
        </Box>
        <Typography variant="h5" component="h1" mb={2}>
          Yangi bo‘lim yaratish
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Bo‘lim nomi"
            name="name"
            required
            fullWidth
            value={name}
            onChange={handleChange}
          />

          <Button disabled={isPending} type="submit" variant="contained">
            Saqlash
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
