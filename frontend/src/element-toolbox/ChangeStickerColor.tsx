import Sticker from '../board/Sticker';
import React, { useState } from 'react';
import { StickerColor } from '../board/StickerColor';
import Popper from '@material-ui/core/Popper';
import StickerColorPalette from '../add-sticker-dialog/select-sticker-color/StickerColorPalette';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import ColorSampleButton from '../add-sticker-dialog/select-sticker-color/ColorSampleButton';

const useStyles = makeStyles((theme) =>
    createStyles({
        openPaletteButton: {
            padding: theme.spacing(0.5),
            display: 'flex'
        },
        palette: {
            padding: theme.spacing(1),
            marginTop: theme.spacing(1.5),
            marginBottom: theme.spacing(1),
            width: 228,
            pointerEvents: 'initial',
        },
        popper: {
            pointerEvents: 'none',
        }
    }),
);

export interface ChangeStickerColor {
    children: never[],
    element: Sticker
}

const ChangeStickerColor = ({ element }: ChangeStickerColor) => {
    const classes = useStyles();

    const [paletteOpen, setPaletteOpen] = useState(false);
    const [paletteAnchorEl, setPaletteAnchorEl] = useState<HTMLButtonElement | null>(null);

    const onColorSelected = (c: StickerColor | undefined) => {
        if (c && element && !c.equals(element.color)) {
            element.updateColor(c);
            setPaletteOpen(false);
            setPaletteAnchorEl(null);
        }
    };

    const openPalette = (e: any) => {
        if (paletteOpen) {
            setPaletteOpen(false);
            setPaletteAnchorEl(null);
        } else {
            setPaletteOpen(true);
            setPaletteAnchorEl(e.currentTarget);
        }
    };

    return (
        <>
            <div className={classes.openPaletteButton}>
                <Tooltip title="Change color">
                    <ColorSampleButton aria-label="open-color-palette"
                                       onClick={openPalette}
                                       color={element.color}
                                       isSelected={false}>
                    </ColorSampleButton>
                </Tooltip>
            </div>
            <Popper
                id="change-color-palette-popper"
                open={paletteOpen}
                placement="bottom"
                anchorEl={paletteAnchorEl}>
                <Paper className={classes.palette}>
                    <StickerColorPalette onColorSelected={c => onColorSelected(c)}
                                         initialColor={element?.color}>
                    </StickerColorPalette>
                </Paper>
            </Popper>
        </>
    );
};

export default ChangeStickerColor;
