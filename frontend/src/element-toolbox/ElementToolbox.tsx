import React, { useEffect, useState } from 'react';
import { SelectionService } from '../services/SelectionService';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { createStyles } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Sticker from '../board/Sticker';
import RemoveElement from './RemoveElement';
import ChangeStickerColor from './ChangeStickerColor';
import Board from '../board/Board';

const useStyles = makeStyles((theme) =>
    createStyles({
        toolbox: {
            display: 'flex',
            paddingTop: theme.spacing(0.5),
            paddingRight: theme.spacing(1),
            paddingBottom: theme.spacing(0.5),
            paddingLeft: theme.spacing(1),
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            pointerEvents: 'initial',
        },
        popper: {
            pointerEvents: 'none',
        }
    }),
);

interface ElementToolboxProps {
    children: never[],
    board: Board;
}

const ElementToolbox = ({ board }: ElementToolboxProps) => {
    const classes = useStyles();

    const [initialized, setInitialized] = useState(false);

    const [toolboxOpen, setToolboxOpen] = useState(false);

    const [toolboxAnchorEl, setToolboxAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedElementData, setSelectedElementData] = useState<Sticker | null>(null);

    useEffect(() => {
        if (!initialized) {
            SelectionService.instance$
                .pipe(
                    filter(ss => !!ss),
                    map(ss => ss as SelectionService),
                    tap((ss: SelectionService) => subscribeToSelectionElementChanged(ss))
                )
                .subscribe()
        }

        setInitialized(true);
    }, [initialized]);

    const subscribeToSelectionElementChanged = (selectionService: SelectionService) => {
        selectionService.singleSelectedElement$
            .pipe(
                tap(element => {
                    setToolboxOpen(false);
                    setToolboxAnchorEl(null);
                    setSelectedElementData(null);
                }),
                debounceTime(300),
                tap(element => {
                    if (element) {
                        setToolboxOpen(true);
                        setToolboxAnchorEl(element.htmlElement);
                        setSelectedElementData(element.elementData);
                    } else {
                        setToolboxOpen(false);
                        setToolboxAnchorEl(null);
                        setSelectedElementData(null);
                    }
                }))
            .subscribe();
    };

    return (
        <div>
            {toolboxAnchorEl &&
            <Popper
                id="toolbox-popper"
                className={classes.popper}
                placement="top"
                open={toolboxOpen}
                anchorEl={toolboxAnchorEl}>
                <Paper className={classes.toolbox}>
                    {selectedElementData &&
                    <ChangeStickerColor element={selectedElementData}>
                    </ChangeStickerColor>
                    }
                    {selectedElementData &&
                    <RemoveElement element={selectedElementData} board={board}>
                    </RemoveElement>
                    }
                </Paper>
            </Popper>
            }
        </div>
    );
};

export default ElementToolbox;
