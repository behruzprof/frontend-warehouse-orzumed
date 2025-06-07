import {
    Box, Button, Typography, TextField, Autocomplete
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/shared/constants/app-route";
import { useState } from "react";
import { useDrugList } from "@/features/drug";
import { useCreateDrugRequest } from "@/features/drug-request";
import { useSnackbar } from "notistack";
import { getDepartmentIdFromLocalStorage, getRoleFromLocalStorage, Roles } from "@/shared/helpers/get-department-id";
import { useDepartmentList } from "@/features/department";
import QRScannerComponent from "@/shared/ui/qr-scanner";

type SelectedDrug = {
    id: string;
    name: string;
    availableQuantity: number;
    transferQuantity: number | "";
};

const role = getRoleFromLocalStorage();
const departmentId = getDepartmentIdFromLocalStorage();
const isAdmin = role === Roles.ADMIN;

const TransferDrugPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { data: departments, isLoading: isDepartmentsLoading } = useDepartmentList();
    const [selectedDrugs, setSelectedDrugs] = useState<SelectedDrug[]>([]);
    const { mutateAsync: createRequest, isPending } = useCreateDrugRequest();
    const localDepartmentId = getDepartmentIdFromLocalStorage();
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(isAdmin ? "" : localDepartmentId);
    const { data: drugs } = useDrugList();
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const handleAddDrug = (drug: any) => {
        setSelectedDrugs((prev) => {
            const exists = prev.find(d => d.id === drug.id);
            if (exists) return prev;
            return [
                ...prev,
                {
                    id: drug.id,
                    name: drug.name,
                    availableQuantity: drug.quantity,
                    transferQuantity: ""
                }
            ];
        });
    };

    const handleTransfer = async () => {
        const invalidDrug = selectedDrugs.find(drug =>
            typeof drug.transferQuantity === "number" &&
            drug.transferQuantity > drug.availableQuantity
        );

        if (invalidDrug) {
            enqueueSnackbar(
                `Dori "${invalidDrug.name}" uchun miqdor mavjud emas. Maksimal omborda: ${invalidDrug.availableQuantity}`,
                { variant: 'error' }
            );
            return;
        }

        if (!selectedDepartmentId) {
            enqueueSnackbar("Iltimos, bo'limni tanlang.", { variant: 'error' });
            return;
        }

        try {
            const payload = selectedDrugs.map(drug => ({
                departmentId: +selectedDepartmentId,
                drugId: +drug.id,
                quantity: Number(drug.transferQuantity) || 0,
            }));

            await createRequest(payload);

            enqueueSnackbar("Muvaffaqiyatli o'tkazildi!", { variant: 'success' });
            setSelectedDrugs([]);
        } catch (error: any) {
            console.error("Xatolik yuz berdi:", error);
            const message = error?.response?.data?.message || "Xatolik yuz berdi!";
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const updateQuantity = (id: string, value: number) => {
        setSelectedDrugs(prev =>
            prev.map(drug =>
                drug.id === id
                    ? { ...drug, transferQuantity: isNaN(value) || value < 1 ? "" : value }
                    : drug
            )
        );
    };

    const handleReturn = (drugId: string) => {
        setSelectedDrugs(prev => prev.filter(drug => drug.id !== drugId));
    };

    const handleScan = (data: string | null) => {
        if (!data) return;

        const [idStr, quantityStr] = data.split(";");
        const id = idStr?.trim();
        const quantity = parseInt(quantityStr?.trim());

        if (!id || isNaN(quantity)) {
            enqueueSnackbar("QR kod noto‘g‘ri formatda.", { variant: "error" });
            return;
        }

        const drug = drugs?.find(d => d.id.toString() === id);
        if (!drug) {
            enqueueSnackbar("Bunday dori topilmadi.", { variant: "error" });
            return;
        }

        setSelectedDrugs((prev) => {
            const exists = prev.find(d => d.id === drug.id.toString());
            if (exists) {
                enqueueSnackbar(`"${drug.name}" miqdori yangilandi`, { variant: "info" });
                return prev.map(d =>
                    d.id === drug.id.toString()
                        ? { ...d, transferQuantity: Math.min(quantity, drug.quantity) }
                        : d
                );
            } else {
                enqueueSnackbar(`"${drug.name}" qo‘shildi`, { variant: "success" });
                return [
                    ...prev,
                    {
                        id: drug.id.toString(),
                        name: drug.name,
                        availableQuantity: drug.quantity,
                        transferQuantity: Math.min(quantity, drug.quantity)
                    }
                ];
            }
        });

        setIsScannerOpen(false);
    };

    return (
        <Box sx={{ maxWidth: 800, width: "100%", mx: "auto", mt: 4 }}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent={{ xs: "center", md: "space-between" }} mb={3}>
                <Typography variant="h5" mb={2}>Dori vositalarini o'tkazish</Typography>
                <Box display="flex" alignItems="center">
                    <Button variant="contained" size="medium" color="secondary" sx={{ ml: 1 }} onClick={() => navigate(-1)}>
                        Ortga qaytish
                    </Button>
                    <Button variant="contained" size="medium" color="success" sx={{ ml: 1 }} onClick={() => navigate(`${APP_ROUTES.REQUIREMENT_DRUG}/list`)}>
                        Talabnomalar ro'yxati
                    </Button>
                </Box>
            </Box>

            {isAdmin ? (
                <Box mb={3}>
                    <Autocomplete
                        options={departments || []}
                        getOptionLabel={(option) => option.name}
                        // @ts-ignore
                        onChange={(_, value) => setSelectedDepartmentId(value?.id || "")}
                        renderInput={(params) => (
                            <TextField {...params} label="Bo‘limni tanlang" variant="outlined" fullWidth />
                        )}
                        loading={isDepartmentsLoading}
                    />
                </Box>
            ) : (
                <Typography variant="h5" mb={2}>
                    Bo'lim nomi: {departments?.find(dep => dep.id === +departmentId)?.name || "Noma'lum"}
                </Typography>
            )}

            <DrugAutocomplete onSelect={handleAddDrug} />

            <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsScannerOpen(true)}
                sx={{ my: 2, display: { md: "none" } }}
                
            >
                QR kodni skanerlash
            </Button>

            {
                isScannerOpen && (
                    <Button sx={{ display: { md: "none" } }} variant="contained" color="error" onClick={() => setIsScannerOpen(false)}>
                        Yopish
                    </Button>
                )
            }

            {isScannerOpen && (
                <Box sx={{ display: { md: "none" }, mb: 2 }}>
                    <QRScannerComponent
                        onScan={handleScan}
                        onClose={() => setIsScannerOpen(false)}
                    />
                </Box>
            )}

            <Box mt={3}>
                {selectedDrugs.map(drug => (
                    <Box
                        key={drug.id}
                        sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, border: "1px solid #ccc", p: 2, borderRadius: 2 }}
                    >
                        <Typography sx={{ flexGrow: 1 }}>
                            {drug.name} (Omborda: {drug.availableQuantity})
                        </Typography>
                        <TextField
                            type="number"
                            label="Miqdori"
                            value={drug.transferQuantity ?? ""}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                updateQuantity(drug.id, newValue);
                            }}
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
                disabled={selectedDrugs.length === 0 || isPending}
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
                    <TextField {...params} label="Dori nomini qidiring" variant="outlined" fullWidth />
                )}
            />
            {isLoading && <Typography mt={1}>Yuklanmoqda...</Typography>}
        </>
    );
};

export default TransferDrugPage;
