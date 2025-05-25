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
import { v4 as uuidv4 } from "uuid";

interface ScoutingReport {
    scout: string;
    reportId: string;
    playerId: number;
    report: string;
}

interface Props {
    onSubmit: (report: ScoutingReport) => void;
    playerId: number;
}

const ReportForm: React.FC<Props> = ({ onSubmit, playerId }) => {
    const [scoutName, setScoutName] = useState<string>("");
    const [reportText, setReportText] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (scoutName.trim() && reportText.trim()) {
            setConfirmOpen(true); // Open confirmation dialog
        }
    };

    const handleConfirm = () => {
        const newReport: ScoutingReport = {
            scout: scoutName.trim(),
            reportId: uuidv4(),
            playerId,
            report: reportText.trim(),
        };

        onSubmit(newReport); 
        setScoutName("");
        setReportText("");
        setConfirmOpen(false);
    };

    const handleCancel = () => {
        setConfirmOpen(false);
    };

    return (
        <>
            <Box component="form" onSubmit={handleFormSubmit} sx={{ mb: 2 }}>
                <TextField
                    label="Scout Name"
                    value={scoutName}
                    onChange={(e) => setScoutName(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Add Scouting Report"
                    placeholder="Write your evaluation here..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!scoutName.trim() || !reportText.trim()}
                >
                    Submit Report
                </Button>
            </Box>

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
