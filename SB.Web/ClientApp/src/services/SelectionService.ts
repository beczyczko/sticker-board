export class SelectionService {
    private static selectionService: SelectionService;

    public static get instance(): SelectionService {
        if (!this.selectionService) {
            this.selectionService = new SelectionService();
        }

        return this.selectionService;
    }

    private selectionMarkers = new Set<HTMLElement>();
    private selectedElements = new Set<string>();

    private selectionLayer: HTMLElement;

    constructor() {
        const selectionLayer = document.createElement('div');
        selectionLayer.id = 'selection-layer';
        selectionLayer.style.zIndex = '9999'; //todo db find out what is max
        selectionLayer.style.position = 'fixed';
        selectionLayer.style.width = '100%';
        selectionLayer.style.height = '100%';
        selectionLayer.style.pointerEvents = 'none';

        const boardHtmlElementsLayer = document.getElementById('board-html-layer');
        boardHtmlElementsLayer?.appendChild(selectionLayer);

        this.selectionLayer = selectionLayer;
    }

    public clearSelection(): void {

        this.selectionMarkers.forEach(m => {
            this.selectionLayer.removeChild(m);
        });

        this.selectedElements.clear();
        this.selectionMarkers.clear();
    }

    public elementSelected(elementId: string, singleSelection: boolean, showToolbarAction: () => void): void {
        if (singleSelection) {
            console.log('addSelectedElement singleSelection', elementId);

            if (this.selectedElements.size === 1 && this.selectedElements.has(elementId)) {
                console.log('already selected');
                return;
            }

            this.clearSelection();

            showToolbarAction();
        }

        if (!this.selectedElements.has(elementId)) {
            this.addSelectionMarker(elementId);
        }
    }

    private addSelectionMarker(elementId: string) {
        this.selectedElements.add(elementId);

        this.showSelectionMarker(elementId);
    }

    public showSelectionMarker(elementId: string) {
        const htmlElementId = `selection-${elementId}`;
        const selectedElement = document.getElementById(elementId);
        if (selectedElement) {

            const selectionElement = document.createElement('div');
            selectionElement.id = htmlElementId;

            selectionElement.style.border = '2px dashed rgb(17, 95, 221)';
            selectionElement.style.background = 'transparent';
            selectionElement.style.pointerEvents = 'none';
            selectionElement.style.marginTop = '-2px';
            selectionElement.style.marginLeft = '-2px';

            const boundingClientRect = selectedElement.getBoundingClientRect();

            selectionElement.style.width = `${boundingClientRect.width}px`;
            selectionElement.style.height = `${boundingClientRect.height}px`;

            selectionElement.style.position = 'fixed';
            selectionElement.style.top = `${boundingClientRect.y}px`;
            selectionElement.style.left = `${boundingClientRect.x}px`;

            this.selectionLayer.appendChild(selectionElement);
            this.selectionMarkers.add(selectionElement)
        }
    }
}
