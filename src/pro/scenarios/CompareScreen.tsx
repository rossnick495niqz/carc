import React, { useEffect } from 'react';
import { useScenarioStore } from './store';
import { LucideTrash2, LucideX } from 'lucide-react';

interface CompareScreenProps {
    onClose: () => void;
    currentResult: {
        input: any;
        results: any[];
        totalRub: number;
        currency: string;
    };
}

export const CompareScreen: React.FC<CompareScreenProps> = ({ onClose }) => {
    const { scenarios, loadScenarios, compareSlots, setSlot } = useScenarioStore();

    useEffect(() => {
        loadScenarios();
    }, []);

    const slots = compareSlots.map(id => scenarios.find(s => s.id === id));

    return (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-auto p-4 animate-in fade-in duration-200">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">PRO</span>
                        Сравнение сценариев
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                        <LucideX className="text-white" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[0, 1, 2].map((idx) => {
                        const scenario = slots[idx];
                        return (
                            <div key={idx} className="bg-neutral-900 border border-white/10 rounded-xl p-4 min-h-[200px]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-sm text-gray-500 font-mono">SLOT {String.fromCharCode(65 + idx)}</div>
                                    {scenario ? (
                                        <button onClick={() => setSlot(idx, null)} className="text-red-400 hover:text-red-300">
                                            <LucideTrash2 className="w-4 h-4" />
                                        </button>
                                    ) : null}
                                </div>

                                {scenario ? (
                                    <>
                                        <div className="font-bold text-lg text-white mb-2">{scenario.title}</div>
                                        <div className="text-2xl font-bold text-blue-400 mb-4">
                                            {scenario.totalRub.toLocaleString()} ₽
                                        </div>
                                        <div className="text-sm text-gray-400 space-y-1">
                                            <div>{scenario.currency} {scenario.input.car_price.toLocaleString()}</div>
                                            <div>{scenario.input.engine_volume_cc} cc / {scenario.input.engine_type}</div>
                                            <div>{scenario.input.manufacture_date}</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center gap-2">
                                        <select
                                            className="bg-neutral-800 text-white text-sm p-2 rounded max-w-full"
                                            onChange={(e) => {
                                                if (e.target.value) setSlot(idx, e.target.value);
                                            }}
                                            value=""
                                        >
                                            <option value="">+ Добавить</option>
                                            {scenarios.map(s => (
                                                <option key={s.id} value={s.id} disabled={compareSlots.includes(s.id)}>
                                                    {s.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Comparison Table */}
                {slots.some(s => s) && (
                    <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400 uppercase font-mono text-xs">
                                <tr>
                                    <th className="p-4">Показатель</th>
                                    {slots.map((s, i) => (
                                        <th key={i} className="p-4 w-1/4">
                                            {s ? `Slot ${String.fromCharCode(65 + i)}` : '-'}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="hover:bg-white/5">
                                    <td className="p-4 font-bold text-white">Итого</td>
                                    {slots.map((s, i) => {
                                        if (!s) return <td key={i} className="p-4">-</td>;
                                        const prev = i > 0 ? slots[0] : null;
                                        const diff = prev ? s.totalRub - prev.totalRub : 0;
                                        const color = diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-gray-400';

                                        return (
                                            <td key={i} className="p-4">
                                                <div className="font-bold text-white">{s.totalRub.toLocaleString()} ₽</div>
                                                {prev && (
                                                    <div className={`text-xs ${color}`}>
                                                        {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
