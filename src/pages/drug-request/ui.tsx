import {
        Box, Button, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/app-route";
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { useDrugList } from "@/features/drug";
import { useCreateDrugRequest } from "@/features/drug-request";
import { useSnackbar } from "notistack";

type SelectedDrug = {
        id: string;
        name: string;
        availableQuantity: number;
        transferQuantity: number;
};

const TransferDrugPage = () => {
        const navigate = useNavigate();
        const { enqueueSnackbar } = useSnackbar();
        const [selectedDrugs, setSelectedDrugs] = useState<SelectedDrug[]>([]);
        const { mutateAsync: createRequest } = useCreateDrugRequest();
        const departmentId = "1";

        const handleAddDrug = (drug: any) => {
                setSelectedDrugs((prev) => {
                        const exists = prev.find(d => d.id === drug.id);
                        if (exists) return prev;
                        return [...prev, { ...drug, transferQuantity: 1 }];
                });
        };

        const handleTransfer = async () => {
                try {
                        await Promise.all(
                                selectedDrugs.map(drug =>
                                        createRequest({
                                                departmentId: +departmentId,
                                                drugId: +drug.id,
                                                quantity: drug.transferQuantity,
                                                 // @ts-ignore
                                                status: "issued",
                                                patientName: "Ichki o'tkazma",
                                        })
                                )
                        );
                        enqueueSnackbar("Muvaffaqiyatli o'tkazildi!", { variant: 'success' }); // ✅ успех
                        setSelectedDrugs([]);
                } catch (error: any) {
                        console.error("Xatolik yuz berdi:", error);
                        const message = error?.response?.data?.message || "Xatolik yuz berdi!";
                        enqueueSnackbar(message, { variant: 'error' }); // ❌ ошибка
                }
        };
        const updateQuantity = (id: string, value: number) => {
                setSelectedDrugs(prev => prev.map(drug => drug.id === id ? { ...drug, transferQuantity: value } : drug));
        };

        const handleReturn = (drugId: string) => {
                setSelectedDrugs(prev => prev.filter(drug => drug.id !== drugId));
        };

        return (
                <Box sx={{ maxWidth: 800, width: "100%", mx: "auto", mt: 4, overflowY: "auto" }}>
                        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent={{ xs: "center", md: "space-between" }} mb={3}>
                                <Typography variant="h5" mb={2}>Dori vositalarini o'tkazish</Typography>
                                <Box display="flex" alignItems="center">
                                        <Button
                                                variant="contained"
                                                size="medium"
                                                color="secondary"
                                                sx={{ ml: 1 }}
                                                onClick={() => navigate(-1)}
                                        >
                                                Ortga qaytish
                                        </Button>
                                        <Button
                                                variant="contained"
                                                size="medium"
                                                color="success"
                                                sx={{ ml: 1 }}
                                                onClick={() => navigate(`${APP_ROUTES.REQUIREMENT_DRUG}/list`)}
                                        >
                                                Talabnomalar ro'yxati
                                        </Button>
                                </Box>
                        </Box>

                        <DrugAutocomplete onSelect={handleAddDrug} />

                        <Box mt={3}>
                                {selectedDrugs.map(drug => (
                                        <Box
                                                key={drug.id}
                                                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, border: "1px solid #ccc", p: 2, borderRadius: 2 }}
                                        >
                                                <Typography sx={{ flexGrow: 1 }}>{drug.name}</Typography>
                                                <TextField
                                                        type="number"
                                                        label="Miqdori"
                                                        value={drug.transferQuantity}
                                                        onChange={(e) => updateQuantity(drug.id, parseInt(e.target.value))}
                                                        inputProps={{ min: 1, max: drug.availableQuantity }}
                                                        size="small"
                                                />
                                                <Button color="error" variant="contained" onClick={() => handleReturn(drug.id)}>
                                                        Olib tashlash
                                                </Button>
                                        </Box>
                                ))}
                        </Box>

                        <Button
                                variant="contained"
                                size="large"
                                color="warning"
                                onClick={handleTransfer}
                                disabled={selectedDrugs.length === 0}
                        >
                                O'z xisobimga o'tkazish
                        </Button>
                </Box>
        );
};



const DrugAutocomplete = ({ onSelect }: { onSelect: (drug: any) => void }) => {
        const { data: drugs, isLoading } = useDrugList();

        return (
                <>
                        <Autocomplete
                                options={drugs ?? []}
                                getOptionLabel={(option) => option.name}
                                onChange={(_, value) => value && onSelect(value)}
                                renderInput={(params) => (
                                        <TextField
                                                {...params}
                                                label="Dori nomini qidiring"
                                                variant="outlined"
                                                fullWidth
                                        />
                                )}
                        />
                        {isLoading && <Typography mt={1}>Yuklanmoqda...</Typography>}
                </>
        );
};


export default TransferDrugPage;
