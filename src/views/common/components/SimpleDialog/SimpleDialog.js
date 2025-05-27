import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import { blue } from '@material-ui/core/colors';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    size: {
        width: 469,
        height: 319,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(../../../../../../images/dialog_bg.svg)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left bottom",
    },
});

const SimpleDialog = ({ dialogProps, onClose, use }) => {
    const classes = useStyles();
    const {
        status,
        message = "Are you sure you want to take this action?",
        messageNewLine = "This action can not be undone.",
        trueButt = "Yes",
        falseButt = "No",
        noButtons = false
    } = dialogProps;
    const handleClose = (resp = false) => {
        onClose(use, resp);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={status}
            classes={{
                paper: classes.size
            }}
        >
            <IconButton
                size="small" style={{ position: "absolute", top: 10, right: 10 }}
                onClick={() => handleClose(false)}
            ><CancelIcon /></IconButton>
            <img
                src="../../../../../../images/dialog_img.svg"
                alt="Say Mind"
                width={104}
            />
            <div style={{ color: "#010A43", fontSize: 14, marginTop: 22, textAlign: "center" }}>{message}<br />{messageNewLine}</div>
            {!noButtons &&
                <div style={{ marginTop: 40, }}>
                    <Button
                        style={{ width: 60, height: 30, textTransform: "none", border: "solid 1.5px #666666", marginRight: 20 }}
                        onClick={() => handleClose(false)}
                    >{falseButt}</Button>
                    <Button
                        style={{ width: 60, height: 30, textTransform: "none", border: "solid 1.5px #000000" }}
                        variant="contained"
                        onClick={() => handleClose(true)}
                    >{trueButt}</Button>
                </div>
            }

        </Dialog>
    );
}

SimpleDialog.propTypes = {
    // onClose: PropTypes.func.isRequired,
    // open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    use: PropTypes.string.isRequired,
    // selectedValue: PropTypes.string.isRequired,
};

export default SimpleDialog;
