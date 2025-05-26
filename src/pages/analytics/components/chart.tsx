import { LineChart } from '@mui/x-charts/LineChart';
import ChartAreaGradient from './chart-area-gradient';

export default function Chart({ dates, departmentIds, series, colors }: any) {
  return (
    <LineChart
      xAxis={[{
        scaleType: 'point',
        data: dates.map((d: string) => new Date(d).toLocaleDateString('uz-UZ')),
      }]}
      series={series}
      colors={colors}
      height={300}
      margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
      grid={{ horizontal: true }}
      sx={{
        ...Object.fromEntries(departmentIds.map((id: string) => [
          `& .MuiAreaElement-series-dept-${id}`,
          { fill: `url('#dept-${id}')` },
        ])),
      }}
      slotProps={{
        // @ts-ignore
        legend: { hidden: false },
      }}
    >
      {departmentIds.map((id: string, i: number) => (
        <ChartAreaGradient key={id} id={`dept-${id}`} color={colors[i % colors.length]} />
      ))}
    </LineChart>
  );
}
