// DrugCreatePage.tsx
import * as React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";

import ColorModeIconDropdown from "@/shared/ui/color-mode-dropdown";
import { useCreateDrug } from "@/features/drug";
import type { CreateDrugDto } from "@/features/drug/types/drug";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "800px",
  },
}));

const Container = styled(Stack)(({ theme }) => ({
  height: "100dvh",
  padding: theme.spacing(2),
  "&::before": {
    content: '""',
    position: "absolute",
    zIndex: -1,
    inset: 0,
    background: "radial-gradient(circle at center, hsl(210, 100%, 97%), white)",
  },
}));

// ✅ ДОБАВЛЕНО: Массив новых категорий
const CATEGORIES = [
  "Таблетки",
  "Растворы",
  "Капельницы",
  "Инъекции",
  "Бошқалар"
];

export default function DrugCreatePage() {
  const { mutate, isPending } = useCreateDrug();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = React.useState<
    CreateDrugDto & { unit: string; IsStandard: boolean; costPerPiece: number; piece: number }
  >({
    name: "",
    unit: "pcs",
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    supplier: "",
    IsStandard: false,
    costPerPiece: 0,
    piece: 0,
    expiryDate: new Date().toISOString().split("T")[0],
    shelf: "",
    section: "",
    row: 0,
    category: "Таблетки", // ✅ ИЗМЕНЕНО: Значение по умолчанию
    paymentType: "НДС",
    arrivalDate: dayjs().format("YYYY-MM-DD"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const target = e.target as HTMLInputElement;
    const name = target.name!;
    let value: any = target.value;

    if (target.type === 'checkbox') {
      value = target.checked;
    } else if (["quantity", "minStock", "maxStock", "costPerPiece", "piece", "row"].includes(name)) {
      value = Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        enqueueSnackbar("Dori muvaffaqiyatli qo‘shildi!", {
          variant: "success",
        });
        setTimeout(() => navigate("/drug"), 2000);
      },
      onError: () => {
        enqueueSnackbar("Xatolik yuz berdi. Qayta urinib ko‘ring!", {
          variant: "error",
        });
      },
    });
  };

  return (
    <Container direction="column" justifyContent="center">
      <ColorModeIconDropdown
        sx={{ position: "fixed", top: "1rem", right: "1rem" }}
      />
      <Card sx={{ overflow: "auto" }} variant="outlined">
        <Box display="flex" justifyContent="flex-start">
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Orqaga
          </Button>
        </Box>
        <Typography variant="h5" component="h1">
          Yangi dori qo‘shish
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* Asosiy ma'lumotlar */}
          <Typography variant="subtitle1">Asosiy ma'lumotlar</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nomi"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Yetkazib beruvchi"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Kategoriya</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange as any}
                >
                  {/* ✅ ИЗМЕНЕНО: Используем наш новый массив */}
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={<Checkbox checked={formData.IsStandard} onChange={handleChange as any} name="IsStandard" color="primary" />}
                label="Standart dori (Bitimga qo'shish)"
              />
            </Grid>
          </Grid>

          {/* Xarid va miqdor */}
          <Typography variant="subtitle1">Miqdor va xarid</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Kelgan miqdor (dona)"
                name="piece"
                type="number"
                value={formData.piece || ""}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Dona narxi"
                name="costPerPiece"
                type="number"
                value={formData.costPerPiece || ""}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Umumiy miqdor"
                name="quantity"
                type="number"
                value={formData.quantity || ""}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth required>
                <InputLabel>O'lchov turi</InputLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange as any}
                >
                  <MenuItem value="pcs">Dona (Шт)</MenuItem>
                  <MenuItem value="ml">Millilitr (Мл)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth required>
                <InputLabel>To'lov turi</InputLabel>
                <Select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange as any}
                >
                  {["НДС", "КОРПОРАТИВ КАРТА", "НАКТ"].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 4 }}></Grid> {/* Пустой блок для выравнивания */}

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Minimal zaxira"
                name="minStock"
                type="number"
                value={formData.minStock || ""}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Maksimal zaxira"
                name="maxStock"
                type="number"
                value={formData.maxStock || ""}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          {/* Sklad joylashuvi */}
          <Typography variant="subtitle1">Sklad joylashuvi</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Shkaf"
                name="shelf"
                value={formData.shelf}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Polka"
                name="section"
                value={formData.section}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Qator"
                name="row"
                type="number"
                value={formData.row || ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box mt={3}>
            <Button type="submit" variant="contained" disabled={isPending}>
              Saqlash
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}