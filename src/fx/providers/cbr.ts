import { FxSnapshot, FxRate } from '../types';

const CBR_XML_URL = 'https://www.cbr.ru/scripts/XML_daily.asp';

export async function fetchCbrXml(): Promise<FxSnapshot> {
  const response = await fetch(CBR_XML_URL);
  if (!response.ok) throw new Error(`CBR fetch failed: ${response.statusText}`);

  const text = await response.text();
  return parseCbrXml(text);
}

export function parseCbrXml(xmlText: string): FxSnapshot {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const valutes: Record<string, FxRate> = {};
  const dateStr = xmlDoc.documentElement.getAttribute('Date') || new Date().toLocaleDateString('ru-RU'); // dd.mm.yyyy

  // Parse root date (dd.mm.yyyy) to ISO (yyyy-mm-dd)
  const [dd, mm, yyyy] = dateStr.split('.');
  const isoDate = `${yyyy}-${mm}-${dd}`;

  const items = xmlDoc.getElementsByTagName('Valute');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const charCode = item.getElementsByTagName('CharCode')[0]?.textContent;
    const nominal = parseInt(item.getElementsByTagName('Nominal')[0]?.textContent || '1', 10);
    const name = item.getElementsByTagName('Name')[0]?.textContent || '';

    // Value is like "105,1234" -> replace comma with dot
    const valStr = item.getElementsByTagName('Value')[0]?.textContent || '0';
    const value = parseFloat(valStr.replace(',', '.'));

    if (charCode) {
      valutes[charCode] = {
        CharCode: charCode,
        Nominal: nominal,
        Name: name,
        Value: value
      };
    }
  }

  return {
    Date: isoDate,
    Timestamp: new Date().toISOString(),
    Valute: valutes
  };
}
