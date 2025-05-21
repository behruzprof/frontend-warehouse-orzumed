import * as React from 'react';
import {
        Box, Button, Grid, TextField, Typography, Stack, Card as MuiCard, Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// Импортируй хуки запроса списка лекарств и создания arrival
import { useCreateDrugArrival } from '@/features/drug-arrival'; // создать приход
import { useDrugList } from '@/features/drug';

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

        const [selectedDrug, setSelectedDrug] = React.useState<{ id: number; name: string } | null>(null);

        const [formData, setFormData] = React.useState({
                quantity: '',
                purchaseAmount: '',
                arrivalDate: dayjs().format('YYYY-MM-DD'),
                expiryDate: '',
                supplier: '',
        });

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                if (!selectedDrug) {
                        enqueueSnackbar("Iltimos, dori tanlang!", { variant: "warning" });
                        return;
                }

                const payload = {
                        drugId: selectedDrug.id,
                        quantity: parseInt(formData.quantity, 10),
                        purchaseAmount: parseFloat(formData.purchaseAmount),
                        arrivalDate: formData.arrivalDate,
                        expiryDate: formData.expiryDate,
                        supplier: formData.supplier,
                };

                mutate(payload, {
                        onSuccess: () => {
                                enqueueSnackbar("Dori kelib tushuvi muvaffaqiyatli qo‘shildi!", { variant: "success" });
                                setTimeout(() => {
                                        navigate('/arrival');
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
                                                <Grid item xs={12}>
                                                        <Autocomplete
                                                                sx={{ width: 300 }}
                                                                options={drugs}
                                                                getOptionLabel={(option) => option.name}
                                                                onChange={(event, value) => setSelectedDrug(value)}
                                                                renderInput={(params) => (
                                                                        <TextField {...params} label="Dori nomi" required fullWidth />
                                                                )}
                                                        />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                        <TextField label="Yetkazib beruvchi" name="supplier" required fullWidth onChange={handleChange} />
                                                </Grid>
                                        </Grid>

                                        {/* === Miqdor va narx === */}
                                        <Typography variant="subtitle1">Miqdor va narx</Typography>
                                        <Grid container spacing={2}>
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Miqdor" name="quantity" type="number" required fullWidth onChange={handleChange} />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                        <TextField label="Sotib olish narxi" name="purchaseAmount" type="number" required fullWidth onChange={handleChange} />
                                                </Grid>
                                        </Grid>

                                        {/* === Sanalar === */}
                                        <Typography variant="subtitle1">Sanalar</Typography>
                                        <Grid container spacing={2}>
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
                                                <Grid item xs={12} sm={6}>
                                                        <TextField
                                                                label="Yaroqlilik muddati"
                                                                name="expiryDate"
                                                                type="date"
                                                                required
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                                onChange={handleChange}
                                                        />
                                                </Grid>
                                        </Grid>

                                        <Button disabled={isPending} type="submit" variant="contained">Saqlash</Button>
                                </Box>
                        </Card>
                </Container>
        );
}
