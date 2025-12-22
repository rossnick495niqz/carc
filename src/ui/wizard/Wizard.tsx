import { useState, useEffect } from 'react';
import { useWizardStore } from './store';
import { useDataPackStore } from '../../core/datapack/store';
// import { useHistoryStore } from '../../core/history/store';
import { useFxStore } from '../../fx/store'; // Updated import
import { calculateUtilFee } from '../../core/calc/utilFee';
import { calculateCustomsDuty } from '../../core/calc/customs';
import { CalculationInput } from '../../core/calc/types';
import { convertFx } from '../../fx/convert'; // Added import
import { LucideInfo, LucideSave, LucideHistory, LucideLink, LucideDownload, LucideBarChart2 } from 'lucide-react';
import { ShareButton } from '../result/ShareButton';
import { encodeInputToHash } from '../../core/share/url';
import { HistoryList } from '../history/HistoryList';
import { PrintTemplate } from '../pdf/PrintTemplate';
import { AdvancedPrintTemplate } from '../pdf/AdvancedPrintTemplate'; // Pro
import { CurrencySelect } from '../currency/CurrencySelect'; // Added import
import { useScenarioStore } from '../../pro/scenarios/store';
import { CompareScreen } from '../../pro/scenarios/CompareScreen';
// import { FeatureFlags } from '../../pro/flags';
import { getEntitlement } from '../../pro/entitlement';
import { ProLockedModal } from '../../pro/ui/ProLockedModal';
import { ProInfoScreen } from '../../pro/ui/ProInfoScreen';
import { ScenarioManager } from '../../pro/scenarios/ScenarioManager';

import { motion, AnimatePresence } from 'framer-motion';

