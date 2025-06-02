import {
        Box,
        Button,
        CircularProgress,
        Typography,
        Backdrop,
        FormControl,
        InputAdornment,
        OutlinedInput,
        TextField,
        Pagination,
        useTheme,
        CssBaseline
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useDrugList } from "@/features/drug";
import { useCreateDrugOrder } from "@/features/drug-order";
import { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { useSnackbar } from 'notistack';

const ITEMS_PER_PAGE = 10;

const DrugOrderPage = () => {
        const { data: drugs, isLoading, error } = useDrugList();
        const { mutate: createDrugOrder } = useCreateDrugOrder();
        const [searchTerm, setSearchTerm] = useState("");
        const [selectedDrugs, setSelectedDrugs] = useState<Record<number, number>>({});
        const [showInputs, setShowInputs] = useState<Record<number, boolean>>({});
        const [page, setPage] = useState(1);
        const theme = useTheme();
        const { enqueueSnackbar } = useSnackbar();

        const handleSearch = debounce((value: string) => {
                setSearchTerm(value.toLowerCase().trim());
                setPage(1); // Reset page on search
        }, 300);

        const filteredDrugs = useMemo(() => {
                if (!drugs) return [];
                const filtered = drugs.filter((drug) =>
                        drug.name.toLowerCase().includes(searchTerm)
                );
                return filtered.sort((a, b) => {
                        const aCritical = a.quantity <= a.minStock;
                        const bCritical = b.quantity <= b.minStock;
                        const aWarning = a.quantity - a.minStock <= 10;
                        const bWarning = b.quantity - b.minStock <= 10;

                        if (aCritical !== bCritical) return aCritical ? -1 : 1;
                        if (aWarning !== bWarning) return aWarning ? -1 : 1;
                        return a.name.localeCompare(b.name);
                });
        }, [drugs, searchTerm]);

        const paginatedDrugs = useMemo(() => {
                const start = (page - 1) * ITEMS_PER_PAGE;
                return filteredDrugs.slice(start, start + ITEMS_PER_PAGE);
        }, [filteredDrugs, page]);

        const handleAmountChange = (id: number, value: string, max: number, quantity: number) => {
                const inputAmount = Number(value);

                const maxOrderAmount = max - quantity;
                if (inputAmount > maxOrderAmount) {
                        enqueueSnackbar(`Buyurtma miqdori maksimal ruxsat etilgan limitdan oshmasligi kerak (${maxOrderAmount})`, { variant: 'warning' });
                        return;
                }

                const amount = Math.max(0, inputAmount); // Защита от отрицательных значений
                setSelectedDrugs((prev) => ({ ...prev, [id]: amount }));
        };

        const toggleInput = (id: number) => {
                setShowInputs((prev) => ({ ...prev, [id]: !prev[id] }));
        };

        const handleSubmitOrder = () => {
                const orderList = Object.entries(selectedDrugs)
                        .map(([id, amount]) => {
                                const drug = drugs?.find((d) => d.id === Number(id));
                                if (!drug || !amount) return null;
                                return {
                                        name: drug.name,
                                        amount,
                                        unit: "шт",
                                        category: drug.category,
                                };
                        })
                        .filter(Boolean);

                if (!orderList.length) {
                        enqueueSnackbar("Buyurtma uchun dori tanlanmadi yoki noto'g'ri miqdor", { variant: 'warning' });
                        return;
                }

                // @ts-ignore
                createDrugOrder(orderList, {
                        onSuccess: () => {
                                enqueueSnackbar("Buyurtma muvaffaqiyatli yuborildi", { variant: 'success' });
                                setSelectedDrugs({});
                                setShowInputs({});
                        },
                        onError: () => {
                                enqueueSnackbar("Buyurtma yuborishda xatolik yuz berdi", { variant: 'error' });
                        }
                });
        };

        if (isLoading) {
                return (
                        <Backdrop open>
                                <CircularProgress color="inherit" />
                        </Backdrop>
                );
        }

        if (error || !drugs) {
                return (
                        <Box textAlign="center" mt={10}>
                                <Typography variant="h6" color="error">
                                        Xatolik yuz berdi
                                </Typography>
                        </Box>
                );
        }

        return (
                <Box sx={{ maxWidth: "1200px", width: "100%", mx: "auto", mt: 4 }}>
                        <CssBaseline />
                        <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="h5">Dori buyurtma sahifasi</Typography>
                                <Button
                                        variant="contained"
                                        onClick={handleSubmitOrder}
                                        sx={{
                                                display: Object.values(selectedDrugs).every((val) => !val || val <= 0) ? "none" : "block"
                                        }}
                                >
                                        Jo'natish
                                </Button>
                        </Box>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                                <OutlinedInput
                                        placeholder="Dori nomi bilan qidirish"
                                        onChange={(e) => handleSearch(e.target.value)}
                                        startAdornment={
                                                <InputAdornment position="start">
                                                        <SearchRoundedIcon />
                                                </InputAdornment>
                                        }
                                />
                        </FormControl>

                        {paginatedDrugs.map((drug) => {
                                const isCritical = drug.quantity <= drug.minStock;
                                const isWarning = drug.quantity - drug.minStock <= 10 && !isCritical;
                                const selectedAmount = selectedDrugs[drug.id] || 0;
                                const inputVisible = showInputs[drug.id];

                                let bgColor = theme.palette.background.default;
                                if (isCritical) bgColor = theme.palette.error.light;
                                else if (isWarning) bgColor = theme.palette.warning.light;

                                return (
                                        <Box
                                                key={drug.id}
                                                sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        p: 2,
                                                        mb: 1,
                                                        borderRadius: 2,
                                                        backgroundColor: bgColor,
                                                }}
                                        >
                                                <Box>
                                                        <Typography variant="subtitle1">{drug.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                                Mavjud: {drug.quantity}, Min: {drug.minStock}, Max: {drug.maxStock}
                                                        </Typography>
                                                </Box>

                                                <Box display="flex" alignItems="center" gap={2}>
                                                        {inputVisible ? (
                                                                <TextField
                                                                        type="number"
                                                                        size="small"
                                                                        value={selectedAmount || ""}
                                                                        onChange={(e) =>
                                                                                handleAmountChange(drug.id, e.target.value, drug.maxStock, drug.quantity)
                                                                        }
                                                                        inputProps={{
                                                                                min: 1,
                                                                                max: drug.maxStock,
                                                                        }}
                                                                        sx={{ width: 100 }}
                                                                />
                                                        ) : (
                                                                <Typography variant="body2">
                                                                        {selectedAmount > 0 ? `Buyurtma: ${selectedAmount}` : 'Buyurtma kiritilmagan'}
                                                                </Typography>
                                                        )}

                                                        <Button
                                                                variant={inputVisible ? "contained" : "outlined"}
                                                                size="small"
                                                                onClick={() => toggleInput(drug.id)}
                                                        >
                                                                {inputVisible ? "OK" : "+"}
                                                        </Button>
                                                </Box>
                                        </Box>
                                );
                        })}

                        <Box mt={3} display="flex" justifyContent="center">
                                <Pagination
                                        count={Math.ceil(filteredDrugs.length / ITEMS_PER_PAGE)}
                                        page={page}
                                        onChange={(_, value) => setPage(value)}
                                        color="primary"
                                />
                        </Box>
                </Box>
        );
};

export default DrugOrderPage

