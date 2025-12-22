import { useState, useEffect } from 'react';
import { useScenarioStore } from './store';
import { LucideTrash2, LucideSearch, LucideX } from 'lucide-react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useRef } from 'react';

interface ScenarioManagerProps {
    onClose: () => void;
}

export const ScenarioManager: React.FC<ScenarioManagerProps> = ({ onClose }) => {
    const { scenarios, loadScenarios, deleteScenario } = useScenarioStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadScenarios();
    }, []);

    useEffect(() => {
        if (ref.current) disableBodyScroll(ref.current);
        return () => { if (ref.current) enableBodyScroll(ref.current); };
    }, []);

    const filtered = scenarios.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteSelected = async () => {
        if (!confirm(`Delete ${selectedIds.length} scenarios?`)) return;

        for (const id of selectedIds) {
            await deleteScenario(id);
        }
        setSelectedIds([]);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div ref={ref} className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Управление сценариями</h2>
                        <div className="text-sm text-gray-400">
                            {scenarios.length} / 10 использовано
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                        <LucideX className="text-white" />
                    </button>
                </div>

                <div className="p-4 border-b border-white/10 flex gap-4">
                    <div className="relative flex-1">
                        <LucideSearch className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className="w-full bg-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 ring-primary border-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                            <LucideTrash2 className="w-4 h-4" />
                            <span>Удалить ({selectedIds.length})</span>
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filtered.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            Нет сценариев
                        </div>
                    ) : (
                        filtered.map(scenario => (
                            <div
                                key={scenario.id}
                                onClick={() => toggleSelect(scenario.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedIds.includes(scenario.id) ? 'bg-primary/20 border-primary' : 'bg-neutral-800/50 border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-white mb-1">{scenario.title}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(scenario.createdAt).toLocaleDateString()} • {scenario.input.car_price} {scenario.currency}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-blue-400">
                                            {scenario.totalRub.toLocaleString()} ₽
                                        </div>
                                        {scenario.meta?.dataVersion && (
                                            <div className="text-[10px] text-gray-600 mt-1 uppercase">
                                                v{scenario.meta.dataVersion}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
