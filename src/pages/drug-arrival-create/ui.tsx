import * as React from 'react';
import {
        Box, Button, Typography, Stack, Card as MuiCard, Autocomplete,
        FormControl,
        InputLabel,
        Select,
        MenuItem,
        TextField
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { useCreateDrugArrival } from '@/features/drug-arrival';
import { useDrugList } from '@/features/drug';
import { APP_ROUTES } from '@/shared/constants/app-route';
import type { Drug } from '@/features/drug/types/drug';

const paymentTypes = ['НДС', 'КОРПОРАТИВ КАРТА', 'НАКТ'];

const Card = styled(MuiCard)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        margin: 'auto',
        [theme.breakpoints.up('sm')]: {
                maxWidth: '800px',
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
                backgroundImage: 'radial-gradient(circle at center, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                backgroundRepeat: 'no-repeat',
        },
}));

export default function ArrivalCreatePage() {
        const { data: drugs = [] } = useDrugList();
        const { mutate, isPending } = useCreateDrugArrival();
        const navigate = useNavigate();
        const { enqueueSnackbar } = useSnackbar();

        const [selectedDrug, setSelectedDrug] = React.useState<Drug | null>(null);

        // Обновили стейт: убрали purchaseAmount, добавили piece и costPerPiece
        const [formData, setFormData] = React.useState({
                piece: '',
                costPerPiece: '',
                quantity: '',
                arrivalDate: dayjs().format('YYYY-MM-DD'),
                expiryDate: '',
                supplier: '',
                paymentType: 'НДС',
        });

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
                const target = e.target as HTMLInputElement;
                const name = target.name!;
                const value = target.value;
                setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (!selectedDrug) {
                        enqueueSnackbar("Iltimos, dori tanlang!", { variant: "warning" });
                        return;
                }

                // Автоматически считаем общую сумму для бэкенда
                const calculatedPurchaseAmount = Number(formData.piece) * Number(formData.costPerPiece);

                const payload = {
                        drugId: selectedDrug.id,
                        piece: Number(formData.piece),
                        costPerPiece: Number(formData.costPerPiece),
                        quantity: Number(formData.quantity),
                        purchaseAmount: calculatedPurchaseAmount, // Передаем готовую сумму
                        arrivalDate: formData.arrivalDate,
                        expiryDate: formData.expiryDate,
                        supplier: formData.supplier,
                        paymentType: formData.paymentType,
                };

                mutate(payload, {
                        onSuccess: () => {
                                enqueueSnackbar("Dori kelib tushuvi muvaffaqiyatli qo‘shildi!", { variant: "success" });
                                setTimeout(() => {
                                        navigate(APP_ROUTES.ARRIVALS_DRUG);
                                }, 2000);
                        },
                        onError: () => {
                                enqueueSnackbar("Xatolik yuz berdi. Qayta urinib ko‘ring!", { variant: "error" });
                        },
                });
        };

        return (
                <Container direction="column" justifyContent="center">
                        <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                        <Card variant="outlined" sx={{ overflowY: "auto" }}>
                                <Box display="flex" justifyContent="flex-start">
                                        <Button variant="outlined" onClick={() => navigate(-1)}>Orqaga</Button>
                                </Box>
                                <Typography variant="h5">Yangi kelib tushgan dori</Typography>
                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        
                                        {/* === Dori tanlash === */}
                                        <Typography variant="subtitle1">Dori haqida</Typography>
                                        <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                        <Autocomplete
                                                                fullWidth
                                                                options={drugs}
                                                                getOptionLabel={(option) => option.name}
                                                                onChange={(_, value) => setSelectedDrug(value)}
                                                                renderInput={(params) => (
                                                                        <TextField {...params} label="Dori nomi" required fullWidth />
                                                                )}
                                                        />
                                                        {selectedDrug && (
                                                                <Box mt={1} ml={0.5}>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                                Minimal zaxira: <strong>{selectedDrug.minStock}</strong>, Maksimal zaxira: <strong>{selectedDrug.maxStock}</strong>
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                                O'lchov turi: <strong>{selectedDrug.unit === 'pcs' ? 'Dona (Шт)' : selectedDrug.unit === 'ml' ? 'Millilitr (Мл)' : selectedDrug.unit}</strong>
                                                                        </Typography>
                                                                </Box>
                                                        )}
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField label="Yetkazib beruvchi" name="supplier" required fullWidth onChange={handleChange as any} />
                                                </Grid>
                                        </Grid>

                                        {/* === Miqdor va narx === */}
                                        <Typography variant="subtitle1" mt={1}>Miqdor va narx</Typography>
                                        <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Kelgan miqdor (dona)" name="piece" type="number" value={formData.piece} required fullWidth onChange={handleChange as any} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Dona narxi" name="costPerPiece" type="number" value={formData.costPerPiece} required fullWidth onChange={handleChange as any} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                        <TextField label="Umumiy miqdor" name="quantity" type="number" value={formData.quantity} required fullWidth onChange={handleChange as any} />
                                                </Grid>

                                                <Grid size={{ xs: 12, sm: 12 }}>
                                                        <FormControl fullWidth required>
                                                                <InputLabel>To'lov turi</InputLabel>
                                                                <Select
                                                                        name="paymentType"
                                                                        value={formData.paymentType}
                                                                        onChange={handleChange as any}
                                                                >
                                                                        {paymentTypes.map(c => (
                                                                                <MenuItem key={c} value={c}>{c}</MenuItem>
                                                                        ))}
                                                                </Select>
                                                        </FormControl>
                                                </Grid>
                                        </Grid>

                                        {/* === Sanalar === */}
                                        <Typography variant="subtitle1" mt={1}>Sanalar</Typography>
                                        <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField
                                                                label="Kelib tushgan sana"
                                                                name="arrivalDate"
                                                                type="date"
                                                                required
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                                value={formData.arrivalDate}
                                                                onChange={handleChange as any}
                                                        />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                        <TextField
                                                                label="Yaroqlilik muddati"
                                                                name="expiryDate"
                                                                type="date"
                                                                required
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={handleChange as any}
                                                        />
                                                </Grid>
                                        </Grid>

                                        <Box mt={2}>
                                                <Button disabled={isPending} type="submit" variant="contained">Saqlash</Button>
                                        </Box>
                                </Box>
                        </Card>
                </Container>
        );
}