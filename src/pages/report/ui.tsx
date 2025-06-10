import React, { useState } from 'react';
import {
  Box,
  Button,
  Snackbar,
  CircularProgress,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useReport } from '@/features/drug-arrival/api';
import { format, getDaysInMonth } from 'date-fns';

const months = [
  { value: '01', label: 'Январь' },
  { value: '02', label: 'Февраль' },
  { value: '03', label: 'Март' },
  { value: '04', label: 'Апрель' },
  { value: '05', label: 'Май' },
  { value: '06', label: 'Июнь' },
  { value: '07', label: 'Июль' },
  { value: '08', label: 'Август' },
  { value: '09', label: 'Сентябрь' },
  { value: '10', label: 'Октябрь' },
  { value: '11', label: 'Ноябрь' },
  { value: '12', label: 'Декабрь' },
];

const getDaysArray = (year: string, month: string) => {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10) - 1;
  const max = getDaysInMonth(new Date(y, m));
  return Array.from({ length: max }, (_, i) => String(i + 1).padStart(2, '0'));
};

const ReportPage: React.FC = () => {
  const currentDate = new Date();
  const [day, setDay] = useState(format(currentDate, 'dd'));
  const [month, setMonth] = useState(format(currentDate, 'MM'));
  const [year, setYear] = useState(format(currentDate, 'yyyy'));
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { mutate: reportMutate } = useReport();

  const handleMonthChange = (value: string) => {
    setMonth(value);
    const days = getDaysArray(year, value);
    // @ts-ignore
    if (!days.includes(day)) setDay(days.at(-1)!);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
     // @ts-ignore
    const days = getDaysArray(value, month);
    // @ts-ignore
    if (!days.includes(day)) setDay(days.at(-1)!);
  };

  const handleSendTelegram = () => {
    setSending(true);
    reportMutate(
      { day, month, year },
      {
        onSuccess: () => {
          setSnackbar({
            open: true,
            message: 'Отчёт успешно отправлен в Telegram ✅',
            severity: 'success',
          });
          setSending(false);
        },
        onError: async (error: any) => {
          let message = 'Ошибка отправки отчёта';
          try {
            if (error?.response?.data instanceof Blob) {
              const text = await error.response.data.text();
              try {
                const json = JSON.parse(text);
                message = json.message || message;
              } catch {
                message = text;
              }
            } else if (typeof error?.response?.data === 'string') {
              message = error.response.data;
            } else {
              message = error?.response?.data?.message || message;
            }
          } catch {
            message = 'Произошла неизвестная ошибка при обработке ошибки';
          }

          setSnackbar({
            open: true,
            message,
            severity: 'error',
          });
          setSending(false);
        },
      }
    );
  };

  const days = getDaysArray(year, month);

  return (
    <Box p={3} maxWidth="600px" mx="auto">
      <Box display="flex" gap={2} mb={3}>
        <TextField
          select
          label="День"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          fullWidth
        >
          {days.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Месяц"
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
          fullWidth
        >
          {months.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          label="Год"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
          fullWidth
          inputProps={{ min: 2000, max: 2100 }}
        />
      </Box>

      <Box display="flex" justifyContent="flex-start" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={!sending ? <TelegramIcon /> : undefined}
          onClick={handleSendTelegram}
          disabled={sending}
          sx={{
            height: 42,
            whiteSpace: 'nowrap',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(0, 140, 255, 0.3)',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#0077cc',
              boxShadow: '0 6px 15px rgba(0, 110, 210, 0.5)',
            },
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {sending ? (
            <>
              <CircularProgress size={20} color="inherit" />
              Отправка...
            </>
          ) : (
            'Отправить в Telegram'
          )}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportPage;
