import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const AddStickerDialog = ({positionX, positionY, open, onCloseHandle}) => {

    const [stickerText, setStickerText] = useState('');

    const onClose = () => {
        onCloseHandle(stickerText);
        setStickerText('');
    };

    const updateStickerText = e => {
        setStickerText(e.target.value);
    };

    return (
        <div>
            <Dialog open={open} onClose={onClose}>
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
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onClose} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddStickerDialog;
