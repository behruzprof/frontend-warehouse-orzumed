import React, { useEffect, useState, useRef } from 'react';
import {
        Box, Button, TextField, Typography, Stack, Card as MuiCard
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import dayjs from 'dayjs';
import { useDrugById, useUpdateDrug, useDeleteDrug } from '@/features/drug';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

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

export default function DrugUpdateDeletePage() {
        const { id } = useParams<{ id: string }>();
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
        const navigate = useNavigate();

        const { data, isLoading, error } = useDrugById(id as string);
        const updateDrug = useUpdateDrug(id as string);
        const deleteDrug = useDeleteDrug(id as string);



        const [formData, setFormData] = useState({
                name: '',
                unit: '',
                description: '',
                photo: '',
                shelf: '',
                section: '',
                row: '',
                quantity: '',
                orderQuantity: '',
                supplier: '',
                purchaseAmount: '',
                arrivalDate: '',
                expiryDate: '',
        });

        const timeoutRef = useRef<any>(null);

        useEffect(() => {
                if (data) {
                        setFormData({
                                name: data.name || '',
                                unit: data.unit || '',
                                description: data.description || '',
                                photo: data.photo || '',
                                shelf: data.shelf || '',
                                section: data.section || '',
                                row: String(data.row || ''),
                                quantity: String(data.quantity || ''),
                                orderQuantity: String(data.orderQuantity || ''),
                                supplier: data.supplier || '',
                                purchaseAmount: String(data.purchaseAmount || ''),
                                arrivalDate: data.arrivalDate || dayjs().format('YYYY-MM-DD'),
                                expiryDate: data.expiryDate || '',
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
                        ...formData,
                        row: parseInt(formData.row, 10),
                        quantity: parseInt(formData.quantity, 10),
                        orderQuantity: parseInt(formData.orderQuantity, 10),
                        purchaseAmount: parseFloat(formData.purchaseAmount),
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
                                        enqueueSnackbar("Dori muvaffaqiyatli yangilandi!", { variant: "success" });
                                        navigate('/drug');
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
                                        enqueueSnackbar('Dori o‘chirildi!', { variant: 'success' });
                                        navigate('/drug');
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

                                <Typography variant="h5">Dorini yangilash</Typography>

                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Typography variant="subtitle1">Asosiy ma'lumotlar</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Nomi" name="name" required fullWidth value={formData.name} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="O‘lchov birligi" name="unit" required fullWidth value={formData.unit} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Yetkazib beruvchi" name="supplier" required fullWidth value={formData.supplier} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12}>
                                                        <TextField label="Tavsif" name="description" fullWidth value={formData.description} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12}>
                                                        <TextField label="Rasm URL" name="photo" fullWidth value={formData.photo} onChange={handleChange} />
                                                </Grid>
                                        </Grid>

                                        <Typography variant="subtitle1" mt={2}>Sklad joylashuvi</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Shkaf" name="shelf" required fullWidth value={formData.shelf} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Polka" name="section" required fullWidth value={formData.section} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Qator" name="row" type="number" required fullWidth value={formData.row} onChange={handleChange} />
                                                </Grid>
                                        </Grid>

                                        <Typography variant="subtitle1" mt={2}>Miqdor va xarid</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Miqdor" name="quantity" type="number" required fullWidth value={formData.quantity} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Avto buyurtma miqdori" name="orderQuantity" type="number" fullWidth value={formData.orderQuantity} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Sotib olish narxi" name="purchaseAmount" type="number" required fullWidth value={formData.purchaseAmount} onChange={handleChange} />
                                                </Grid>
                                        </Grid>

                                        <Typography variant="subtitle1" mt={2}>Sanalar</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField
                                                                label="Kelib tushgan sana"
                                                                name="arrivalDate"
                                                                type="date"
                                                                required
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                                value={formData.arrivalDate}
                                                                onChange={handleChange}
                                                        />
                                                </Grid>
                                                {/* @ts-ignore*/}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField
                                                                label="Yaroqlilik muddati"
                                                                name="expiryDate"
                                                                type="date"
                                                                required
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                                value={formData.expiryDate}
                                                                onChange={handleChange}
                                                        />
                                                </Grid>
                                        </Grid>

                                        <Button type="submit" variant="contained">Yangilash</Button>
                                </Box>
                        </Card>
                </Container>
        );
}
