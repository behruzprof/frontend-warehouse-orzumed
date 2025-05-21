import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Button, TextField, Typography, Stack, Card as MuiCard
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDeleteDrugArrival, useDrugArrivalById, useUpdateDrugArrival } from '@/features/drug-arrival';
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

export default function DrugArrivalUpdateAndDeletePage() {
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { data, isLoading, error } = useDrugArrivalById(+id!);
  const updateDrug = useUpdateDrugArrival(+id!);
  const deleteDrug = useDeleteDrugArrival(+id!);

  const [formData, setFormData] = useState({
    quantity: '',
    purchaseAmount: '',
    arrivalDate: '',
    expiryDate: '',
    supplier: '',
  });

  /* @ts-ignore */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (data) {
      setFormData({
        quantity: String(data.quantity || ''),
        purchaseAmount: String(data.purchaseAmount || ''),
        arrivalDate: dayjs(data.arrivalDate).format('YYYY-MM-DD'),
        expiryDate: dayjs(data.expiryDate).format('YYYY-MM-DD'),
        supplier: data.supplier || '',
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      quantity: parseInt(formData.quantity),
      purchaseAmount: parseFloat(formData.purchaseAmount),
      arrivalDate: formData.arrivalDate,
      expiryDate: formData.expiryDate,
      supplier: formData.supplier,
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
      updateDrug.mutate(payload, {
        onSuccess: () => {
          closeSnackbar(snackbarKey);
          enqueueSnackbar("Dori partiyasi muvaffaqiyatli yangilandi!", { variant: "success" });
          navigate(APP_ROUTES.ARRIVALS_DRUG);
        },
        onError: () => {
          enqueueSnackbar("Xatolik yuz berdi!", { variant: "error" });
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
      deleteDrug.mutate(undefined, {
        onSuccess: () => {
          closeSnackbar(snackbarKey);
          enqueueSnackbar('Dori partiyasi o‘chirildi!', { variant: 'success' });
          navigate(APP_ROUTES.ARRIVALS_DRUG);
        },
        onError: () => {
          enqueueSnackbar("Xatolik yuz berdi!", { variant: 'error' });
        }
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
      <Card variant="outlined" sx={{ overflowY: "auto" }}>
        <Box display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={() => navigate(-1)}>Orqaga</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            O‘chirish
          </Button>
        </Box>

        <Typography variant="h5">Dori partiyasini yangilash</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Xarid summasi"
                name="purchaseAmount"
                type="number"
                required
                fullWidth
                value={formData.purchaseAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kelib tushgan sana"
                name="arrivalDate"
                type="date"
                required
                fullWidth
                value={formData.arrivalDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Yaroqlilik muddati"
                name="expiryDate"
                type="date"
                required
                fullWidth
                value={formData.expiryDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Yetkazib beruvchi"
                name="supplier"
                fullWidth
                required
                value={formData.supplier}
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
