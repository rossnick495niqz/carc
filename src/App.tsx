import { useEffect } from 'react'
import { Wizard } from './ui/wizard/Wizard'
import { useDataPackStore } from './core/datapack/store'
import { useWizardStore } from './ui/wizard/store'
import { decodeHashToInput } from './core/share/url'

function App() {
    const { initialize } = useDataPackStore()
    const { updateInput, setStep } = useWizardStore()

    useEffect(() => {
        initialize()
    }, [initialize])

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash && hash.length > 1) {
                const input = decodeHashToInput(hash);
                if (input) {
                    updateInput(input);
                    setStep(3); // Jump to result
                }
            }
        };

        // Check on mount
        handleHashChange();

        // Listen to changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [updateInput, setStep]);

    return (
        <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-background text-foreground">
            <div className="w-full max-w-4xl space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Auto Import
                    </h1>
                    <p className="text-muted-foreground">
                        Accurate. Official. Transparent.
                    </p>
                </header>

                <main>
                    <Wizard />
                </main>

                <footer className="text-center text-xs text-muted-foreground pt-8">
                    <p>Not an official government service. Data provided for informational purposes.</p>
                </footer>
            </div>
        </div>
    )
}

export default App
