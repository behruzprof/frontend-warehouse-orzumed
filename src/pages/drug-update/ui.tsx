import React, { useEffect, useState, useRef } from 'react';
import {
        Box, Button, TextField, Typography, Stack, Card as MuiCard,
        FormControl,
        InputLabel,
        Select,
        MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import { useDrugById, useUpdateDrug, useDeleteDrug } from '@/features/drug';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { UpdateDrug } from '@/features/drug/types/drug';

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
        const { mutate: updateDrug, isPending } = useUpdateDrug(id as string);
        const deleteDrug = useDeleteDrug(id as string);



        const [formData, setFormData] = useState<UpdateDrug>({
                name: '',
                shelf: '',
                section: '',
                supplier: '',
                arrivalDate: '',
                expiryDate: '',
                category: '',
                paymentType: 'НДС',
                minStock: 0,
                maxStock: 0,
                purchaseAmount: 0,
        });

        const timeoutRef = useRef<any>(null);

        useEffect(() => {
                if (data) {
                        setFormData({
                                name: data.name,
                                shelf: data.shelf || '',
                                section: data.section || '',
                                supplier: data.supplier,
                                arrivalDate: data.arrivalDate,
                                expiryDate: data.expiryDate,
                                category: data.category,
                                quantity: data.quantity,
                                minStock: data.minStock,
                                maxStock: data.maxStock,
                                purchaseAmount: data.purchaseAmount,
                                // @ts-ignore
                                row: data.row
                        });
                }
        }, [data]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const name = e.target.name!;
                let value: string | number = e.target.value;

                if (['quantity', 'minStock', 'maxStock', 'purchaseAmount', 'row'].includes(name)) {
                        value = Number(value);
                }

                setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const payload = {
                        ...formData,
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
                        updateDrug(payload, {
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

                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        {/* Asosiy ma'lumotlar */}
                                        <Typography variant="subtitle1">Asosiy ma'lumotlar</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Nomi" name="name" value={formData.name} onChange={handleChange} fullWidth required />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Yetkazib beruvchi" name="supplier" value={formData.supplier} onChange={handleChange} fullWidth required />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Sotib olish narxi" name="purchaseAmount" type="number" value={formData.purchaseAmount || ""} fullWidth required />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <FormControl fullWidth required>
                                                                <InputLabel>Kategoriya</InputLabel>
                                                                <Select
                                                                        name="category"
                                                                        value={formData.category}
                                                                        // @ts-ignore
                                                                        onChange={handleChange}
                                                                >
                                                                        {['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ'].map(c => (
                                                                                <MenuItem key={c} value={c}>{c}</MenuItem>
                                                                        ))}
                                                                </Select>
                                                        </FormControl>
                                                </Grid>
                                        </Grid>

                                        {/* Xarid va miqdor */}
                                        <Typography variant="subtitle1">Miqdor va xarid</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Qolgan miqdor" name="quantity" type="number" value={formData.quantity || ""} onChange={handleChange} fullWidth required />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Minimal zaxira" name="minStock" type="number" value={formData.minStock || ""} onChange={handleChange} fullWidth required />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Maksimal zaxira" name="maxStock" type="number" value={formData.maxStock || ""} onChange={handleChange} fullWidth required />
                                                </Grid>

                                        </Grid>

                                        {/* Sklad joylashuvi */}
                                        <Typography variant="subtitle1">Sklad joylashuvi</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Shkaf" name="shelf" value={formData.shelf} onChange={handleChange} fullWidth />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Polka" name="section" value={formData.section} onChange={handleChange} fullWidth />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Qator" name="row" type="number" value={formData.row || ""} onChange={handleChange} fullWidth />
                                                </Grid>
                                        </Grid>

                                        <Box mt={3}>
                                                <Button type="submit" variant="contained" disabled={isPending}>
                                                        Saqlash
                                                </Button>
                                        </Box>
                                </Box>
                        </Card>
                </Container>
        );
}
