import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme="light"
            className="toaster group"
            position="bottom-right"
            style={
                {
                    '--normal-bg': '#ffffff',
                    '--normal-text': '#0f172a',
                    '--normal-border': '#e2e8f0',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
