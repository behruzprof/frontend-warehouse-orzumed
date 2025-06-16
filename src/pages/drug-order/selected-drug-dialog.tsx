import {
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button,
        List,
        ListItem,
        ListItemText,
} from "@mui/material";

const SelectedDrugsDialog = ({ open, onClose, selectedDrugs, drugs, selectedUnits }: any) => (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Tanlangan dorilar</DialogTitle>
                <DialogContent dividers>
                        <List>
                                {Object.entries(selectedDrugs).map(([id, amount]) => {
                                        // @ts-ignore
                                        const drug = drugs?.find((d) => d.id === Number(id));
                                        if (!drug) return null;
                                        return (
                                                <ListItem key={id}>
                                                        <ListItemText
                                                                primary={`${drug.name} - ${amount} ${selectedUnits[drug.id] || "штук"}`}
                                                                secondary={`ID: ${drug.id}`}
                                                        />
                                                </ListItem>
                                        );
                                })}
                        </List>
                </DialogContent>
                <DialogActions>
                        <Button onClick={onClose}>Yopish</Button>
                </DialogActions>
        </Dialog>
);

export default SelectedDrugsDialog;
