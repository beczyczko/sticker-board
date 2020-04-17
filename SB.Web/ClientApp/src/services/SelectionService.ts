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

    public clearSelection(): void {

        const boardHtmlElementsLayer = document.getElementById('board-html-elements-layer');

        this.selectionMarkers.forEach(m => {
            boardHtmlElementsLayer?.removeChild(m);
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

            //todo db style - make it prettier
            selectionElement.style.border = '2px dashed rgb(17, 95, 221)';
            selectionElement.style.background = 'transparent';
            selectionElement.style.pointerEvents = 'none';
            selectionElement.style.marginTop = '-2px';
            selectionElement.style.marginLeft = '-2px';

            selectionElement.style.width = selectedElement.style.width;
            selectionElement.style.height = selectedElement.style.height;

            selectionElement.style.zIndex = '9999'; //todo db find out what is max
            selectionElement.style.position = 'fixed';
            selectionElement.style.top = selectedElement.style.top;
            selectionElement.style.left = selectedElement.style.left;

            const boardHtmlElementsLayer = document.getElementById('board-html-elements-layer');
            boardHtmlElementsLayer?.appendChild(selectionElement);
            this.selectionMarkers.add(selectionElement)
        }
    }
}
