import { Box } from '@mui/material';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useState, useEffect } from 'react';

type QRScannerComponentProps = {
        onScan: (data: string | null) => void;
        onClose: () => void; // onClose обязателен, тк drawer всегда должен закрываться
};

const drawerStyles = {
        overlay: {
                position: 'fixed' as const,
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.6)',
                zIndex: 999,
        },
        drawer: {
                position: 'fixed' as const,
                top: 0,
                right: 0,
                width: "100%",
                height: '100%',
                backgroundColor: '#121212',
                color: '#fff',
                padding: 20,
                boxShadow: '-4px 0 12px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column' as const,
                zIndex: 1000,
        },
        header: {
                fontSize: 22,
                fontWeight: 'bold' as const,
                marginBottom: 15,
        },
        buttonsRow: {
                marginTop: 15,
                display: 'flex',
                gap: 10,
        },
        button: {
                flex: 1,
                padding: '10px 12px',
                fontSize: 16,
                cursor: 'pointer',
                borderRadius: 6,
                border: 'none',
                backgroundColor: '#333',
                color: '#fff',
                transition: 'background-color 0.3s',
        },
        buttonDisabled: {
                backgroundColor: '#555',
                cursor: 'not-allowed',
        },
        resultBox: {
                marginTop: 20,
                padding: 12,
                backgroundColor: '#222',
                borderRadius: 6,
                wordBreak: 'break-word' as const,
        },
};

const QRScannerComponent = ({ onScan, onClose }: QRScannerComponentProps) => {
        const [result, setResult] = useState<string | null>(null);
        const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
        const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

        // Фон музыка — будет играть пока открыт сканер
        const [bgAudio] = useState(() => {
                const audio = new Audio('/soundtrack.mp3');
                audio.loop = true;
                audio.volume = 0.2;
                return audio;
        });

        // Звук "бип" при успешном скане
        const beep = new Audio('/beep.mp3');

        useEffect(() => {
                // Включаем фон музыку при монтировании
                bgAudio.play().catch(() => {
                        // если браузер запретил автозапуск — молча пропускаем
                });

                return () => {
                        // При размонтировании останавливаем музыку
                        bgAudio.pause();
                        bgAudio.currentTime = 0;
                };
        }, [bgAudio]);

        // Получаем список видеоустройств
        useEffect(() => {
                const fetchDevices = async () => {
                        try {
                                const allDevices = await navigator.mediaDevices.enumerateDevices();
                                const videoDevices = allDevices.filter((d) => d.kind === 'videoinput');
                                setDevices(videoDevices);
                        } catch (err) {
                                console.error('Ошибка при получении устройств:', err);
                        }
                };

                fetchDevices();
        }, []);

        const handleScan = (detectedCodes: IDetectedBarcode[]) => {
                if (detectedCodes.length === 0) return;

                const text = detectedCodes[0].rawValue;
                setResult(text);
                onScan(text);
                beep.play().catch(() => { });
        };

        const switchCamera = () => {
                if (devices.length <= 1) return;
                setCurrentDeviceIndex((i) => (i + 1) % devices.length);
                setResult(null);
        };

        return (
                <Box sx={{ display: { md: "none" } }}>
                        <div style={drawerStyles.overlay} onClick={onClose} />
                        <div style={drawerStyles.drawer}>
                                <div style={drawerStyles.header}>Сканер QR-кодов</div>

                                <Scanner
                                        onScan={handleScan}
                                        onError={(error) => console.error('Ошибка при сканировании:', error)}
                                        constraints={{
                                                deviceId:
                                                        devices.length > 0
                                                                ? { exact: devices[currentDeviceIndex].deviceId }
                                                                : undefined,
                                                facingMode: 'environment',
                                        }}
                                />

                                <div style={drawerStyles.buttonsRow}>
                                        <button
                                                style={{
                                                        ...drawerStyles.button,
                                                        ...(devices.length <= 1 ? drawerStyles.buttonDisabled : {}),
                                                }}
                                                onClick={switchCamera}
                                                disabled={devices.length <= 1}
                                                aria-label="Переключить камеру"
                                        >
                                                Камера {currentDeviceIndex + 1} из {devices.length}
                                        </button>

                                        <button
                                                style={{ ...drawerStyles.button, backgroundColor: '#b22222' }}
                                                onClick={onClose}
                                                aria-label="Закрыть сканер"
                                        >
                                                Закрыть
                                        </button>
                                </div>

                                {result && (
                                        <div style={drawerStyles.resultBox}>
                                                <strong>Результат сканирования:</strong>
                                                <div>{result}</div>
                                        </div>
                                )}
                        </div>
                </Box>
        );
};

export default QRScannerComponent;
