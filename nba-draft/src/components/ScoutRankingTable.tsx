import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Box,
} from "@mui/material";
import { getRankStats } from "../utils/helpers";

interface Props {
    playerId: number;
    rankings: Record<string, number | null> & { playerId: number };
}

const ScoutRankingTable: React.FC<Props> = ({ rankings }) => {
    const scoutEntries = Object.entries(rankings).filter(
        ([key]) => key !== "playerId"
    );

    return (
        <Box
            sx={{
                mt: 4,
                px: 2,
                pt: 2,
                pb: 3,
                backgroundColor: "#fafafa",
                borderRadius: 2,
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Scout Rankings
            </Typography>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Scout</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Ranking</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {scoutEntries.map(([scout, rank]) => {
                        const { isHigh, isLow } = getRankStats(rankings, scout);
                        let color = "inherit";
                        if (isHigh) color = "green";
                        else if (isLow) color = "red";

                        return (
                            <TableRow key={scout}>
                                <TableCell sx={{ py: 1 }}>{scout}</TableCell>
                                <TableCell align="right" sx={{ color, py: 1, px: 5 }}>
                                    {rank ?? "N/A"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
    );
};

export default ScoutRankingTable;
