import React, { useEffect, useState, useRef } from 'react';
import {
        Box, Button, TextField, Typography, Stack, Card as MuiCard,
        FormControl,
        InputLabel,
        Select,
        MenuItem,
        Checkbox,
        FormControlLabel
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

        const [formData, setFormData] = useState<UpdateDrug & { unit?: string; IsStandard?: boolean; piece?: number; costPerPiece?: number }>({
                name: '',
                unit: 'pcs',
                shelf: '',
                section: '',
                supplier: '',
                arrivalDate: '',
                expiryDate: '',
                category: '',
                paymentType: 'НДС',
                minStock: 0,
                maxStock: 0,
                // Новые поля
                IsStandard: false,
                piece: 0,
                costPerPiece: 0,
        });

        const timeoutRef = useRef<any>(null);

        useEffect(() => {
                if (data) {
                        setFormData({
                                name: data.name,
                                unit: data.unit || 'pcs',
                                shelf: data.shelf || '',
                                section: data.section || '',
                                supplier: data.supplier,
                                arrivalDate: data.arrivalDate,
                                expiryDate: data.expiryDate,
                                category: data.category,
                                quantity: data.quantity,
                                minStock: data.minStock,
                                maxStock: data.maxStock,
                                // @ts-ignore
                                row: data.row,
                                // Новые поля с бэкенда
                                IsStandard: data.IsStandard || false,
                                piece: data.piece || 0,
                                costPerPiece: data.costPerPiece || 0,
                        });
                }
        }, [data]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
                const target = e.target as HTMLInputElement;
                const name = target.name!;
                let value: any = target.value;

                // Обработка чекбокса IsStandard
                if (target.type === 'checkbox') {
                        value = target.checked;
                } 
                // Обработка числовых полей
                else if (['quantity', 'minStock', 'maxStock', 'costPerPiece', 'piece', 'row'].includes(name)) {
                        value = Number(value);
                }

                setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const payload = { ...formData };

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

        if (isLoading) return (
                <Container direction="column" justifyContent="center">
                        <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                        <Card variant="outlined">
                                <Typography variant="h5">Yuklanmoqda...</Typography>
                        </Card>
                </Container>
        );

        if (error) return (
                <Container direction="column" justifyContent="center">
                        <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                        <Card variant="outlined">
                                <Typography variant="h5">Xatolik yuz berdi!</Typography>
                                <Button variant="contained" onClick={() => navigate(-1)}>Orqaga</Button>
                        </Card>
                </Container>
        );

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
                                        <Grid container spacing={2} alignItems="center">
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField label="Nomi" name="name" value={formData.name} onChange={handleChange as any} fullWidth required />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField label="Yetkazib beruvchi" name="supplier" value={formData.supplier} onChange={handleChange as any} fullWidth required />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                        <FormControl fullWidth required>
                                                                <InputLabel>Kategoriya</InputLabel>
                                                                <Select
                                                                        name="category"
                                                                        value={formData.category}
                                                                        onChange={handleChange as any}
                                                                >
                                                                        {['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ'].map(c => (
                                                                                <MenuItem key={c} value={c}>{c}</MenuItem>
                                                                        ))}
                                                                </Select>
                                                        </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                        <FormControlLabel
                                                                control={<Checkbox checked={formData.IsStandard} onChange={handleChange as any} name="IsStandard" color="primary" />}
                                                                label="Standart dori (Bitimga qo'shish)"
                                                        />
                                                </Grid>
                                        </Grid>

                                        {/* Xarid va miqdor */}
                                        <Typography variant="subtitle1">Miqdor va xarid</Typography>
                                        <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Kelgan miqdor (dona)" name="piece" type="number" value={formData.piece || ""} onChange={handleChange as any} fullWidth required />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Dona narxi" name="costPerPiece" type="number" value={formData.costPerPiece || ""} onChange={handleChange as any} fullWidth required />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Umumiy qolgan miqdor" name="quantity" type="number" value={formData.quantity || ""} onChange={handleChange as any} fullWidth required />
                                                </Grid>

                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <FormControl fullWidth required>
                                                                <InputLabel>O'lchov turi</InputLabel>
                                                                <Select
                                                                        name="unit"
                                                                        value={formData.unit}
                                                                        onChange={handleChange as any}
                                                                >
                                                                        <MenuItem value="pcs">Dona (Шт)</MenuItem>
                                                                        <MenuItem value="ml">Millilitr (Мл)</MenuItem>
                                                                </Select>
                                                        </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Minimal zaxira" name="minStock" type="number" value={formData.minStock || ""} onChange={handleChange as any} fullWidth required />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Maksimal zaxira" name="maxStock" type="number" value={formData.maxStock || ""} onChange={handleChange as any} fullWidth required />
                                                </Grid>
                                        </Grid>

                                        {/* Sklad joylashuvi */}
                                        <Typography variant="subtitle1">Sklad joylashuvi</Typography>
                                        <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Shkaf" name="shelf" value={formData.shelf} onChange={handleChange as any} fullWidth />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Polka" name="section" value={formData.section} onChange={handleChange as any} fullWidth />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Qator" name="row" type="number" value={formData.row || ""} onChange={handleChange as any} fullWidth />
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