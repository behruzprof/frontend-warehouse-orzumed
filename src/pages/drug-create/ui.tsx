import * as React from 'react';
import {
        Box,
        Button,
        Grid,
        TextField,
        Typography,
        Stack,
        Card as MuiCard,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import dayjs from 'dayjs';
import { useCreateDrug } from '@/features/drug';
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

export default function DrugCreatePage() {
        const { mutate, isPending } = useCreateDrug()
        const navigate = useNavigate();
        const { enqueueSnackbar } = useSnackbar();
        const [formData, setFormData] = React.useState({
                name: '',
                unit: '',
                description: '',
                photo: '',
                shelf: '',
                section: '',
                row: '',
                orderQuantity: '',
                quantity: '',
                supplier: '',
                purchaseAmount: '',
                arrivalDate: dayjs().format('YYYY-MM-DD'),
                expiryDate: '',
        });

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
                mutate(payload, {
                        onSuccess: () => {
                                enqueueSnackbar("Dori muvaffaqiyatli qo‘shildi!", { variant: "success" });
                                setTimeout(() => {
                                        navigate('/drug');
                                }, 2000)
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
                                        <Button variant="outlined" onClick={() => navigate(-1)}>
                                                Orqaga
                                        </Button>
                                </Box>
                                <Typography variant="h5" component="h1">
                                        Yangi dori qo‘shish
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {/* === Основная информация === */}
                                        <Typography variant="subtitle1">Asosiy ma'lumotlar</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={6}>
                                                        <TextField label="Nomi" name="name" required fullWidth onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={6}>
                                                        <TextField label="O‘lchov birligi" name="unit" required fullWidth onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={6}>
                                                        <TextField label="Yetkazib beruvchi" name="supplier" required fullWidth onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
<Grid item xs={12}>
                                                        <TextField label="Tavsif" name="description" fullWidth onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
<Grid item xs={12}>
                                                        <TextField label="Rasm URL" name="photo" fullWidth onChange={handleChange} />
                                                </Grid>
                                        </Grid>

                                        {/* === Sklad joylashuvi === */}
                                        <Typography variant="subtitle1" mt={2}>Sklad joylashuvi</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={4}>
                                                        <TextField label="Shkaf" name="shelf" required fullWidth onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={4}>
                                                        <TextField label="Polka" name="section" required fullWidth onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={4}>
                                                        <TextField label="Qator" name="row" type="number" required fullWidth onChange={handleChange} />
                                                </Grid>
                                        </Grid>

                                        {/* === Miqdor va sotib olish === */}
                                        <Typography variant="subtitle1" mt={2}>Miqdor va xarid</Typography>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={4}>
                                                        <TextField label="Miqdor" name="quantity" type="number" required fullWidth onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={4}>
                                                        <TextField label="Avto buyurtma miqdori" name="orderQuantity" type="number" fullWidth value={formData.orderQuantity} onChange={handleChange} />
                                                </Grid>
                                                {/* @ts-ignore*/}
<Grid item xs={12} sm={4}>
                                                        <TextField label="Sotib olish narxi" name="purchaseAmount" type="number" required fullWidth onChange={handleChange} />
                                                </Grid>
                                        </Grid>

                                        {/* === Sanalar === */}
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
                                                                onChange={handleChange}
                                                        />
                                                </Grid>
                                        </Grid>

                                        <Button loading={isPending} type="submit" variant="contained">
                                                Saqlash
                                        </Button>
                                </Box>
                        </Card>
                </Container>
        );
}
