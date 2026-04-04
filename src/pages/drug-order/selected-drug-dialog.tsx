import {
        useCreateDraftOrder,
        useDeleteAllDraftOrders,
        useDeleteDraftOrderById,
        useGetAllDraftOrders,
        useSyncDraftOrders,
} from "@/features/draft-order";
import {
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button,
        List,
        ListItem,
        ListItemText,
        CircularProgress,
        IconButton,
        TextField,
        Select,
        MenuItem,
        Stack,
        useMediaQuery,
        useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { useState } from "react";

const SelectedDrugsDialog = ({ open, onClose }: any) => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

        const { enqueueSnackbar } = useSnackbar();
        const { mutate: createDraftOrder } = useCreateDraftOrder();
        const { data: drafts, isLoading } = useGetAllDraftOrders();
        const { mutate: deleteAllDrafts, isPending: isDeletingAll } = useDeleteAllDraftOrders();
        const { mutate: deleteDraftById } = useDeleteDraftOrderById();
        const { mutate: syncDrugs, isPending: isSyncing } = useSyncDraftOrders();

        const [amounts, setAmounts] = useState<Record<number, number>>({});
        const [units, setUnits] = useState<Record<number, string>>({});

        const handleAmountChange = (
                id: number,
                drugId: number,
                quantity: number,
                unit: string
        ) => {
                setAmounts((prev) => ({ ...prev, [id]: quantity }));
                createDraftOrder({ drugId, quantity, unit });
        };

        const handleUnitChange = (
                id: number,
                drugId: number,
                quantity: number,
                newUnit: string
        ) => {
                setUnits((prev) => ({ ...prev, [id]: newUnit }));
                createDraftOrder({ drugId, quantity, unit: newUnit });
        };

        const handleDeleteAll = () => {
                deleteAllDrafts(undefined, {
                        onSuccess: () => enqueueSnackbar("Барча қораловлар ўчирилди", { variant: "success" }),
                        onError: (err: any) =>
                                enqueueSnackbar(err?.response?.data?.message || "Ўчиришда хатолик", { variant: "error" }),
                });
        };

        const handleDeleteOne = (id: number) => {
                deleteDraftById(id, {
                        onSuccess: () => enqueueSnackbar("Ўчирилди", { variant: "success" }),
                        onError: (err: any) =>
                                enqueueSnackbar(err?.response?.data?.message || "Ўчиришда хатолик", { variant: "error" }),
                });
        };

        const handleSync = () => {
                syncDrugs(undefined, {
                        onError: (err: any) =>
                                enqueueSnackbar(err?.response?.data?.message || "Юборишда хатолик", { variant: "error" }),
                });
                enqueueSnackbar("Муваффақиятли юборилди", { variant: "success" })
        };

        return (
                <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                        <DialogTitle>Сканер қилинган дори воситалари</DialogTitle>
                        <DialogContent dividers>
                                {isLoading ? (
                                        <CircularProgress />
                                ) : (
                                        <List>
                                                {drafts?.map((draft: any) => (
                                                        <ListItem
                                                                key={draft.id}
                                                                alignItems="flex-start"
                                                                secondaryAction={
                                                                        <IconButton edge="end" onClick={() => handleDeleteOne(draft.id)}>
                                                                                <DeleteIcon />
                                                                        </IconButton>
                                                                }
                                                                sx={{ flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center" }}
                                                        >
                                                                <ListItemText
                                                                        primary={`${draft.name} — ${draft.quantity} ${draft.unit}`}
                                                                        secondary={`Категория: ${draft.category}`}
                                                                />
                                                                <Stack
                                                                        direction={isMobile ? "column" : "row"}
                                                                        spacing={1}
                                                                        sx={{ marginTop: isMobile ? 1 : 0, marginLeft: isMobile ? 0 : 2, width: isMobile ? "100%" : "auto" }}
                                                                >
                                                                        <TextField
                                                                                type="number"
                                                                                size="small"
                                                                                label="Миқдор"
                                                                                value={(amounts[draft.id] ?? draft.quantity) || ""}
                                                                                onChange={(e) =>
                                                                                        handleAmountChange(
                                                                                                draft.id,
                                                                                                draft.drugId,
                                                                                                Number(e.target.value),
                                                                                                units[draft.id] ?? draft.unit
                                                                                        )
                                                                                }
                                                                                inputProps={{ min: 1 }}
                                                                                fullWidth={isMobile}
                                                                        />
                                                                        <Select
                                                                                size="small"
                                                                                value={units[draft.id] ?? draft.unit}
                                                                                onChange={(e) =>
                                                                                        handleUnitChange(
                                                                                                draft.id,
                                                                                                draft.drugId,
                                                                                                amounts[draft.id] ?? draft.quantity,
                                                                                                e.target.value
                                                                                        )
                                                                                }
                                                                                fullWidth={isMobile}
                                                                        >
                                                                                <MenuItem value="штук">штук</MenuItem>
                                                                                <MenuItem value="упаковка">упаковка</MenuItem>
                                                                        </Select>
                                                                </Stack>
                                                        </ListItem>
                                                ))}
                                        </List>
                                )}
                        </DialogContent>
                        <DialogActions sx={{ flexDirection: isMobile ? "column" : "row", gap: 1, p: 2 }}>
                                <Button
                                        fullWidth={isMobile}
                                        variant="contained"
                                        color="success"
                                        onClick={() => window.location.reload()}
                                        disabled={isSyncing}
                                >
                                        {isSyncing ? "Юкланмоқда..." : "Янгилаш"}
                                </Button>
                                <Button
                                        fullWidth={isMobile}
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                >
                                        {isSyncing ? "Юкланмоқда..." : "Telegram’га юбориш"}
                                </Button>
                                <Button
                                        fullWidth={isMobile}
                                        variant="contained"
                                        color="error"
                                        onClick={handleDeleteAll}
                                        disabled={isDeletingAll}
                                >
                                        {isDeletingAll ? "Ўчирилмоқда..." : "Ҳаммасини ўчириш"}
                                </Button>
                                <Button fullWidth={isMobile} onClick={onClose}>
                                        Ёпиш
                                </Button>
                        </DialogActions>
                </Dialog>
        );
};

export default SelectedDrugsDialog;
