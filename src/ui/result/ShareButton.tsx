import { toPng } from 'html-to-image';
import { useCallback } from 'react';
import { LucideShare2 } from 'lucide-react';

interface ShareButtonProps {
    targetId: string; // DOM ID to capture
}

export function ShareButton({ targetId }: ShareButtonProps) {
    const handleShare = useCallback(async () => {
        const node = document.getElementById(targetId);
        if (!node) return;

        try {
            const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });

            // For now, simpler sharing: download or open in new tab
            // In a real mobile app (Capacitor), we would use the Share plugin with base64 data

            const link = document.createElement('a');
            link.download = `auto-import-calc-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
        }
    }, [targetId]);

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
            <LucideShare2 className="w-4 h-4" />
            <span>Сохранить как картинку</span>
        </button>
    );
}
