import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const AddStickerDialog = ({open, setOpen, onSaveCallback}) => {

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

    return (
        <div>
            <Dialog open={open} onClose={onCancel}>
                <DialogTitle>dialog title</DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Sticker text"
                        type="text"
                        fullWidth
                        value={stickerText}
                        onChange={updateStickerText}
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
