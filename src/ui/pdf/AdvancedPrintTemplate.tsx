import { forwardRef } from 'react';
import { CalculationInput, CalculationLineItem } from '../../core/calc/types';

interface PrintTemplateProps {
    input: CalculationInput;
    results: CalculationLineItem[];
    total: number;
    snapshotDate: string;
}

export const AdvancedPrintTemplate = forwardRef<HTMLDivElement, PrintTemplateProps>(({ input, results, total, snapshotDate }, ref) => {
    return (
        <div ref={ref} id="pdf-advanced-template" className="bg-white text-black p-12 w-[210mm] min-h-[297mm] mx-auto relative font-sans">
            {/* Pro Branding */}
            <div className="flex justify-between items-center border-b-4 border-blue-600 pb-6 mb-8">
                <div className="flex items-center gap-4">
                    {/* Placeholder Logo */}
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                        %
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">AUTO IMPORT</h1>
                        <div className="text-sm text-blue-500 font-semibold tracking-widest uppercase">Calculator Report</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase mb-1">Generated On</div>
                    <div className="font-mono font-bold text-lg">{new Date().toLocaleString('ru-RU')}</div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                {/* Vehicle Specs */}
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Vehicle Specification</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Price ({input.car_price_currency})</span>
                            <span className="font-bold">{input.car_price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Engine</span>
                            <span className="font-bold">{input.engine_volume_cc} cc / {input.engine_type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Age</span>
                            <span className="font-bold">{input.manufacture_date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className="font-bold capitalize">{input.importer_type}</span>
                        </div>
                    </div>
                </div>

                {/* Import Totals */}
                <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Estimated Total</h3>
                    <div className="text-4xl font-extrabold text-blue-900 mb-1">
                        {total.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-blue-400">
                        *Excluding broker fees and delivery
                    </div>
                </div>
            </div>

            {/* Calculations */}
            <div className="mb-12">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Duty Calculation Breakdown</h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <th className="py-3 px-4 text-left rounded-l-lg">Item</th>
                            <th className="py-3 px-4 text-left">Basis / Rate</th>
                            <th className="py-3 px-4 text-right rounded-r-lg">Amount (RUB)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {results.map((item, i) => (
                            <tr key={i}>
                                <td className="py-4 px-4 font-medium text-gray-900">
                                    {item.name}
                                    {item.source.title && (
                                        <div className="text-[10px] text-gray-400 font-normal mt-1 max-w-xs">{item.source.title}</div>
                                    )}
                                </td>
                                <td className="py-4 px-4 font-mono text-gray-500 text-xs">{item.formula_display}</td>
                                <td className="py-4 px-4 text-right font-bold text-gray-900">
                                    {item.value_rub.toLocaleString('ru-RU')} ₽
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Transparency / Footer */}
            <div className="absolute bottom-12 left-12 right-12">
                <div className="flex gap-8 text-[10px] text-gray-400 border-t border-gray-100 pt-6">
                    <div className="w-2/3 text-justify">
                        This report was generated client-side using Open Data.
                        FX Rates provided by Central Bank of Russia (via CBE) on {new Date(snapshotDate).toLocaleDateString()}.
                        Customs regulations sourced from EAEU agreements.
                        <br /><br />
                        <b>Disclaimer:</b> This is an estimation tool. Final customs duties are determined by the Federal Customs Service.
                    </div>
                    <div className="w-1/3 text-right">
                        <div>Auto Import Calculator v1.0</div>
                        <div>PRO Edition</div>
                        <div className="mt-2 text-blue-500 font-mono">rossnick495niqz.github.io/carc</div>
                    </div>
                </div>
            </div>
        </div>
    );
});

AdvancedPrintTemplate.displayName = 'AdvancedPrintTemplate';
