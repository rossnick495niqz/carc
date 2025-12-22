import { useState, useMemo } from 'react';
import { MAJOR_CURRENCIES, FxSnapshot, KGS_CURRENCY } from '../../fx/types';

interface CurrencySelectProps {
    value: string;
    onChange: (code: string) => void;
    snapshot: FxSnapshot | null;
}

const POPULAR_LIST = [...MAJOR_CURRENCIES, KGS_CURRENCY]; // Ensure KGS is in popular list

export function CurrencySelect({ value, onChange, snapshot }: CurrencySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const available = useMemo(() => {
        if (!snapshot) return [];
        return Object.values(snapshot.Valute)
            .filter(v => v.CharCode.toLowerCase().includes(search.toLowerCase()) ||
                v.Name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => a.CharCode.localeCompare(b.CharCode));
    }, [snapshot, search]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white min-w-[100px] flex justify-between items-center"
            >
                <span>{value}</span>
                <span className="text-xs text-neutral-500 ml-2">▼</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-neutral-900 border border-white/10 rounded-xl shadow-xl z-50 p-2">
                        <input
                            autoFocus
                            placeholder="Поиск валюты..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white mb-2 outline-none focus:border-primary"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />

                        {/* Popular */}
                        {search === '' && (
                            <div className="mb-2 pb-2 border-b border-white/10">
                                <div className="text-xs text-muted-foreground mb-1 px-2">Популярные</div>
                                <div className="grid grid-cols-3 gap-1">
                                    <button onClick={() => { onChange('RUB'); setIsOpen(false); }} className={`p-1 rounded text-sm ${value === 'RUB' ? 'bg-primary text-black' : 'hover:bg-white/10'}`}>RUB</button>
                                    {POPULAR_LIST.map(code => (
                                        <button
                                            key={code}
                                            onClick={() => { onChange(code); setIsOpen(false); }}
                                            className={`p-1 rounded text-sm ${value === code ? 'bg-primary text-black' : 'hover:bg-white/10'}`}
                                        >
                                            {code}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All */}
                        <div className="space-y-1">
                            {available.map(c => (
                                <button
                                    key={c.CharCode}
                                    onClick={() => { onChange(c.CharCode); setIsOpen(false); }}
                                    className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 text-sm flex justify-between"
                                >
                                    <span className="font-bold">{c.CharCode}</span>
                                    <span className="text-neutral-400 truncate ml-2 text-xs">{c.Name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
