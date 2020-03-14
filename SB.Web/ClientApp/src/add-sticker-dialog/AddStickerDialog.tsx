import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SelectStickerColor from './select-sticker-color/SelectStickerColor';
import { StickerColor } from '../board/StickerColor';

const textElementId = 'sticker-text';

interface AddStickerDialogProps {
    children: never[],
    open: boolean,
    setOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    onSaveCallback: (stickerText: string, color: StickerColor) => void
}

const AddStickerDialog = ({ open, setOpen, onSaveCallback }: AddStickerDialogProps) => {

    const [stickerText, setStickerText] = useState('');
    const [selectedColor, setSelectedColor] = useState<StickerColor>(StickerColor.default);

    const onSave = () => {
        onSaveCallback(stickerText, selectedColor);
        setOpen(false);
        setStickerText('');
    };

    const onCancel = () => {
        setOpen(false);
        setStickerText('');
    };

    const updateStickerText = (e: any) => {
        setStickerText(e.target.value);
    };

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                const textElement = document.getElementById(textElementId);
                if (textElement) {
                    textElement.focus();
                }
            });
        }
    }, [open]);

    const keyPress = (e: any) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            onSave();
        }
    };

    const onColorSelected = (color: StickerColor | undefined) => {
        const stickerColor = color ?? StickerColor.default;
        setSelectedColor(stickerColor);
    };

    return (
        <div>
            <Dialog open={open} onClose={onCancel}>
                <DialogTitle>Add new sticker
                </DialogTitle>

                <DialogContent>
                    <SelectStickerColor onColorSelected={c => onColorSelected(c)}>
                    </SelectStickerColor>
                    <TextField
                        autoFocus
                        margin="dense"
                        id={textElementId}
                        label="Sticker text"
                        type="text"
                        multiline
                        fullWidth
                        value={stickerText}
                        onChange={updateStickerText}
                        onKeyDown={keyPress}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddStickerDialog;
