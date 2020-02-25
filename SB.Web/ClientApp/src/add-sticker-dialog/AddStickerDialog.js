import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const textElementId = 'sticker-text';

const AddStickerDialog = ({ open, setOpen, onSaveCallback }) => {

    const [stickerText, setStickerText] = useState('');

    const onSave = () => {
        onSaveCallback(stickerText);
        setOpen(false);
        setStickerText('');
    };

    const onCancel = () => {
        setOpen(false);
        setStickerText('');
    };

    const updateStickerText = e => {
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

    const keyPress = e => {
        //todo db add num-pad enter i condition, can't test it right now
        if (e.keyCode === 13) {
            e.preventDefault();
            onSave();
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={onCancel}>
                <DialogTitle>Add new sticker</DialogTitle>

                <DialogContent>
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
