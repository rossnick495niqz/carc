import { useRegisterSW } from 'virtual:pwa-register/react';
import { useState, useEffect } from 'react';
import { LucideWifiOff, LucideRefreshCw } from 'lucide-react';

export const PwaManager = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    // Check missing data
    const [missingData, setMissingData] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check if vital data exists (simple fetch check or local check)
        // In offline mode, if fetch fails, we know we are missing cache
        if (!navigator.onLine) {
            fetch('data/catalog.json').catch(() => setMissingData(true));
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const {
        // offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW Registration Error', error);
        },
    });

    return (
        <div className="fixed bottom-4 left-0 right-0 z-[100] px-4 pointer-events-none flex flex-col gap-2 items-center">
            {/* Offline Banner */}
            {isOffline && (
                <div className="bg-red-500/90 backdrop-blur text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom pointer-events-auto">
                    <LucideWifiOff className="w-4 h-4" />
                    <span>Оффлайн: {missingData ? 'Нет данных! Подключитесь к сети.' : 'используем кэш'}</span>
                </div>
            )}

            {/* Update Toast */}
            {needRefresh && (
                <div className="bg-blue-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom pointer-events-auto max-w-sm border border-white/20">
                    <div className="flex-1">
                        <div className="font-bold">Доступно обновление</div>
                        <div className="text-xs text-blue-200">Новые функции и данные готовы.</div>
                    </div>
                    <button
                        onClick={() => updateServiceWorker(true)}
                        className="bg-white text-blue-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                        <LucideRefreshCw className="w-4 h-4" />
                        <span>Обновить</span>
                    </button>
                    <button onClick={() => setNeedRefresh(false)} className="text-blue-300 hover:text-white">✕</button>
                </div>
            )}
        </div>
    );
};
