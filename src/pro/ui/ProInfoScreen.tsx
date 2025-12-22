import { useRef, useEffect, useState } from 'react';
import { LucideCheck, LucideX, LucideZap, LucideShoppingBag, LucideRefreshCw } from 'lucide-react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { iapManager } from '../iap';
import { FeatureFlags } from '../flags';
import { isNativePlatform } from '../../utils/platform';

interface ProInfoScreenProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProInfoScreen: React.FC<ProInfoScreenProps> = ({ isOpen, onClose }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isPro = FeatureFlags.hasProAccess();
    const isNative = isNativePlatform();

    // In a real app, we'd want to check if the specific "stub" provider is active or actual store
    // For now, always show actions if they are stubbed or native
    const showIapActions = isNative || import.meta.env.VITE_IAP_PROVIDER !== 'none';

    useEffect(() => {
        if (isOpen) iapManager.init().catch(console.error);
    }, [isOpen]);

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
        <div className="fixed inset-0 z-[70] bg-black text-white overflow-auto animate-in slide-in-from-bottom duration-300">
            <div ref={ref} className="min-h-screen p-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <LucideZap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl">PRO</span>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <LucideX className="w-6 h-6" />
                    </button>
                </div>

                <h1 className="text-3xl font-bold mb-2">Максимум возможностей</h1>
                <p className="text-gray-400 text-lg mb-8">Инструменты для профессиональных импортеров и брокеров.</p>

                <div className="space-y-6">
                    <BenefitItem
                        title="Сравнение расчётов"
                        desc="Сравнивайте до 3-х вариантов параллельно. Наглядная разница в пошлинах и итоговой цене."
                    />
                    <BenefitItem
                        title="Advanced PDF Reporting"
                        desc="Генерация профессиональных отчетов с брендингом, дисклеймерами и детальной разбивкой для клиентов и банков."
                    />
                    <BenefitItem
                        title="Менеджер сценариев"
                        desc="Сохраняйте до 10 расчетов. История и быстрый доступ к типовым кейсам (Германия, Китай, Япония)."
                    />
                    <BenefitItem
                        title="Приоритетная поддержка"
                        desc="Прямой канал связи с разработчиками для запроса новых функций."
                    />
                </div>

                <div className="mt-12 p-6 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-white/10 text-center">
                    {isPro ? (
                        <div className="text-green-400 font-bold text-xl mb-4 flex items-center justify-center gap-2">
                            <LucideCheck className="w-6 h-6" />
                            <span>PRO Активен</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold mb-2">Навсегда за 999 ₽</h3>
                            <p className="text-gray-400 mb-6">Одноразовая покупка. Никаких подписок.</p>

                            {showIapActions ? (
                                <div className="space-y-3">
                                    <button
                                        disabled={isLoading}
                                        onClick={async () => {
                                            setIsLoading(true);
                                            try {
                                                const res = await iapManager.provider.purchase('pro_one_time');
                                                if (res.ok) {
                                                    alert('Спасибо за покупку! PRO активирован.');
                                                    window.location.reload();
                                                } else {
                                                    alert(res.message || 'Ошибка покупки');
                                                }
                                            } catch (e) {
                                                console.error(e);
                                                alert('Ошибка магазина');
                                            } finally {
                                                setIsLoading(false);
                                            }
                                        }}
                                        className={`bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors w-full max-w-xs flex items-center justify-center gap-2 mx-auto ${isLoading ? 'opacity-50' : ''}`}
                                    >
                                        <LucideShoppingBag className="w-5 h-5" />
                                        <span>{isLoading ? 'Обработка...' : 'Купить PRO'}</span>
                                    </button>

                                    <button
                                        disabled={isLoading}
                                        onClick={async () => {
                                            setIsLoading(true);
                                            try {
                                                const res = await iapManager.provider.restore();
                                                if (res.ok) {
                                                    alert('Покупки восстановлены!');
                                                    window.location.reload();
                                                } else {
                                                    alert(res.message || 'Нечего восстанавливать');
                                                }
                                            } catch (e) {
                                                alert('Ошибка восстановления');
                                            } finally {
                                                setIsLoading(false);
                                            }
                                        }}
                                        className="text-gray-400 hover:text-white text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <LucideRefreshCw className="w-4 h-4" />
                                        <span>Восстановить покупки</span>
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-500">Покупки временно недоступны</p>
                            )}
                        </>
                    )}

                    <button onClick={onClose} className="mt-8 text-white/50 hover:text-white transition-colors text-sm">
                        Закрыть окно
                    </button>
                </div>
            </div>
        </div>
    );
};

const BenefitItem = ({ title, desc }: { title: string, desc: string }) => (
    <div className="flex gap-4">
        <div className="mt-1">
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <LucideCheck className="w-4 h-4 text-green-400" />
            </div>
        </div>
        <div>
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);
