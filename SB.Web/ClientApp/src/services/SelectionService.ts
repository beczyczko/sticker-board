import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ElementSelected } from './ElementSelected';
import Sticker from '../board/Sticker';

export class SelectionService {
    private static selectionService$ = new BehaviorSubject<SelectionService | undefined>(undefined);

    public static initialize(boardHtmlLayer: HTMLElement): SelectionService {
        const selectionService = new SelectionService(boardHtmlLayer);
        this.selectionService$.next(selectionService);
        return selectionService;
    }

    public static get instance$(): Observable<SelectionService | undefined> {
        return this.selectionService$.asObservable();
    }

    private selectionMarkers = new Set<HTMLElement>();
    private selectedElements = new Set<string>();

    private _singleSelectedElement$ = new Subject<ElementSelected | null>();

    public get singleSelectedElement$(): Observable<ElementSelected | null> {
        return this._singleSelectedElement$.asObservable();
    }

    private selectionLayer: HTMLElement;

    private constructor(private readonly boardHtmlLayer: HTMLElement) {
        const selectionLayer = document.createElement('div');
        selectionLayer.id = 'selection-layer';
        selectionLayer.style.zIndex = '9999'; //todo db find out what is max
        selectionLayer.style.position = 'fixed';
        selectionLayer.style.width = '100%';
        selectionLayer.style.height = '100%';
        selectionLayer.style.pointerEvents = 'none';

        boardHtmlLayer.appendChild(selectionLayer);

        this.selectionLayer = selectionLayer;
    }

    public clearSelection(): void {
        this.selectionMarkers.forEach(m => {
            this.selectionLayer.removeChild(m);
        });

        this.selectedElements.clear();
        this.selectionMarkers.clear();
        this._singleSelectedElement$.next(null);
    }

    public elementSelected(elementId: string, singleSelection: boolean, selectedElementData: Sticker): void {
        if (singleSelection) {

            if (this.selectedElements.size === 1 && this.selectedElements.has(elementId)) {
                return;
            }

            this.clearSelection();

            const selectionMarker = this.addSelectionMarker(elementId);
            if (selectionMarker) {
                this._singleSelectedElement$.next(new ElementSelected(selectedElementData, selectionMarker));
            }
        } else {

            if (!this.selectedElements.has(elementId)) {
                this.addSelectionMarker(elementId);
            }
        }
    }

    private addSelectionMarker(elementId: string): HTMLElement | null {
        this.selectedElements.add(elementId);

        return this.showSelectionMarker(elementId);
    }

    public showSelectionMarker(elementId: string): HTMLElement | null {
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
            this.selectionMarkers.add(selectionElement);
            return selectionElement;
        }

        return null;
    }
}
