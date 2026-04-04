import { Button } from "@mui/material";

const ScannerButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="outlined" onClick={onClick}>
      QR orqali qo‘shish
    </Button>
  );
};

export default ScannerButton;