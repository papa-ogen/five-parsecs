export const DEFAULT_UNIT_SYSTEM = 'imperial';
export const CREW_COMPOSITION_METHODS = [
    { label: 'First Timer', value: 'first-timer', description: 'Only humans' },
    /* { label: 'Standard', value: 'standard', description: '3 are human, 2 human or alien, 1 human or bot' }, */
    { label: 'Miniatures', value: 'miniatures', description: 'Use the minis you have!' },
    { label: 'Random', value: 'random', description: 'Random crew' },
] as const;
export const DEFAULT_CREW_COMPOSITION_METHOD = CREW_COMPOSITION_METHODS[0].value;
export const DEFAULT_CREW_SIZE = 6;
