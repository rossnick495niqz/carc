import { useRef, useEffect } from 'react';
import { LucideLock, LucideCheck, LucideX } from 'lucide-react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export interface ProLockedModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureTitle: string;
    onShowInfo: () => void;
}

export const ProLockedModal: React.FC<ProLockedModalProps> = ({ isOpen, onClose, featureTitle, onShowInfo }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && ref.current) {
            disableBodyScroll(ref.current);
        } else if (ref.current) {
            enableBodyScroll(ref.current);
        }
        return () => { if (ref.current) enableBodyScroll(ref.current); };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div ref={ref} className="bg-neutral-900 border border-white/10 rounded-2xl max-w-md w-full p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <LucideX className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                        <LucideLock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{featureTitle}</h3>
                    <div className="text-sm font-semibold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        PRO Функция
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <p className="text-center text-gray-300">
                        Эта функция доступна в PRO версии приложения. Одноразовая покупка, вечный доступ.
                    </p>

                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex items-start gap-3">
                            <LucideCheck className="w-5 h-5 text-green-400 shrink-0" />
                            <span className="text-sm text-gray-200">Сравнение сценариев расчёта</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <LucideCheck className="w-5 h-5 text-green-400 shrink-0" />
                            <span className="text-sm text-gray-200">Профессиональные PDF отчеты</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <LucideCheck className="w-5 h-5 text-green-400 shrink-0" />
                            <span className="text-sm text-gray-200">Оффлайн-first архитектура</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
                    >
                        Понятно
                    </button>
                    <button
                        onClick={() => { onClose(); onShowInfo(); }}
                        className="w-full py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Что входит в PRO?</span>
                    </button>
                    <div className="text-center">
                        <span className="text-xs text-gray-500">Покупки в сторах скоро</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
