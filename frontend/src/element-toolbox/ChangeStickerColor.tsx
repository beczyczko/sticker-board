import Sticker from '../board/Sticker';
import React, { useState } from 'react';
import { StickerColor } from '../board/StickerColor';
import IconButton from '@material-ui/core/IconButton';
import PaletteIcon from '@material-ui/icons/Palette';
import Popper from '@material-ui/core/Popper';
import SelectStickerColor from '../add-sticker-dialog/select-sticker-color/SelectStickerColor';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) =>
    createStyles({
        palette: {
            paddingTop: theme.spacing(1.5),
            paddingRight: theme.spacing(2),
            paddingBottom: theme.spacing(1.5),
            paddingLeft: theme.spacing(2),
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            width: 220,
            height: 76,
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
        <div>
            <IconButton aria-label="open-color-palette" onClick={openPalette}>
                <PaletteIcon/>
            </IconButton>
            <Popper
                id="change-color-palette-popper"
                open={paletteOpen}
                placement="bottom"
                anchorEl={paletteAnchorEl}>
                <Paper className={classes.palette}>
                    <SelectStickerColor onColorSelected={c => onColorSelected(c)}
                                        initialColor={element?.color}>
                    </SelectStickerColor>
                </Paper>
            </Popper>
        </div>
    );
};

export default ChangeStickerColor;
