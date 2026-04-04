import { useTheme } from "@mui/material";
import DrugItem from "./drug-item";

const DrugList = ({
  drugs,
  selectedDrugs,
  selectedUnits,
  showInputs,
  onAmountChange,
  onToggleInput,
  onUnitChange,
}: any) => {
  const theme = useTheme();

  return drugs.map((drug: any) => {
    const isCritical = drug.quantity <= drug.minStock;
    const isWarning = drug.quantity - drug.minStock <= 10 && !isCritical;

    return (
      <DrugItem
        key={drug.id}
        drug={drug}
        theme={theme}
        isCritical={isCritical}
        isWarning={isWarning}
        selectedAmount={selectedDrugs[drug.id] || 0}
        selectedUnit={selectedUnits[drug.id]}
        inputVisible={showInputs[drug.id]}
        onAmountChange={onAmountChange}
        onToggleInput={onToggleInput}
        onUnitChange={onUnitChange}
      />
    );
  });
};

export default DrugList;
