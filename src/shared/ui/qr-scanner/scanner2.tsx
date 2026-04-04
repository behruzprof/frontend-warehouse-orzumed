import { useDrugList } from '@/features/drug';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useState, useEffect } from 'react';

type QRScannerComponentProps = {
        onScan: (data: { id: string; unit: string; amount: number } | null) => void;
        onClose: () => void;
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
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '95vw',
                maxWidth: '600px',
                height: '90vh',
                maxHeight: '800px',
                backgroundColor: '#121212',
                color: '#fff',
                padding: '20px',
                boxShadow: '0 0 20px rgba(0,0,0,0.6)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column' as const,
                zIndex: 1000,
                overflow: 'hidden',
        },
        header: {
                fontSize: 22,
                fontWeight: 'bold' as const,
                marginBottom: 10,
                textAlign: 'center' as const,
        },
        scannerWrapper: {
                flex: 1,
                position: 'relative' as const,
                overflow: 'hidden',
                borderRadius: '8px',
                backgroundColor: '#000',
        },
        buttonsRow: {
                marginTop: 10,
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap' as const,
                justifyContent: 'space-between' as const,
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
                marginTop: 12,
                padding: 10,
                backgroundColor: '#222',
                borderRadius: 6,
                wordBreak: 'break-word' as const,
                fontSize: 14,
        },
};


const QRScannerComponent = ({ onScan, onClose }: QRScannerComponentProps) => {
        const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
        const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
        const { data: drugs = [] } = useDrugList();

        const [scannedDrugName, setScannedDrugName] = useState<string | null>(null);
        const [errorMessage, setErrorMessage] = useState<string | null>(null);

        const [bgAudio] = useState(() => {
                const audio = new Audio('/soundtrack.mp3');
                audio.loop = true;
                audio.volume = 0.2;
                return audio;
        });
        const beep = new Audio('/beep.mp3');

        useEffect(() => {
                bgAudio.play().catch(() => { });
                return () => {
                        bgAudio.pause();
                        bgAudio.currentTime = 0;
                };
        }, [bgAudio]);

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

                const rawValue = detectedCodes[0].rawValue.trim(); // предполагаем, что это ID

                const foundDrug = drugs.find((drug) => drug.id === Number(rawValue));

                if (foundDrug) {
                        setScannedDrugName(foundDrug.name || 'Неизвестное название');
                        setErrorMessage(null);
                        beep.play().catch(() => { });
                        onScan({ id: String(foundDrug.id), unit: 'штук', amount: 20 });
                } else {
                        setScannedDrugName(null);
                        setErrorMessage(`Лекарство с ID "${rawValue}" не найдено`);
                }
        };

        return (
                <>
                        <div style={drawerStyles.overlay} onClick={onClose} />
                        <div style={drawerStyles.drawer}>
                                <div style={drawerStyles.header}>Сканер QR-кодов</div>

                                <div style={drawerStyles.scannerWrapper}>
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
                                </div>

                                {scannedDrugName && (
                                        <div style={drawerStyles.resultBox}>
                                                ✅ Найдено: <strong>{scannedDrugName}</strong>
                                        </div>
                                )}
                                {errorMessage && (
                                        <div style={{ ...drawerStyles.resultBox, backgroundColor: '#501010' }}>
                                                ❌ {errorMessage}
                                        </div>
                                )}

                                <div style={drawerStyles.buttonsRow}>
                                        <button
                                                style={{
                                                        ...drawerStyles.button,
                                                        ...(devices.length <= 1 ? drawerStyles.buttonDisabled : {}),
                                                }}
                                                onClick={() => setCurrentDeviceIndex((i) => (i + 1) % devices.length)}
                                                disabled={devices.length <= 1}
                                        >
                                                Камера {currentDeviceIndex + 1} из {devices.length}
                                        </button>

                                        <button
                                                style={{ ...drawerStyles.button, backgroundColor: '#b22222' }}
                                                onClick={onClose}
                                        >
                                                Закрыть
                                        </button>
                                </div>
                        </div>
                </>
        );
};

export default QRScannerComponent;
