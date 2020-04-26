import React, { useEffect, useState } from 'react';
import { SelectionService } from './services/SelectionService';
import { filter, map, tap } from 'rxjs/operators';
import SelectStickerColor from './add-sticker-dialog/select-sticker-color/SelectStickerColor';
import { StickerColor } from './board/StickerColor';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { createStyles } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Sticker from './board/Sticker';

const useStyles = makeStyles((theme) =>
    createStyles({
        colorPicker: {
            paddingTop: theme.spacing(1.5),
            paddingRight: theme.spacing(2),
            paddingBottom: theme.spacing(1.5),
            paddingLeft: theme.spacing(2),
            width: 220,
            height: 76,
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
        },
    }),
);

const ElementToolbox = ({ props }: any) => {
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
                    tap((ss: SelectionService) => {
                        ss.singleSelectedElement$
                            .pipe(
                                tap(element => {
                                    if (element) {
                                        setToolboxOpen(true);
                                        setToolboxAnchorEl(element.htmlElement);
                                        setSelectedElementData(element.element);
                                    } else {
                                        setToolboxOpen(false);
                                        setToolboxAnchorEl(null);
                                        setSelectedElementData(null);
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

    const onColorSelected = (c: StickerColor | undefined) => {
        if (c && selectedElementData && !c.equals(selectedElementData.color)) {
            selectedElementData.updateColor(c);
        }
    };

    return (
        <div>
            <Popper
                id="toolbox-popper"
                placement="top"
                open={toolboxOpen}
                anchorEl={toolboxAnchorEl}>
                <Paper className={classes.colorPicker}>
                    <SelectStickerColor onColorSelected={c => onColorSelected(c)}
                                        initialColor={selectedElementData?.color}>
                    </SelectStickerColor>
                </Paper>
            </Popper>
        </div>
    );
};

export default ElementToolbox;
