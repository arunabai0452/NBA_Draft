import React, { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";

interface Props {
    onSubmit: (report: string) => void;
}

const ReportForm: React.FC<Props> = ({ onSubmit }) => {
    const [value, setValue] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            setConfirmOpen(true); // Open confirmation dialog
        }
    };

    const handleConfirm = () => {
        onSubmit(value.trim()); // Submit after confirmation
        setValue("");
        setConfirmOpen(false);
    };

    const handleCancel = () => {
        setConfirmOpen(false); // Close dialog without submitting
    };

    return (
        <>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ mb: 2 }}>
                <TextField
                    label="Add Scouting Report"
                    placeholder="Write your evaluation here..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" disabled={!value.trim()}>
                    Submit Report
                </Button>
            </Box>

            {/* Confirm Dialog */}
            <Dialog open={confirmOpen} onClose={handleCancel}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to submit this scouting report?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReportForm;