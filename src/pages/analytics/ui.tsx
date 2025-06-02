import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    FormControl,
    TextField,
    Autocomplete,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useReportByDepartment, useReportByDrugId } from '@/features/drug-request';
import { useDepartmentList } from '@/features/department';
import { useDrugList } from '@/features/drug';
import ChartHeader from './components/chart-header';
import Chart from './components/chart';
import Chart2 from './components/chart2';
import Chart2Header from './components/chart2-header';
import DrugPieChart from './components/drug-pie-chart';

export default function SessionsChartPage() {
    const { data: report, isLoading } = useReportByDepartment();
    const { data: drugs } = useDrugList();
    const [selectedDrug, setSelectedDrug] = useState<any>(null);
    // @ts-ignore
    const { data: drugReport, isLoading: isDrugReportLoading } = useReportByDrugId(selectedDrug ? selectedDrug.id : '');
    const { data: departments, isLoading: isLoadingDepartment } = useDepartmentList();
    const theme = useTheme();

    if (isLoading || isLoadingDepartment || !report || !departments) return null;

    // Уникальные даты
    const dates = Array.from(
        new Set(report.map((r: any) => new Date(r.date).toISOString().split('T')[0]))
    ).sort();

    // Уникальные ID отделений
    const departmentIds = Array.from(new Set(report.map((r: any) => r.departmentId)));

    const getDepartmentName = (id: number | string) => {
        const dept = departments.find((d: any) => d.id === id);
        return dept ? dept.name : `Bo'lim ${id}`;
    };

    const colorPalette = [
        theme.palette.primary.light,
        theme.palette.primary.main,
        theme.palette.primary.dark,
        theme.palette.secondary.light,
        theme.palette.secondary.main,
        theme.palette.secondary.dark,
    ];

    const series = departmentIds.map((deptId) => {
        const deptData = dates.map((date) => {
            const found = report.find(
                (r: any) =>
                    new Date(r.date).toISOString().split('T')[0] === date && r.departmentId === deptId
            );
            return found ? Number(found.totalQuantity) : 0;
        });

        return {
            id: `dept-${deptId}`,
            // @ts-ignore
            label: getDepartmentName(deptId),
            data: deptData,
            showMark: false,
            curve: 'linear',
            stack: 'total',
            area: true,
            stackOrder: 'ascending',
        };
    });

    const total = report.reduce((a: number, b: any) => a + Number(b.totalQuantity), 0);

    const drugTotal = drugReport
        ? drugReport.reduce((acc: number, curr: any) => acc + Number(curr.totalQuantity), 0)
        : 0;

    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Bo'limlar bo‘yicha so‘rovlar
                </Typography>
                <ChartHeader total={total} />
                <Chart dates={dates} departmentIds={departmentIds} series={series} colors={colorPalette} />
            </CardContent>

            <CardContent sx={{ mt: 12, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Dori bo‘yicha so‘rovlar
                </Typography>

                {drugs && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Autocomplete
                            options={drugs}
                            getOptionLabel={(option) => option.name}
                            value={selectedDrug}
                            onChange={(event, newValue) => setSelectedDrug(newValue)}
                            renderInput={(params) => (
                                <TextField {...params} label="Dori tanlang" variant="outlined" />
                            )}
                        />
                    </FormControl>
                )}

                {drugReport && (
                    <>
                        <Chart2Header total={drugTotal} />
                        <Chart2 data={drugReport} colors={colorPalette} />
                    </>
                )}
            </CardContent>

            <CardContent sx={{ mt: 12, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Dori bo‘yicha so‘rovlar
                </Typography>

                <FormControl sx={{ mt: 2, width: 300 }}>
                    <Autocomplete
                        options={drugs || []}
                        getOptionLabel={(option) => option.name}
                        value={selectedDrug}
                        onChange={(_, newValue) => setSelectedDrug(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Dori tanlang" variant="outlined" />
                        )}
                    />
                </FormControl>

                {drugReport && <DrugPieChart report={drugReport} />}
            </CardContent>
        </Card>
    );
}
