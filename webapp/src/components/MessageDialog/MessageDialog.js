import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

function MessageDialog({ title, msg, open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>

                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <span>Error</span>
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {msg}
                </DialogContentText>
                <DialogActions>
                    <Button variant="contained" onClick={onClose} color="primary" autoFocus>OK</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

export default MessageDialog;