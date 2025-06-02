import React, { useState } from 'react';
import {
  Box,
  Button,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import { format, subDays } from 'date-fns';
import { useArrivalsReportByRange } from '@/features/reports';

const ReportPage: React.FC = () => {
  const [range] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const { data, isLoading } = useArrivalsReportByRange(range.start, range.end);

  const handleSendTelegram = async () => {
    if (!data) return;

    setSending(true);
    try {
      // Имитируем отправку отчёта
      await new Promise((r) => setTimeout(r, 1500));

      setSnackbarOpen(true);
    } catch {
      alert('Ошибка отправки отчёта в Telegram');
    } finally {
      setSending(false);
    }
  };

  return (
    <Box p={3} maxWidth="1200px" mx="auto">
      <Box display="flex" justifyContent="flex-start" mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={!sending ? <TelegramIcon /> : undefined}
          onClick={handleSendTelegram}
          disabled={sending || isLoading || !data}
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
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Отчёт успешно отправлен в Telegram ✅"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
};

export default ReportPage;
