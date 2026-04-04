import { Box, Button, Select, MenuItem, TextField, Typography } from "@mui/material";

const DrugItem = ({
  drug,
  inputVisible,
  selectedAmount,
  selectedUnit,
  onToggleInput,
  onAmountChange,
  onUnitChange,
  isCritical,
  isWarning,
  theme,
}: any) => {
  let bgColor = theme.palette.background.default;
  if (isCritical) bgColor = theme.palette.error.light;
  else if (isWarning) bgColor = theme.palette.warning.light;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column", // мобильные устройства
          sm: "row",    // планшеты и выше
        },
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
        p: 2,
        mb: 1,
        borderRadius: 2,
        backgroundColor: bgColor,
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="subtitle1">{drug.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Mavjud: {drug.quantity}, Min: {drug.minStock}, Max: {drug.maxStock}
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection={{
          xs: "column", // на мобильных — вертикально
          sm: "row",    // на планшетах и выше — горизонтально
        }}
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        gap={1.5}
      >
        {inputVisible ? (
          <>
            <TextField
              type="number"
              size="small"
              value={selectedAmount || ""}
              onChange={(e) => onAmountChange(drug.id, e.target.value)}
              inputProps={{ min: 1, max: drug.maxStock }}
              sx={{ width: { xs: "100%", sm: "100" } }}
            />
            <Select
              size="small"
              value={selectedUnit || "штук"}
              onChange={(e) => onUnitChange(drug.id, e.target.value)}
              sx={{ width: { xs: "100%", sm: 100 } }}
            >
              <MenuItem value="штук">штук</MenuItem>
              <MenuItem value="упаковка">упаковка</MenuItem>
            </Select>
          </>
        ) : (
          <Typography variant="body2">
            {selectedAmount > 0 ? `Buyurtma: ${selectedAmount}` : "Buyurtma kiritilmagan"}
          </Typography>
        )}
        <Button
          variant={inputVisible ? "contained" : "outlined"}
          size="small"
          onClick={() => onToggleInput(drug.id)}
          fullWidth={true}
          sx={{ maxWidth: { xs: "100%", sm: "auto" } }}
        >
          {inputVisible ? "OK" : "+"}
        </Button>
      </Box>
    </Box>
  );
};

export default DrugItem;
