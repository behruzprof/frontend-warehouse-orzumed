// DrugCreatePage.tsx
import * as React from 'react';
import {
        Box,
        Button,
        Grid,
        TextField,
        Typography,
        Stack,
        Card as MuiCard,
        Select,
        MenuItem,
        InputLabel,
        FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';

import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import { useCreateDrug } from '@/features/drug';
import type { CreateDrugDto } from '@/features/drug/types/drug';

const Card = styled(MuiCard)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        margin: 'auto',
        [theme.breakpoints.up('sm')]: {
                maxWidth: '800px',
        },
}));

const Container = styled(Stack)(({ theme }) => ({
        height: '100dvh',
        padding: theme.spacing(2),
        '&::before': {
                content: '""',
                position: 'absolute',
                zIndex: -1,
                inset: 0,
                background: 'radial-gradient(circle at center, hsl(210, 100%, 97%), white)',
        },
}));

export default function DrugCreatePage() {
        const { mutate, isPending } = useCreateDrug();
        const navigate = useNavigate();
        const { enqueueSnackbar } = useSnackbar();

        const [formData, setFormData] = React.useState<CreateDrugDto>({
                name: '',
                quantity: 0,
                minStock: 0,
                maxStock: 0,
                supplier: '',
                purchaseAmount: 0,
                expiryDate: new Date().toISOString().split('T')[0], // ISO date format
                shelf: '',
                section: '',
                row: 0,
                category: 'AX',
                paymentType: "НДС",
                arrivalDate: dayjs().format('YYYY-MM-DD'),
        });

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
                const name = e.target.name!;
                let value = e.target.value;

                if (['quantity', 'minStock', 'maxStock', 'purchaseAmount', 'row'].includes(name)) {
                        value = Number(value);
                }

                setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                mutate(formData, {
                        onSuccess: () => {
                                enqueueSnackbar("Dori muvaffaqiyatli qo‘shildi!", { variant: "success" });
                                setTimeout(() => navigate('/drug'), 2000);
                        },
                        onError: () => {
                                enqueueSnackbar("Xatolik yuz berdi. Qayta urinib ko‘ring!", { variant: "error" });
                        },
                });
        };

        return (
                <Container direction="column" justifyContent="center">
                        <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                        <Card sx={{ overflow: "auto" }} variant="outlined">
                                <Box display="flex" justifyContent="flex-start">
                                        <Button variant="outlined" onClick={() => navigate(-1)}>Orqaga</Button>
                                </Box>
                                <Typography variant="h5" component="h1">Yangi dori qo‘shish</Typography>

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
                                                        <TextField label="Sotib olish narxi" name="purchaseAmount" type="number" value={formData.purchaseAmount || ""} onChange={handleChange} fullWidth required />
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
                                                        <TextField label="Miqdor" name="quantity" type="number" value={formData.quantity || ""} onChange={handleChange} fullWidth required />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Minimal zaxira" name="minStock" type="number" value={formData.minStock || ""} onChange={handleChange} fullWidth required />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Maksimal zaxira" name="maxStock" type="number" value={formData.maxStock || ""} onChange={handleChange} fullWidth required />
                                                </Grid>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12} sm={6}>
                                                        <FormControl fullWidth required>
                                                                <InputLabel>To'lov turi</InputLabel>
                                                                <Select
                                                                        name="paymentType"
                                                                        value={formData.paymentType}
                                                                        // @ts-ignore
                                                                        onChange={handleChange}
                                                                >
                                                                        {['НДС', 'КОРПОРАТИВ КАРТА', 'НАКТ'].map(c => (
                                                                                <MenuItem key={c} value={c}>{c}</MenuItem>
                                                                        ))}
                                                                </Select>
                                                        </FormControl>
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
