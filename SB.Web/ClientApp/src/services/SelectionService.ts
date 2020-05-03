import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SelectionMarker } from './SelectionMarker';
import Sticker from '../board/Sticker';
import { ElementChangedService } from './ElementChangedService';
import { ViewChangedService } from './ViewChangedService';
import { filter, tap } from 'rxjs/operators';

export class SelectionService {
    private static selectionService$ = new BehaviorSubject<SelectionService | undefined>(undefined);

    public static initialize(
        boardHtmlLayer: HTMLElement,
        viewChangedService: ViewChangedService): SelectionService {
        const selectionService = new SelectionService(boardHtmlLayer, viewChangedService);
        this.selectionService$.next(selectionService);
        return selectionService;
    }

    public static get instance$(): Observable<SelectionService | undefined> {
        return this.selectionService$.asObservable();
    }

    private selectionMarkers = new BehaviorSubject<Array<SelectionMarker>>(new Array<SelectionMarker>());
    private selectedElements = new BehaviorSubject<Array<Sticker>>(new Array<Sticker>());

    private _singleSelectedElement$ = new Subject<SelectionMarker | null>();

    public get singleSelectedElement$(): Observable<SelectionMarker | null> {
        return this._singleSelectedElement$.asObservable();
    }

    private selectionLayer: HTMLElement;

    private constructor(
        private readonly boardHtmlLayer: HTMLElement,
        private readonly viewChangedService: ViewChangedService) {
        const selectionLayer = document.createElement('div');
        selectionLayer.id = 'selection-layer';
        selectionLayer.style.zIndex = '2147483647';
        selectionLayer.style.position = 'fixed';
        selectionLayer.style.width = '100%';
        selectionLayer.style.height = '100%';
        selectionLayer.style.pointerEvents = 'none';

        boardHtmlLayer.appendChild(selectionLayer);
        this.selectionLayer = selectionLayer;

        this.configureSelectionFlow();
    }

    private configureSelectionFlow() {
        ElementChangedService.elementChanged$
            .pipe(filter(element => this.selectedElements.value.some(e => e.id === element.id)))
            .subscribe(() => {
                this.showSelectionMarkers(this.selectedElements.value);
            });

        this.viewChangedService.viewChanged$.subscribe(() => {
            this.showSelectionMarkers(this.selectedElements.value);
        });

        this.selectedElements
            .pipe(
                filter(elements => elements.length === 1),
                tap(elements => this.showSelectionMarkers(elements))
            )
            .subscribe();

        this.selectedElements
            .pipe(
                filter(elements => elements.length === 0),
                tap(() => this.removeSelectionMarkers())
            )
            .subscribe();

        this.selectionMarkers
            .pipe(
                filter(elements => elements.length === 1),
                tap(elements => this._singleSelectedElement$.next(elements[0]))
            )
            .subscribe();
    }

    public selectElement(singleSelection: boolean, selectedElementData: Sticker): void {
        if (singleSelection) {

            const selectedElements = this.selectedElements.value;
            const elementAlreadySelected = selectedElements.find(s => s === selectedElementData);
            if (this.selectedElements.value.length === 1 && elementAlreadySelected) {
                return;
            }

            this.selectedElements.next(new Array<Sticker>(selectedElementData));
        } else {
            // not supported at this point
            const elementAlreadySelected = this.selectedElements.value.find(s => s === selectedElementData);
            if (!elementAlreadySelected) {
                this.showSelectionMarker(selectedElementData);
            }
        }
    }

    public clearSelection(): void {
        this.selectedElements.next(new Array<Sticker>());
        this.removeSelectionMarkers();
    }

    private showSelectionMarkers(elements: Array<Sticker>): void {
        this.removeSelectionMarkers();
        const selectionMarkers = elements
            .map(element => this.showSelectionMarker(element))
            .filter(m => !!m)
            .map(m => m as SelectionMarker);
        this.selectionMarkers.next(selectionMarkers);
    }

    private removeSelectionMarkers() {
        this.selectionMarkers.value.forEach(m => {
            this.selectionLayer.removeChild(m.htmlElement);
        });

        this.selectionMarkers.next(new Array<SelectionMarker>());
        this._singleSelectedElement$.next(null);
    }

    private showSelectionMarker(element: Sticker): SelectionMarker | null {
        const htmlElementId = `selection-${element.htmlElementId}`;
        const selectedElement = document.getElementById(element.htmlElementId);
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
            return new SelectionMarker(element, selectionElement);
        }

        return null;
    }
}
