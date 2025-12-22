import { CalculationInput } from '../calc/types';

export function encodeInputToHash(input: CalculationInput): string {
    try {
        const json = JSON.stringify(input);
        const b64 = btoa(json);
        return `#${b64}`;
    } catch (e) {
        console.error('Failed to encode input', e);
        return '';
    }
}

export function decodeHashToInput(hash: string): Partial<CalculationInput> | null {
    try {
        if (!hash || !hash.startsWith('#')) return null;
        const b64 = hash.slice(1);
        const json = atob(b64);
        return JSON.parse(json);
    } catch (e) {
        console.error('Failed to decode hash', e);
        return null;
    }
}
