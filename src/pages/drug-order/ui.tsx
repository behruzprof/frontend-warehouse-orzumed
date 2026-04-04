import {
        Box,
        Button,
        CircularProgress,
        Typography,
        Backdrop,
        CssBaseline,
        OutlinedInput,
        InputAdornment,
        FormControl,
        Pagination,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useDrugList } from "@/features/drug";
import { useCreateDrugOrder } from "@/features/drug-order";
import { useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { useSnackbar } from "notistack";
import QRScannerComponent from "@/shared/ui/qr-scanner/scanner2";
import ScannerButton from "./scanner-button";
import DrugList from "./drug-list";
import SelectedDrugsDialog from "./selected-drug-dialog";
import { useCreateDraftOrder } from "@/features/draft-order";

const ITEMS_PER_PAGE = 10;

const DrugOrderPage = () => {
        const { data: drugs, isLoading, error } = useDrugList();
        const { mutate: createDrugOrder } = useCreateDrugOrder();
        const { mutate: createDraftOrder } = useCreateDraftOrder();
        const { enqueueSnackbar } = useSnackbar();

        const [searchTerm, setSearchTerm] = useState("");
        const [selectedDrugs, setSelectedDrugs] = useState<Record<number, number>>({});
        const [showInputs, setShowInputs] = useState<Record<number, boolean>>({});
        const [selectedUnits, setSelectedUnits] = useState<Record<number, string>>({});
        const [page, setPage] = useState(1);
        const [isScannerOpen, setIsScannerOpen] = useState(false);
        const [isDialogOpen, setIsDialogOpen] = useState(false);

        const handleSearch = debounce((value: string) => {
                setSearchTerm(value.toLowerCase().trim());
                setPage(1);
        }, 300);

        const filteredDrugs = useMemo(() => {
                if (!drugs) return [];
                return drugs
                        .filter((drug) => drug.name.toLowerCase().includes(searchTerm))
                        .sort((a, b) => {
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

        const handleAmountChange = (id: number, value: string) => {
                const amount = Math.max(0, Number(value));
                setSelectedDrugs((prev) => ({ ...prev, [id]: amount }));
        };

        const toggleInput = (id: number) => {
                setShowInputs((prev) => ({ ...prev, [id]: !prev[id] }));
        };

        const handleSubmitOrder = () => {
                const orderList = Object.entries(selectedDrugs)
                        .map(([id, amount]) => {
                                const drugId = Number(id);
                                const drug = drugs?.find((d) => d.id === drugId);
                                if (!drug || !amount) return null;
                                const unit = selectedUnits[drugId] || "штук";
                                return { name: drug.name, amount, unit, category: drug.category };
                        })
                        .filter(Boolean);

                if (!orderList.length) {
                        enqueueSnackbar("Buyurtma uchun dori tanlanmadi yoki noto'g'ri miqdor", {
                                variant: "warning",
                        });
                        return;
                }

                // @ts-ignore
                createDrugOrder(orderList, {
                        onSuccess: () => {
                                enqueueSnackbar("Buyurtma muvaffaqiyatli yuborildi", { variant: "success" });
                                setSelectedDrugs({});
                                setShowInputs({});
                        },
                        onError: () => {
                                enqueueSnackbar("Buyurtma yuborishda xatolik yuz berdi", { variant: "error" });
                        },
                });
        };

        const handleScan = (scanned: { id: string; unit: string; amount: number } | null) => {
                if (!scanned) return;

                const drugId = Number(scanned.id);
                const drug = drugs?.find((d) => d.id === drugId);

                if (!drug) {
                        enqueueSnackbar("Dori topilmadi", { variant: "error" });
                        return;
                }

                if (scanned.amount <= 0) {
                        enqueueSnackbar("Buyurtma miqdori noto'g'ri", { variant: "warning" });
                        return;
                }

                // Создание черновика заказа
                createDraftOrder(
                        {
                                drugId,
                                quantity: scanned.amount,
                                unit: scanned.unit,
                        },
                        {
                                onSuccess: () => {
                                        setSelectedDrugs((prev) => ({ ...prev, [drug.id]: scanned.amount }));
                                        setSelectedUnits((prev) => ({ ...prev, [drug.id]: scanned.unit }));
                                        setShowInputs((prev) => ({ ...prev, [drug.id]: true }));
                                },
                                onError: () => {
                                        enqueueSnackbar("Draft buyurtma yaratishda xatolik", { variant: "error" });
                                },
                        }
                );
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
                <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 4 }}>
                        <CssBaseline />
                        <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                flexDirection={{ xs: "column", sm: "row" }}
                                gap={2}
                                mb={2}
                        >
                                <Typography variant="h5">Dori buyurtma sahifasi</Typography>

                                <Box
                                        display="flex"
                                        flexWrap="wrap"
                                        gap={1}
                                        justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                                >
                                        <ScannerButton onClick={() => setIsScannerOpen(true)} />
                                        <Button variant="outlined" onClick={() => setIsDialogOpen(true)}>
                                                Tanlangan dorilar
                                        </Button>
                                        {Object.values(selectedDrugs).some((v) => v > 0) && (
                                                <Button variant="contained" onClick={handleSubmitOrder}>
                                                        Jo'natish
                                                </Button>
                                        )}
                                </Box>
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

                        <DrugList
                                drugs={paginatedDrugs}
                                selectedDrugs={selectedDrugs}
                                selectedUnits={selectedUnits}
                                showInputs={showInputs}
                                onAmountChange={handleAmountChange}
                                onToggleInput={toggleInput}
                                onUnitChange={(id: number, value: string) =>
                                        setSelectedUnits((prev) => ({ ...prev, [id]: value }))
                                }
                        />

                        <Box mt={3} display="flex" justifyContent="center">
                                <Pagination
                                        count={Math.ceil(filteredDrugs.length / ITEMS_PER_PAGE)}
                                        page={page}
                                        onChange={(_, value) => setPage(value)}
                                />
                        </Box>

                        {isScannerOpen && (
                                <QRScannerComponent onScan={handleScan} onClose={() => setIsScannerOpen(false)} />
                        )}

                        <SelectedDrugsDialog
                                open={isDialogOpen}
                                onClose={() => setIsDialogOpen(false)}
                                selectedDrugs={selectedDrugs}
                                selectedUnits={selectedUnits}
                                drugs={drugs}
                        />
                </Box>
        );
};

export default DrugOrderPage;