import { Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useReportByDepartment } from '@/features/drug-request';
import { useDepartmentList } from '@/features/department';
import ChartHeader from './components/chart-header';

export default function SessionsChartPage() {
        const { data: report, isLoading } = useReportByDepartment();
        const { data: departments, isLoading: isLoadingDepartment } = useDepartmentList();
        const theme = useTheme();

        if (isLoading || isLoadingDepartment || !report || !departments) return null;
        // @ts-ignore
        const dates = Array.from(new Set(report.map(r => new Date(r.date).toISOString().split('T')[0]))).sort();
        // @ts-ignore
        const departmentIds = Array.from(new Set(report.map(r => r.departmentId)));

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
                const deptData = dates.map(date => {
                        const found = report.find(
                                // @ts-ignore
                                r => new Date(r.date).toISOString().split('T')[0] === date && r.departmentId === deptId,
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
        // @ts-ignore
        const total = report.reduce((a, b) => a + Number(b.totalQuantity), 0);

        return (
                <Card variant="outlined" sx={{ width: '100%' }}>
                        <CardContent>
                                <Typography component="h2" variant="subtitle2" gutterBottom>
                                        Bo'limlar bo‘yicha so‘rovlar
                                </Typography>
                                <ChartHeader total={total} />
                                {/* @ts-ignore */}
                                <Chart dates={dates} departmentIds={departmentIds} series={series} colors={colorPalette} />
                        </CardContent>
                </Card>
        );
}
