import { forwardRef } from 'react';
import { CalculationInput, CalculationLineItem } from '../../core/calc/types';

interface PrintTemplateProps {
    input: CalculationInput;
    results: CalculationLineItem[];
    total: number;
}

export const PrintTemplate = forwardRef<HTMLDivElement, PrintTemplateProps>(({ input, results, total }, ref) => {
    return (
        <div ref={ref} id="pdf-template" className="bg-white text-black p-10 w-[210mm] min-h-[297mm] mx-auto absolute top-0 left-[-9999px]">
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-wider">Отчет о расчете</h1>
                    <div className="text-sm text-gray-500 mt-1">Таможенных платежей на ввоз автотранспорта</div>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg">Auto Import Calculator</div>
                    <div className="text-sm text-gray-400">{new Date().toLocaleDateString('ru-RU')}</div>
                </div>
            </div>

            {/* Car Details */}
            <div className="mb-8">
                <h2 className="text-lg font-bold bg-gray-100 p-2 mb-4">Параметры автомобиля</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between border-b border-gray-200 py-1">
                        <span className="text-gray-500">Дата выпуска:</span>
                        <span className="font-mono font-bold">{input.manufacture_date}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-1">
                        <span className="text-gray-500">Объем двигателя:</span>
                        <span className="font-mono font-bold">{input.engine_volume_cc} см³</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-1">
                        <span className="text-gray-500">Тип двигателя:</span>
                        <span className="font-mono font-bold uppercase">{input.engine_type || 'Бензин'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-1">
                        <span className="text-gray-500">Стоимость:</span>
                        <span className="font-mono font-bold">{input.car_price} {input.car_price_currency}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-1">
                        <span className="text-gray-500">Ввоз:</span>
                        <span className="font-mono font-bold">
                            {input.importer_type === 'personal' ? 'Физическое лицо' : 'Юридическое лицо'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Calculation Table */}
            <div className="mb-8">
                <h2 className="text-lg font-bold bg-gray-100 p-2 mb-4">Детализация платежей</h2>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-black text-left">
                            <th className="py-2">Наименование</th>
                            <th className="py-2">Формула / Ставка</th>
                            <th className="py-2 text-right">Сумма (RUB)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-3">
                                    <div className="font-bold">{item.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{item.note}</div>
                                    {item.source.title && (
                                        <div className="text-[10px] text-gray-400 mt-0.5">Основание: {item.source.title}</div>
                                    )}
                                </td>
                                <td className="py-3 font-mono text-xs">{item.formula_display}</td>
                                <td className="py-3 text-right font-bold text-base">
                                    {item.value_rub.toLocaleString('ru-RU')} ₽
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2 bg-gray-900 text-white p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Итого к оплате:</span>
                    </div>
                    <div className="text-4xl font-bold text-right">
                        {total.toLocaleString('ru-RU')} ₽
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-gray-300 pt-4 text-xs text-gray-500 text-justify">
                <p>
                    Данный расчет является предварительным и носит исключительно информационный характер.
                    Итоговая сумма таможенных платежей определяется таможенным органом на момент подачи декларации.
                    Курсы валют ЦБ РФ могут отличаться от курсов, применяемых ФТС.
                    Разработчик не несет ответственности за финансовые решения, принятые на основе данного расчета.
                </p>
                <div className="mt-2 font-mono">
                    Сгенерировано в приложении Auto Import Calculator v1.0
                </div>
            </div>
        </div>
    );
});

PrintTemplate.displayName = 'PrintTemplate';
