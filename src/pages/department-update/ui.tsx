import React, { useEffect, useState, useRef } from 'react';
import {
        Box, Button, TextField, Typography, Stack, Card as MuiCard,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import ColorModeIconDropdown from '@/shared/ui/color-mode-dropdown';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// Заменить на реальные хуки или запросы для работы с department
import { useDepartmentById, useUpdateDepartment, useDeleteDepartment } from '@/features/department';

const Card = styled(MuiCard)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        margin: 'auto',
        [theme.breakpoints.up('sm')]: { maxWidth: '600px' },
}));

const Container = styled(Stack)(({ theme }) => ({
        height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
        padding: theme.spacing(2),
        position: 'relative',
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

export default function DepartmentUpdateDeletePage() {
        const { id = 0 } = useParams<{ id: string }>();
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
        const navigate = useNavigate();

        const { data, isLoading, error } = useDepartmentById(+id);
        const updateDepartment = useUpdateDepartment(+id);
        const deleteDepartment = useDeleteDepartment(+id);

        const [name, setName] = useState('');
        const timeoutRef = useRef<any>(null);

        useEffect(() => {
                if (data) {
                        setName(data.name || '');
                }
        }, [data]);

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                const snackbarKey = enqueueSnackbar('Обновление отдела через 5 секунд...', {
                        variant: 'info',
                        action: (key) => (
                                <Button color="inherit" onClick={() => {
                                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                        closeSnackbar(key);
                                        enqueueSnackbar('Обновление отменено', { variant: 'warning' });
                                }}>
                                        Отмена
                                </Button>
                        )
                });

                timeoutRef.current = setTimeout(() => {
                        updateDepartment.mutate({ name }, {
                                onSuccess: () => {
                                        closeSnackbar(snackbarKey);
                                        enqueueSnackbar('Отдел успешно обновлен!', { variant: 'success' });
                                        navigate('/departments');
                                },
                                onError: () => {
                                        enqueueSnackbar('Ошибка при обновлении!', { variant: 'error' });
                                }
                        });
                }, 5000);
        };

        const handleDelete = () => {
                const snackbarKey = enqueueSnackbar('Удаление отдела через 5 секунд...', {
                        variant: 'error',
                        action: (key) => (
                                <Button color="inherit" onClick={() => {
                                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                        closeSnackbar(key);
                                        enqueueSnackbar('Удаление отменено', { variant: 'info' });
                                }}>
                                        Отмена
                                </Button>
                        )
                });

                timeoutRef.current = setTimeout(() => {
                        deleteDepartment.mutate(undefined, {
                                onSuccess: () => {
                                        closeSnackbar(snackbarKey);
                                        enqueueSnackbar('Отдел удален!', { variant: 'success' });
                                        navigate('/departments');
                                },
                                onError: () => {
                                        enqueueSnackbar('Ошибка при удалении!', { variant: 'error' });
                                }
                        });
                }, 5000);
        };

        if (isLoading) {
                return (
                        <Container direction="column" justifyContent="center">
                                <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                                <Card variant="outlined">
                                        <Typography variant="h5">Загрузка...</Typography>
                                </Card>
                        </Container>
                );
        }

        if (error) {
                return (
                        <Container direction="column" justifyContent="center">
                                <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                                <Card variant="outlined">
                                        <Typography variant="h5">Произошла ошибка!</Typography>
                                        <Button variant="contained" onClick={() => navigate(-1)}>Назад</Button>
                                </Card>
                        </Container>
                );
        }

        return (
                <Container direction="column" justifyContent="center">
                        <ColorModeIconDropdown sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
                        <Card variant="outlined" sx={{ overflowY: 'auto' }}>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Button variant="outlined" onClick={() => navigate(-1)}>Назад</Button>
                                        <Button variant="contained" color="error" onClick={handleDelete}>Удалить</Button>
                                </Box>

                                <Typography variant="h5" mb={2}>Bo'limni yangilash</Typography>

                                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Grid container spacing={2}>
                                                {/* @ts-ignore */}
                                                <Grid item xs={12}>
                                                        <TextField
                                                                label="Название отдела"
                                                                name="name"
                                                                required
                                                                fullWidth
                                                                value={name}
                                                                onChange={(e) => setName(e.target.value)}
                                                        />
                                                </Grid>
                                        </Grid>

                                        <Button type="submit" variant="contained">Обновить</Button>
                                </Box>
                        </Card>
                </Container>
        );
}
