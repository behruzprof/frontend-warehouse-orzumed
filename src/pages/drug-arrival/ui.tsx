import ColorModeIconDropdown from "@/shared/ui/color-mode-dropdown"
import DataGrid from "@/shared/ui/data-grid"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import {
        Backdrop,
        Box,
        Button,
        CircularProgress,
        FormControl,
        InputAdornment,
        OutlinedInput,
        Typography,
} from "@mui/material"
import type { GridColDef } from "@mui/x-data-grid"
import { useMemo, useState } from "react"
import debounce from "lodash.debounce"
import { Link, useNavigate } from "react-router-dom"
import { APP_ROUTES } from "@/shared/constants/app-route"
import { useDrugArrivals } from "@/features/drug-arrival"

export const columns: GridColDef[] = [
        { field: "supplier", headerName: "YETKAZIB BERUVCHI", flex: 1.5, minWidth: 200 },
        {
                field: "drugName",
                headerName: "DORI NOMI",
                flex: 1.5,
                minWidth: 200,
                renderCell: (params) => {
                        return params.row?.drug?.name || "Noma'lum";
                },
        },
        {
                field: "quantity",
                headerName: "DORI MIQDORI",
                headerAlign: "left",
                align: "left",
                flex: 1,
                minWidth: 120,
        },
        {
                field: "purchaseAmount",
                headerName: "DONA NARXI",
                headerAlign: "left",
                align: "left",
                flex: 1,
                minWidth: 120,
        },
        {
                field: "totalPrice",
                headerName: "TO'LIQ NARXI",
                headerAlign: "left",
                align: "left",
                flex: 1,
                minWidth: 120,
                renderCell: (params) => {
                        const { quantity = 0, purchaseAmount = 0 } = params.row || {};
                        const total = quantity * purchaseAmount;
                        return `${total.toLocaleString()} UZS`;
                },
        },
        {
                field: "paymentType",
                headerName: "TO'LOV TURI",
                headerAlign: "left",
                align: "left",
                flex: 1,
                minWidth: 120,
        },
        {
                field: "arrivalDate",
                headerName: "YETKAZIB BERILGAN SANASI",
                headerAlign: "left",
                align: "left",
                flex: 1,
                minWidth: 150,
        },
        {
                field: "expiryDate",
                headerName: "MUDDATI SANASI",
                headerAlign: "left",
                align: "left",
                flex: 1,
                minWidth: 150,
        },
        {
                field: "actions",
                headerName: "HARAKATLAR",
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                        <Button
                                size="small"
                                onClick={() => window.location.href = `${APP_ROUTES.ARRIVALS_DRUG}/update/${params.id}`}
                        >
                                <Typography variant="body2" color="primary">
                                        O'zgartirish
                                </Typography>
                        </Button>
                ),
                width: 120,
        }
]

const DrugArrivalPage = () => {
        const navigate = useNavigate()
        const { data: drugs, error, isLoading } = useDrugArrivals()
        const [searchTerm, setSearchTerm] = useState("")

        const handleSearch = debounce((value: string) => {
                setSearchTerm(value.toLowerCase().trim())
        }, 300)

        const handleRowClick = (params: any) => {
                navigate(`${APP_ROUTES.ARRIVALS_DRUG}/update/${params.id}`)
        }

        const filteredDrugs = useMemo(() => {
                if (!searchTerm) return drugs ?? []
                return (drugs ?? []).filter((drug) =>
                        drug.drug.name.toLowerCase().includes(searchTerm)
                )
        }, [drugs, searchTerm])

        if (isLoading) {
                return (
                        <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={true}>
                                <CircularProgress color="inherit" />
                        </Backdrop>
                )
        }

        if (error || !drugs) {
                return (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                                <Typography variant="h6" color="error">
                                        Xatolik yuz berdi
                                </Typography>
                        </Box>
                )
        }

        return (
                <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, mr: "20px" }}>
                        <Box
                                sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2,
                                }}
                        >
                                <Typography component="h2" variant="h6" sx={{ my: 2 }}>
                                        DORILARNI KIRGAZISH
                                </Typography>

                                <Box sx={{ display: "flex", gap: 2 }}>
                                        <FormControl sx={{ width: { xs: "100%", md: "25ch" } }} variant="outlined">
                                                <OutlinedInput
                                                        size="small"
                                                        id="search"
                                                        placeholder="DORI NOMI ORQALI QIDIRISH"
                                                        sx={{ flexGrow: 1 }}
                                                        onChange={(e) => handleSearch(e.target.value)}
                                                        startAdornment={
                                                                <InputAdornment position="start" sx={{ color: "text.primary" }}>
                                                                        <SearchRoundedIcon fontSize="small" />
                                                                </InputAdornment>
                                                        }
                                                        inputProps={{
                                                                "aria-label": "search",
                                                        }}
                                                />
                                        </FormControl>
                                        <Link to={`${APP_ROUTES.ARRIVALS_DRUG}/create`}>
                                                <Button variant="contained" size="small">
                                                        KIRGAZISH
                                                </Button>
                                        </Link>
                                        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                                                <ColorModeIconDropdown />
                                        </Box>
                                </Box>
                        </Box>

                        <DataGrid onRowDoubleClick={handleRowClick} columns={columns} rows={filteredDrugs} />
                </Box>
        )
}

export default DrugArrivalPage