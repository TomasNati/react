
export type PagerOptionValues = 'Get More (manual)' | 'Get More (automático)' | 'Clásico'

interface PagerOptionsProps {
    onSelectOption: (value: PagerOptionValues) => void
    selectedOption: PagerOptionValues
}
export const PagerOptions = ({onSelectOption, selectedOption}: PagerOptionsProps) => {

    return (
        <div className="pager-options">
            <button 
                className={`button button_small ${selectedOption === "Get More (manual)" ? 'button-selected' : ''}`}
                onClick={() => onSelectOption('Get More (manual)')}
            >
                Get More (manual)
            </button>
            <button 
                className={`button button_small ${selectedOption === "Get More (automático)" ? 'button-selected' : ''}`}
                onClick={() => onSelectOption('Get More (automático)')}
            >
                Get More (automático)
            </button>
            <button 
                className={`button button_small ${selectedOption === "Clásico" ? 'button-selected' : ''}`}
                onClick={() => onSelectOption('Clásico')}
            >
                Clásico
            </button>
        </div>
    )
}
