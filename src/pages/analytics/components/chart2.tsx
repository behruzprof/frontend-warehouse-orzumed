import { BarChart } from '@mui/x-charts/BarChart';

interface ReportItem {
        department: string;
        month: string;
        totalQuantity: string;
}

interface Props {
        data: ReportItem[];
        colors: string[];
}

export default function Chart2({ data, colors }: Props) {
        // Все уникальные отделения
        const departments = Array.from(new Set(data.map((d) => d.department)));

        // Все уникальные месяцы (используем для серии)
        const months = Array.from(new Set(data.map((d) => d.month)));

        // Формируем серии по месяцам
        const series = months.map((month, index) => {
                const seriesData = departments.map((department) => {
                        const item = data.find((d) => d.department === department && d.month === month);
                        return item ? Number(item.totalQuantity) : 0;
                });

                return {
                        id: `month-${month}`,
                        label: month,
                        data: seriesData,
                        color: colors[index % colors.length],
                };
        });

        return (
                <BarChart
                        xAxis={[{
                                scaleType: 'band',
                                data: departments,
                        }]}
                        series={series}
                        height={350}
                        margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
                        grid={{ horizontal: true }}
                        slotProps={{
                                // @ts-ignore
                                legend: { hidden: false }, // показываем легенду по месяцам
                        }}
                />
        );
}
