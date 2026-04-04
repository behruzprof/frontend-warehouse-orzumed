import { PieChart } from '@mui/x-charts/PieChart';
import { Card, CardContent, Typography } from '@mui/material';
import { format, isValid } from 'date-fns';

interface Props {
        report: any[];
}

export default function DrugPieChart({ report }: Props) {
        if (!report?.length) return null;

        // Группируем по месяцам только валидные даты
        const monthlyTotals = report.reduce((acc, curr) => {
                const dateObj = new Date(curr.month);
                if (!isValid(dateObj)) {
                        // Если дата невалидна — пропускаем запись
                        return acc;
                }
                const month = format(dateObj, 'yyyy-MM');
                acc[month] = (acc[month] || 0) + Number(curr.totalQuantity);
                return acc;
        }, {} as Record<string, number>);

        const data = Object.entries(monthlyTotals).map(([month, value]) => ({
                label: month,
                value,
        }));

        // @ts-ignore
        const total = Object.values(monthlyTotals).reduce((a, b) => a + b, 0);

        return (
                <Card variant="outlined" sx={{ mt: 4 }}>
                        <CardContent>
                                <Typography variant="subtitle2" gutterBottom>
                                        Oylar bo‘yicha dori so‘rovlarining ulushi
                                </Typography>
                                <PieChart
                                        // @ts-ignore
                                        series={[{ data, innerRadius: 50, outerRadius: 80 }]}
                                        width={300}
                                        height={300}
                                >
                                        <text
                                                x={150}
                                                y={140}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                style={{ fontSize: '18px', fontWeight: 'bold', fill: '#555' }}
                                        >
                                                {/* @ts-ignore */}
                                                {total}
                                        </text>
                                        <text
                                                x={150}
                                                y={160}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                style={{ fontSize: '12px', fill: '#999' }}
                                        >
                                                Jami so‘rov
                                        </text>
                                </PieChart>
                        </CardContent>
                </Card>
        );
}
