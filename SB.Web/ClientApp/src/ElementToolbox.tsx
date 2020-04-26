import React, { useEffect, useState } from 'react';
import { Popper } from '@material-ui/core';
import { SelectionService } from './services/SelectionService';
import { filter, map, tap } from 'rxjs/operators';

const ElementToolbox = ({ props }: any) => {

    const [initialized, setInitialized] = useState(false);

    const [toolboxOpen, setToolboxOpen] = useState(false);

    const [toolboxAnchorEl, setToolboxAnchorEl] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!initialized) {
            SelectionService.instance$
                .pipe(
                    filter(ss => !!ss),
                    map(ss => ss as SelectionService),
                    tap((ss: SelectionService) => {
                        ss.singleSelectedElement$
                            .pipe(
                                tap(element => {
                                    if (element) {
                                        setToolboxOpen(true);
                                        setToolboxAnchorEl(element.htmlElement);
                                    } else {
                                        setToolboxOpen(false);
                                        setToolboxAnchorEl(null);
                                    }
                                    // todo db handle console error on first selection
                                }))
                            .subscribe();
                    })
                )
                .subscribe()
        }

        setInitialized(true);
    }, [initialized]);

    return (
        <div>
            <Popper
                id="toolbox-popper"
                placement="top"
                open={toolboxOpen}
                anchorEl={toolboxAnchorEl}
            >TEST
            </Popper>
        </div>
    );
};

export default ElementToolbox;
