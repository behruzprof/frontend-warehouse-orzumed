import {
        Backdrop,
        Box,
        Button,
        Card,
        CardContent,
        CircularProgress,
        Collapse,
        FormControl,
        IconButton,
        InputAdornment,
        OutlinedInput,
        Typography,
} from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import debounce from "lodash.debounce"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { APP_ROUTES } from "@/shared/constants/app-route"
import { useDepartmentList } from "@/features/department"
import DataGrid from "@/shared/ui/data-grid"
import type { GridColDef } from "@mui/x-data-grid"
import type { Drug } from "@/features/drug/types/drug"

export const columns: GridColDef[] = [
        {
                field: "drug",
                headerName: "DORI NOMI",
                flex: 1.5,
                minWidth: 200,
                valueGetter: (params: Drug) => params.name
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
                field: "updatedAt",
                headerName: "DORI OLINGAN SANASI",
                headerAlign: "left",
                align: "left",
                flex: 1,
                minWidth: 120,
                valueFormatter: (value: string | number | Date) => {
                        if (!value) return "";
                        const date = new Date(value);
                        if (isNaN(date.getTime())) return "Noto‘g‘ri sana";
                        return date.toLocaleDateString("uz-UZ", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                        });
                },
        }
]

const CollapsibleRow = ({ row }: { row: any }) => {
        const [open, setOpen] = useState(false)

        return (
                <>
                        <Box
                                sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        px: { xs: 0, md: 2 },
                                        py: 1,
                                        borderBottom: "1px solid #e0e0e0",
                                        bgcolor: open ? "#f9f9f9" : "transparent",
                                }}
                        >
                                <IconButton size="small" onClick={() => setOpen(!open)}>
                                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                                <Typography sx={{ flex: 1 }}>{row.name}</Typography>
                                <Typography sx={{ width: 200 }}>Talabnomalar: {row.drugRequests.length}</Typography>
                                <Link to={`${APP_ROUTES.DEPARTMENTS}/update/${row.id}`}>
                                        <Button variant="contained" color="secondary" size="small">O'zgartirish</Button>
                                </Link>
                        </Box>

                        <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ px: 2, pb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Talabnomalar</Typography>
                                        <DataGrid
                                                pageSize={5}
                                                columns={columns}
                                                rows={row.drugRequests.map((r: any, i: number) => ({ id: i + 1, ...r }))}
                                        />
                                </Box>
                        </Collapse>
                </>
        )
}

const DepartmentPage = () => {
        const { data: departments, isLoading, error } = useDepartmentList()
        const [searchTerm, setSearchTerm] = useState("")

        const handleSearch = debounce((value: string) => {
                setSearchTerm(value.toLowerCase().trim())
        }, 300)

        const filteredDepartments = useMemo(() => {
                if (!searchTerm) return departments ?? []
                return (departments ?? []).filter((d) =>
                        d.name.toLowerCase().includes(searchTerm)
                )
        }, [departments, searchTerm])

        if (isLoading) {
                return (
                        <Backdrop sx={{ zIndex: 9999, color: "#fff" }} open>
                                <CircularProgress color="inherit" />
                        </Backdrop>
                )
        }

        if (error || !departments) {
                return (
                        <Box sx={{ textAlign: "center", mt: 10 }}>
                                <Typography color="error">Xatolik yuz berdi</Typography>
                        </Box>
                )
        }

        return (
                <Box sx={{ maxWidth: 1300, width: "100%", mx: "auto", p: 2 }}>
                        <Card>
                                <CardContent>
                                        <Box
                                                sx={{
                                                        display: "flex",
                                                        flexDirection: { xs: "column", md: "row" },
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        mb: 2,
                                                }}
                                        >
                                                <Typography variant="h6">Bo‘limlar ro‘yxati</Typography>
                                                <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, md: 0 } }}>
                                                        <FormControl variant="outlined" size="small">
                                                                <OutlinedInput
                                                                        placeholder="Qidirish…"
                                                                        onChange={(e) => handleSearch(e.target.value)}
                                                                        startAdornment={
                                                                                <InputAdornment position="start">
                                                                                        <SearchRoundedIcon />
                                                                                </InputAdornment>
                                                                        }
                                                                />
                                                        </FormControl>
                                                        <Link to={`${APP_ROUTES.DEPARTMENTS}/create`}>
                                                                <Button variant="contained">Yaratish</Button>
                                                        </Link>
                                                </Box>
                                        </Box>

                                        <Box overflow="auto">
                                                {filteredDepartments.map((dept) => (
                                                        <CollapsibleRow key={dept.id} row={dept} />
                                                ))}
                                        </Box>
                                </CardContent>
                        </Card>
                </Box>
        )
}

export default DepartmentPage