export function Wizard() {
    const { step } = useWizardStore();
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="w-full max-w-2xl mx-auto p-4 relative">
            {/* ... Header Actions ... */}
            <div className="absolute top-0 right-4 flex gap-2">
                <button
                    onClick={() => setShowHistory(true)}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full text-muted-foreground hover:text-white transition-colors"
                    title="История"
                >
                    <LucideHistory className="w-5 h-5" />
                </button>
            </div>

            {showHistory && <HistoryList onClose={() => setShowHistory(false)} />}

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 mt-6">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500
              ${step >= s ? 'bg-primary border-primary text-black' : 'border-neutral-700 text-neutral-500'}
            `}
                    >
                        {step === s && (
                            <motion.div
                                layoutId="step-ring"
                                className="absolute w-12 h-12 rounded-full border-2 border-primary/30"
                                transition={{ duration: 0.3 }}
                            />
                        )}
                        {s}
                    </div>
                ))}
            </div>

            <div className="glass-panel p-6 rounded-2xl min-h-[400px] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {step === 1 && <StepImporter />}
                        {step === 2 && <StepCarParams />}
                        {step === 3 && <ResultScreen />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function StepImporter() {
    const { input, updateInput, setStep } = useWizardStore();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Кто ввозит автомобиль?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => updateInput({ importer_type: 'personal' })}
                    className={`p-6 rounded-xl border text-left transition-all hover:border-primary/50
            ${input.importer_type === 'personal' ? 'bg-primary/20 border-primary' : 'bg-neutral-900/50 border-neutral-800'}
          `}
                >
                    <div className="font-bold text-lg mb-2">Физлицо</div>
                    <p className="text-sm text-muted-foreground">Для личного пользования. Один авто в год. Льготные ставки.</p>
                </button>

                <button
                    onClick={() => updateInput({ importer_type: 'commercial' })}
                    className={`p-6 rounded-xl border text-left transition-all hover:border-primary/50
            ${input.importer_type === 'commercial' ? 'bg-primary/20 border-primary' : 'bg-neutral-900/50 border-neutral-800'}
          `}
                >
                    <div className="font-bold text-lg mb-2">Юрлицо / Коммерция</div>
                    <p className="text-sm text-muted-foreground">Для перепродажи или на компанию. Полные ставки.</p>
                </button>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={() => setStep(2)}
                    className="bg-primary hover:bg-primary/90 text-black px-8 py-3 rounded-full font-bold transition-all"
                >
                    Далее
                </button>
            </div>
        </div>
    );
}

function StepCarParams() {
    const { input, updateInput, setStep } = useWizardStore();
    const { snapshot } = useFxStore();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Параметры автомобиля</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Дата выпуска</label>
                    <input
                        type="date"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white focus:ring-2 ring-primary"
                        value={input.manufacture_date || ''}
                        onChange={(e) => updateInput({ manufacture_date: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Объем двигателя (см³)</label>
                    <input
                        type="number"
                        placeholder="Например: 1998"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white focus:ring-2 ring-primary"
                        value={input.engine_volume_cc || ''}
                        onChange={(e) => updateInput({ engine_volume_cc: Number(e.target.value) })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Стоимость авто</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="20000"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white focus:ring-2 ring-primary"
                            value={input.car_price || ''}
                            onChange={(e) => updateInput({ car_price: Number(e.target.value) })}
                        />
                        <CurrencySelect
                            value={input.car_price_currency || 'EUR'}
                            onChange={(code) => updateInput({ car_price_currency: code as any })}
                            snapshot={snapshot}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-white">Назад</button>
                <button
                    onClick={() => setStep(3)}
                    className="bg-primary hover:bg-primary/90 text-black px-8 py-3 rounded-full font-bold transition-all"
                >
                    Рассчитать
                </button>
            </div>
        </div>
    );
}

function ResultScreen() {
    const { input, setStep } = useWizardStore();
    const { tables, loadTable } = useDataPackStore();
    // const { saveCalculation } = useHistoryStore();
    const { snapshot, init, isLoading: isFxLoading, error: fxError } = useFxStore();
    const { saveScenario, loadScenarios } = useScenarioStore();
    const [showPdfTemplate, setShowPdfTemplate] = useState(false);
    const [showAdvancedPdf, setShowAdvancedPdf] = useState(false);
    const [isPdfLoading, setIsPdfLoading] = useState(false);
    const [showCompare, setShowCompare] = useState(false);

    // Pro UI States
    const [showPaywall, setShowPaywall] = useState(false);
    const [paywallFeature, setPaywallFeature] = useState('');
    const [showProInfo, setShowProInfo] = useState(false);
    const [showScenarioManager, setShowScenarioManager] = useState(false);

    // Entitlement
    const isPro = getEntitlement().premium;

    // Init scenarios
    useEffect(() => { loadScenarios() }, []);

    // Init FX
    if (!snapshot && !isFxLoading && !fxError) {
        init();
    }

    // Trigger calculation
    const utilTable = tables['util_fee'];
    const customsTable = tables['customs'];

    if (!utilTable || !customsTable || !snapshot) {
        if (!utilTable) loadTable('util_fee');
        if (!customsTable) loadTable('customs');
        return <div className="text-center p-8">Загрузка данных и курсов валют...</div>;
    }

    // Prepare full input (defaults handling)
    const calcInput = input as CalculationInput; // Cast assuming validation passed


    // Note: calculateCustomsDuty now needs to handle FX internally or we pass converted EUR
    // But wait, the function signature expected eurRubRate. We should refactor it or just pass the EUR rate.
    // Let's grab the EUR rate from snapshot for now to keep API compatible, 
    // BUT we really should update calculateCustomsDuty to take the snapshot for cross-rates.
    // For this step, I will stick to existing API if possible, but the prompt asked to "Replace any hardcoded FX usage".
    // I will modify `calculateCustomsDuty` signature in the next step.
    const currency = input.car_price_currency || 'EUR';

    const utilResults = calculateUtilFee(calcInput, utilTable);
    const customsResults = calculateCustomsDuty(calcInput, customsTable, snapshot);

    const results = [...customsResults, ...utilResults];
    const total = results.reduce((sum, item) => sum + item.value_rub, 0);

    const calcInputFull = calcInput;

    const handleSave = () => {
        const title = prompt('Название сценария (например: Germany BMW X5):', `${input.car_price_currency} Import`);
        if (title) {
            saveScenario(title, calcInputFull, results, total, currency)
                .then(() => alert('Сценарий сохранён!'))
                .catch(e => {
                    if (e.message.includes('Limit reached')) {
                        if (confirm('Лимит сохраненных сценариев (10). Открыть управление сценариями для удаления старых?')) {
                            setShowScenarioManager(true);
                        }
                    } else {
                        alert(e.message);
                    }
                });
        }
    };

    const handleProAction = (feature: string, action: () => void) => {
        if (isPro) {
            action();
        } else {
            setPaywallFeature(feature);
            setShowPaywall(true);
        }
    };

    return (
        <div className="w-full">
            <div className="space-y-6">
                <div id="result-card" className="bg-card p-6 rounded-xl border border-white/5">
                    <div className="text-center pb-4 border-b border-white/10">
                        <div className="text-muted-foreground mb-1">Итого к оплате</div>
                        <div className="text-5xl font-bold tracking-tight text-white mb-2">
                            {total.toLocaleString('ru-RU')} ₽
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        {/* FX Breakdown for Car Price if not RUB */}
                        {currency !== 'RUB' && snapshot && (
                            <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-white">Стоимость авто (для расчёта)</span>
                                    <span className="font-bold">
                                        {(convertFx(input.car_price || 0, currency, 'RUB', snapshot).value).toLocaleString('ru-RU')} ₽
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground font-mono bg-black/30 p-1.5 rounded inline-block">
                                    {(input.car_price || 0).toLocaleString()} {currency} × {snapshot.Valute[currency]?.Value.toFixed(4)}
                                    {(snapshot.Valute[currency]?.Nominal || 1) > 1 ? ` / ${snapshot.Valute[currency]?.Nominal}` : ''}
                                </div>
                            </div>
                        )}

                        {results.map((item) => (
                            <div key={item.id} className="bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-white">{item.name}</span>
                                    <span className="font-bold">{item.value_rub.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <div className="text-xs text-muted-foreground font-mono bg-black/30 p-1.5 rounded inline-block">
                                    {item.formula_display}
                                </div>
                                {item.note && <div className="text-xs text-accent mt-1">{item.note}</div>}
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex gap-3 items-start mt-4">
                        <LucideInfo className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-200">
                            <div className="mb-2">
                                <div className="flex items-center gap-2">
                                    <span>Курсы ЦБ РФ на <b>{new Date(snapshot.Date).toLocaleDateString()}</b>:</span>
                                    {(() => {
                                        const date = new Date(snapshot.Date);
                                        const now = new Date();
                                        const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                                        if (days > 3) return <span className="text-yellow-400 font-bold bg-yellow-400/10 px-1 rounded">⚠️ Данные устарели ({days} дн.)</span>;
                                        return null;
                                    })()}
                                </div>

                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 font-mono opacity-80">
                                    <div>EUR: {snapshot.Valute['EUR'].Value.toFixed(2)} ₽</div>
                                    <div>USD: {snapshot.Valute['USD'].Value.toFixed(2)} ₽</div>
                                    <div>CNY: {snapshot.Valute['CNY'].Value.toFixed(2)} ₽</div>
                                    <div>JPY: {(snapshot.Valute['JPY'].Value / snapshot.Valute['JPY'].Nominal).toFixed(2)} ₽/1</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-500/20 opacity-70">
                            Источник: {'Официальные документы РФ/ЕАЭС'}.
                            Версия данных: {utilTable.version} (от {new Date(snapshot.Date).toLocaleDateString()}).
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
                <ShareButton targetId="result-card" />
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
                >
                    <LucideSave className="w-4 h-4" />
                    <span>Сохранить</span>
                </button>
                <button
                    onClick={() => handleProAction('Сравнение сценариев', () => setShowCompare(true))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${isPro ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400' : 'bg-neutral-800 text-gray-500 hover:bg-neutral-700'}`}
                >
                    <LucideBarChart2 className="w-4 h-4" />
                    <span>Сравнить {!isPro && '🔒'}</span>
                </button>
                <button
                    onClick={() => {
                        const hash = encodeInputToHash(calcInputFull);
                        const url = window.location.origin + window.location.pathname + hash;
                        navigator.clipboard.writeText(url);
                        alert('Ссылка скопирована в буфер обмена!');
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors text-sm font-medium"
                >
                    <LucideLink className="w-4 h-4" />
                    <span>Ссылка</span>
                </button>
            </div>

            {/* Premium Feature Teaser */}
            <div className="pt-6 border-t border-white/10">
                <div className="bg-neutral-900/40 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <div className="font-bold text-white mb-1">Детальный PDF отчет</div>
                            <div className="text-xs text-muted-foreground">Для таможенного брокера и банка</div>
                        </div>
                        <button
                            disabled={isPdfLoading}
                            onClick={async () => {
                                setIsPdfLoading(true);
                                const { PdfService } = await import('../../core/pdf/PdfService');
                                try {
                                    setShowPdfTemplate(true);
                                    setTimeout(async () => {
                                        try {
                                            await PdfService.generateReport('pdf-template', `auto-import-${new Date().toISOString().split('T')[0]}.pdf`);
                                        } finally {
                                            setShowPdfTemplate(false);
                                            setIsPdfLoading(false);
                                        }
                                    }, 100);
                                } catch (e) {
                                    console.error(e);
                                    alert('Ошибка генерации PDF. Попробуйте еще раз.');
                                    setShowPdfTemplate(false);
                                    setIsPdfLoading(false);
                                }
                            }}
                            className={`bg-neutral-800 text-white hover:bg-neutral-700 border border-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${isPdfLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <LucideDownload className="w-4 h-4" />
                            <span>{isPdfLoading ? '...' : 'PDF (Free)'}</span>
                        </button>
                        <button
                            disabled={isPdfLoading}
                            onClick={() => handleProAction('Advanced PDF', async () => {
                                setIsPdfLoading(true);
                                const { PdfService } = await import('../../core/pdf/PdfService');
                                try {
                                    setShowAdvancedPdf(true);
                                    // Safety timeout
                                    const timeout = setTimeout(() => {
                                        if (isPdfLoading) {
                                            alert('Генерация PDF заняла слишком много времени. Попробуйте обычный PDF.');
                                            setIsPdfLoading(false);
                                            setShowAdvancedPdf(false);
                                        }
                                    }, 20000);

                                    setTimeout(async () => {
                                        try {
                                            await PdfService.generateReport('pdf-advanced-template', `auto-import-pro-${new Date().toISOString().split('T')[0]}.pdf`);
                                        } catch (e) {
                                            console.error(e);
                                            alert('Ошибка Advanced PDF. Попробуйте Basic PDF.');
                                        } finally {
                                            clearTimeout(timeout);
                                            setShowAdvancedPdf(false);
                                            setIsPdfLoading(false);
                                        }
                                    }, 100);
                                } catch (e) {
                                    console.error(e);
                                    alert('Ошибка генерации PDF');
                                    setShowAdvancedPdf(false);
                                    setIsPdfLoading(false);
                                }
                            })}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${isPro ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'} ${isPdfLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <LucideDownload className="w-4 h-4" />
                            <span>PDF (PRO) {!isPro && '🔒'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden Template for PDF Capture */}
            {
                showPdfTemplate && (
                    <div id="pdf-mount-point" className="fixed top-0 left-0 bg-white z-[-1] pointer-events-none opacity-0">
                        <PrintTemplate input={calcInputFull} results={results} total={total} />
                    </div>
                )
            }
            {
                showAdvancedPdf && (
                    <div id="pdf-advanced-wrapper" className="fixed top-0 left-0 bg-white z-[-1] pointer-events-none opacity-0">
                        <AdvancedPrintTemplate input={calcInputFull} results={results} total={total} snapshotDate={snapshot?.Date || new Date().toISOString()} />
                    </div>
                )
            }

            <button onClick={() => setStep(1)} className="w-full text-center text-muted-foreground hover:text-white pt-4">
                Новый расчёт
            </button>

            {showCompare && (
                <CompareScreen
                    onClose={() => setShowCompare(false)}
                    currentResult={{ input: calcInputFull, results, totalRub: total, currency }}
                />
            )}

            <ProLockedModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                featureTitle={paywallFeature}
                onShowInfo={() => setShowProInfo(true)}
            />

            <ProInfoScreen
                isOpen={showProInfo}
                onClose={() => setShowProInfo(false)}
            />

            {showScenarioManager && (
                <ScenarioManager onClose={() => setShowScenarioManager(false)} />
            )}
        </div>
    )
}
