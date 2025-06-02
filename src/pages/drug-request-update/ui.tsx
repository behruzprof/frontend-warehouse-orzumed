import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Button, TextField, Typography, Stack, Card as MuiCard
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  useDrugRequestById,
  useUpdateDrugRequest,
  useDeleteDrugRequest,
} from '@/features/drug-request';
import { APP_ROUTES } from '@/shared/constants/app-route';


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '800px' },
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
    backgroundImage: 'radial-gradient(circle at center, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function DrugRequestUpdateAndDeletePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const timeoutRef = useRef<any | null>(null);

  const { data, isLoading, error } = useDrugRequestById(+id!);
  const updateDrugRequest = useUpdateDrugRequest(+id!);
  const deleteDrugRequest = useDeleteDrugRequest(+id!);

  const [formData, setFormData] = useState({
    quantity: '',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        quantity: String(data.quantity),
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      quantity: parseInt(formData.quantity),
    };

    const snackbarKey = enqueueSnackbar('Yangilash uchun 5 soniya...', {
      variant: 'info',
      action: key => (
        <Button color="inherit" onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          closeSnackbar(key);
          enqueueSnackbar('Yangilash bekor qilindi', { variant: 'warning' });
        }}>
          Bekor qilish
        </Button>
      )
    });

    timeoutRef.current = setTimeout(() => {
      updateDrugRequest.mutate(payload, {
        onSuccess: () => {
          closeSnackbar(snackbarKey);
          enqueueSnackbar('So‘rov muvaffaqiyatli yangilandi!', { variant: 'success' });
          navigate(`${APP_ROUTES.REQUIREMENT_DRUG}/list`);
        },
        onError: () => {
          enqueueSnackbar('Xatolik yuz berdi!', { variant: 'error' });
        },
      });
    }, 5000);
  };

  const handleDelete = () => {
    const snackbarKey = enqueueSnackbar('O‘chirish uchun 5 soniya...', {
      variant: 'error',
      action: key => (
        <Button color="inherit" onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          closeSnackbar(key);
          enqueueSnackbar('O‘chirish bekor qilindi', { variant: 'info' });
        }}>
          Bekor qilish
        </Button>
      )
    });

    timeoutRef.current = setTimeout(() => {
      deleteDrugRequest.mutate(undefined, {
        onSuccess: () => {
          closeSnackbar(snackbarKey);
          enqueueSnackbar('So‘rov o‘chirildi!', { variant: 'success' });
          navigate(`${APP_ROUTES.REQUIREMENT_DRUG}/list`);
        },
        onError: () => {
          enqueueSnackbar('Xatolik yuz berdi!', { variant: 'error' });
        },
      });
    }, 5000);
  };

  if (isLoading) {
    return (
      <Container direction="column" justifyContent="center">
        <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography variant="h5">Yuklanmoqda...</Typography>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container direction="column" justifyContent="center">
        <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
          <Typography variant="h5">Xatolik yuz berdi!</Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>Orqaga</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container direction="column" justifyContent="center">
      <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <Card variant="outlined" sx={{ overflowY: 'auto' }}>
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate(-1)}>Orqaga</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            O‘chirish
          </Button>
        </Box>

        <Typography variant="h5">Dori so‘rovini yangilash</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            {/* @ts-ignore*/}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Miqdor"
                name="quantity"
                type="number"
                required
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Button type="submit" variant="contained" color="primary">
            Saqlash
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
