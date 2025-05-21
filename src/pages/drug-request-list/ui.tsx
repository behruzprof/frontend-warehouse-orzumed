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
import { useNavigate } from "react-router-dom"
import { APP_ROUTES } from "@/shared/constants/app-route"
import { useDrugRequestList } from "@/features/drug-request"

export const columns: GridColDef[] = [
    {
        field: "department",
        headerName: "BO'LIM",
        flex: 1.5,
        minWidth: 180,
        renderCell: (params) => params.row.department?.name || "Noma'lum",
    },
    {
        field: "drug",
        headerName: "DORI NOMI",
        flex: 1.5,
        minWidth: 180,
        renderCell: (params) => params.row.drug?.name || "Noma'lum",
    },
    {
        field: "quantity",
        headerName: "MIQDORI",
        flex: 1,
        minWidth: 120,
    },
    {
        field: "status",
        headerName: "STATUS",
        flex: 1,
        minWidth: 140,
        renderCell: (params) => {
            const value = params.row.status;
            return value === "issued" ? "Berilgan" : value === "returned" ? "Qaytarilgan" : "Noma'lum";
        },
    },
    {
        field: "createdAt",
        headerName: "YARATILGAN VAQTI",
        flex: 1.5,
        minWidth: 180,
        renderCell: (params) => new Date(params.row.createdAt).toLocaleString("uz-UZ"),
    },
    {
        field: "actions",
        headerName: "HARAKATLAR",
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <Button
                size="small"
                onClick={() =>
                    window.location.href = `${APP_ROUTES.REQUIREMENT_DRUG}/update/${params.id}`
                }
            >
                <Typography variant="body2" color="primary">
                    O'zgartirish
                </Typography>
            </Button>
        ),
        width: 120,
    },
];

const DrugRequestPage = () => {
    const navigate = useNavigate()
    const { data: requests, error, isLoading } = useDrugRequestList()
    const [searchTerm, setSearchTerm] = useState("")

    const handleSearch = debounce((value: string) => {
        setSearchTerm(value.toLowerCase().trim())
    }, 300)

    const handleRowClick = (params: any) => {
        navigate(`${APP_ROUTES.REQUIREMENT_DRUG}/update/${params.id}`)
    }

    const filteredRequests = useMemo(() => {
        if (!searchTerm) return requests ?? []
        return (requests ?? []).filter((item) =>
            item.drug?.name?.toLowerCase().includes(searchTerm)
        ) 
    }, [requests, searchTerm])

    if (isLoading) {
        return (
            <Backdrop sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }

    if (error || !requests) {
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
                    DORI SO'ROVLARI RO'YXATI
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
                            inputProps={{ "aria-label": "search" }}
                        />
                    </FormControl>

                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`${APP_ROUTES.REQUIREMENT_DRUG}`)}
                    >
                        YANGI SO'ROV
                    </Button>

                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                        <ColorModeIconDropdown />
                    </Box>
                </Box>
            </Box>

            <DataGrid onRowDoubleClick={handleRowClick} columns={columns} rows={filteredRequests} />
        </Box>
    )
}

export default DrugRequestPage
