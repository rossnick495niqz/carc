import { useHistoryStore, SavedCalculation } from '../../core/history/store';
import { useWizardStore } from '../wizard/store';
import { LucideTrash2, LucideRotateCcw, LucideX } from 'lucide-react';

interface HistoryListProps {
    onClose: () => void;
}

export function HistoryList({ onClose }: HistoryListProps) {
    const { saved, deleteCalculation, clearHistory } = useHistoryStore();
    const { updateInput, setStep } = useWizardStore();

    const handleRestore = (calc: SavedCalculation) => {
        updateInput(calc.input);
        setStep(3); // Go to results
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card glass-panel w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl border border-white/10 shadow-2xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold text-white">История расчётов</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <LucideX className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {saved.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            Нет сохранённых расчётов
                        </div>
                    ) : (
                        saved.map((item) => (
                            <div key={item.id} className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                                    </div>
                                    <button
                                        onClick={() => deleteCalculation(item.id)}
                                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-900/20 rounded"
                                    >
                                        <LucideTrash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="font-bold text-lg text-white mb-1">
                                    {item.total_rub.toLocaleString('ru-RU')} ₽
                                </div>

                                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                                    {item.items_summary.map((line, idx) => (
                                        <div key={idx}>{line}</div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleRestore(item)}
                                    className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <LucideRotateCcw className="w-4 h-4" />
                                    Восстановить
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {saved.length > 0 && (
                    <div className="p-4 border-t border-white/10 bg-white/5">
                        <button
                            onClick={clearHistory}
                            className="w-full text-red-400 text-sm hover:text-red-300 transition-colors"
                        >
                            Очистить историю
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
