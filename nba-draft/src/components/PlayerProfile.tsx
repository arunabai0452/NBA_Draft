// src/components/PlayerProfile.tsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import {
    Typography,
    Grid,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    Box,
    Select,
    MenuItem,
} from "@mui/material";
import {
    Straighten as StraightenIcon,
    FitnessCenter as FitnessCenterIcon,
    Height as HeightIcon,
    DirectionsRun as DirectionsRunIcon,
    Speed as SpeedIcon,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import SportsIcon from '@mui/icons-material/Sports';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import GroupsIcon from '@mui/icons-material/Groups';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import BlockIcon from '@mui/icons-material/Block';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { scoutRankings, gameLogs, measurements, seasonLogs } from "../assets/data";
import { getGameLogsByPlayer, calculateAge, getTotalSeasonStats } from "../utils/helpers";
import ReportForm from "./ReportForm";
import ScoutRankingTable from "./ScoutRankingTable";
import type { Measurements, Player } from "../types";

interface Props {
    player: Player;
}

const playerMeasurements: Measurements[] = measurements;

const PlayerProfile: React.FC<Props> = ({ player }) => {
    const [reportList, setReportList] = useState<string[]>([]);
    const navigate = useNavigate();
    const [statMode, setStatMode] = useState<"perGame" | "totals">("perGame");
    const [selectedGameId, setSelectedGameId] = useState<number | "">("");

    const handleAddReport = (report: string) => {
        setReportList((prev) => [report, ...prev]);
    };

    const logs = useMemo(() => getGameLogsByPlayer(player.playerId, gameLogs), [player.playerId]);
    const totalsBySeason  = seasonLogs.filter((r) => r.playerId === player.playerId);
    const totalSeasonStats = getTotalSeasonStats(totalsBySeason)
    const selectedGame = logs.find((g) => g.gameId === Number(selectedGameId));
    const rankingObj = scoutRankings.find((r) => r.playerId === player.playerId);
    const measurements = playerMeasurements.find((r) => r.playerId === player.playerId);

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, m: { xs: 2, md: 10 } }}>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2, fontFamily: "'Inter', sans-serif" }}
                >
                    Back
                </Button>
            </Box>
            <Grid container spacing={4}>
                <Grid
                    size={{xs:12, md:4}}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start", // prevent stretch from taller siblings
                    }}
                >
                    <Box
                        sx={{
                            width: { xs:250, sm: 250, lg:300 },
                            height: 400,
                            overflow: "hidden",
                            borderRadius: 3,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f5f5f5",
                            flexShrink: 0, // prevent shrinking if container gets tight
                        }}
                    >
                        <img
                            src={player.photoUrl || "https://cdn.nba.com/headshots/nba/latest/1040x760/1641750.png"}
                            alt={player.name ?? "Unknown player"}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 16,
                            }}
                        />
                    </Box>
                </Grid>

                {/* Player Info and Stats */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="h4" gutterBottom>{player.name}</Typography>
                    <Grid container spacing={1} sx={{ fontFamily: "'Inter', sans-serif", mt: 1 }}>
                        {player.height && (
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="caption">
                                    <strong>Height:</strong> {player.height}
                                </Typography>
                            </Grid>
                        )}
                        {player.weight && (
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="caption">
                                    <strong>Weight:</strong> {player.weight} lbs
                                </Typography>
                            </Grid>
                        )}
                        {player.age && (
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="caption">
                                    <strong>Age:</strong> {player.age}
                                </Typography>
                            </Grid>
                        )}
                        {player.birthDate && (
                            <>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption">
                                        <strong>Age:</strong> {calculateAge(player.birthDate)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography variant="caption">
                                        <strong>DOB:</strong> {new Date(player.birthDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </>
                        )}

                        {player.nationality && (
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="caption">
                                    <strong>Nationality:</strong> {player.nationality}
                                </Typography>
                            </Grid>
                        )}
                        {player.highSchool && (
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="caption">
                                    <strong>High School:</strong> {player.highSchool}
                                </Typography>
                            </Grid>
                        )}
                        {(player.homeTown || player.homeState || player.homeCountry) && (
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="caption">
                                    <strong>Hometown:</strong>{" "}
                                    {[player.homeTown, player.homeState, player.homeCountry].filter(Boolean).join(", ")}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom>Stats</Typography>
                    <ToggleButtonGroup
                        value={statMode}
                        exclusive
                        onChange={(_, val) => {
                            if (val) {
                                setStatMode(val);
                                setSelectedGameId("");
                            }
                        }}
                        size="small"
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="perGame">Per Game</ToggleButton>
                        <ToggleButton value="totals">Season Totals</ToggleButton>
                    </ToggleButtonGroup>

                    {statMode === "perGame" && (
                        <>
                            <Select
                                value={selectedGameId}
                                onChange={(e) => setSelectedGameId(e.target.value)}
                                fullWidth
                                displayEmpty
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="">-- Select a Game --</MenuItem>
                                {logs.map((log) => (
                                    <MenuItem key={log.gameId} value={log.gameId}>
                                        {`${log.team} vs ${log.opponent} (${new Date(log.date).toLocaleDateString()})`}
                                    </MenuItem>
                                ))}
                            </Select>

                            {selectedGame && (
                                <Grid container spacing={2} sx={{ fontFamily: "'Inter', sans-serif" }}>
                                    {Object.entries(selectedGame)
                                        .filter(([key, val]) =>
                                            typeof val === "number" &&
                                            !["playerId", "gameId", "teamId", "opponentId", "isHome", "homeTeamAPTS", "visitorTeamAPTS"].includes(key)
                                        )
                                        .map(([key, val]) => {
                                            const label = key.toUpperCase();
                                            const icon = (() => {
                                                if (label.includes("PTS")) return <SportsScoreIcon color={'primary'} fontSize="small" />;
                                                if (label.includes("AST")) return <GroupsIcon color={'primary'}  fontSize="small" />;
                                                if (label.includes("REB")) return <LeaderboardIcon color={'primary'} fontSize="small" />;
                                                if (label.includes("STL")) return <RemoveRedEyeIcon color={'primary'} fontSize="small" />;
                                                if (label.includes("BLK")) return <BlockIcon color={'primary'}  fontSize="small" />;
                                                if (label.includes("FG")) return <SportsBasketballIcon color={'primary'} fontSize="small" />;
                                                if (label.includes("TP")) return <SportsIcon color={'primary'} fontSize="small" />;
                                                if (label.includes("FT")) return <SportsMartialArtsIcon color={'primary'}  fontSize="small" />;
                                                return null;
                                            })();
                                            return (
                                                <Grid size={{ xs: 12, md: 6 }} key={key}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {icon}
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {label}:
                                                        </Typography>
                                                        <Typography variant="body2">{val}</Typography>
                                                    </Stack>
                                                </Grid>
                                            );
                                        })}
                                </Grid>
                            )}
                        </>
                    )}
                    {statMode === "totals" && (
                        <Box sx={{ fontFamily: "'Inter', sans-serif" }}>
                            {Object.entries(totalSeasonStats).map(([season, stats]) => (
                                <Box key={season} sx={{ mb: 3 }}>
                                    <Box display="flex" sx={{ mb: 1 }} justifyContent="space-between" alignItems="center">
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Season:{' '}
                                            <span style={{ fontWeight: 400, fontSize: '1rem' }}>
                                                {season}
                                            </span>
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb:2 }}>
                                        Leagues:{' '}
                                        <span style={{ fontWeight: 400, fontSize: '0.9rem' }}>
                                            {Array.isArray(stats.League) ? stats.League.join(', ') : stats.League}
                                        </span>
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {Object.entries(stats)
                                            .filter(([key, val]) =>
                                                typeof val === "number" &&
                                                !["playerId", "teamId", "opponentId", "isHome", "gameId", "season"].includes(key.toLowerCase())
                                            )
                                            .map(([key, val]) => {
                                                const label = key.toUpperCase();
                                                const icon = (() => {
                                                    if (label.includes("PTS")) return <SportsScoreIcon color={'primary'}  fontSize="small" />;
                                                    if (label.includes("AST")) return <GroupsIcon color={'primary'}  fontSize="small" />;
                                                    if (label.includes("REB")) return <LeaderboardIcon color={'primary'}  fontSize="small" />;
                                                    if (label.includes("STL")) return <RemoveRedEyeIcon color={'primary'} fontSize="small" />;
                                                    if (label.includes("BLK")) return <BlockIcon color={'primary'} fontSize="small" />;
                                                    if (label.includes("FG")) return <SportsBasketballIcon color={'primary'}  fontSize="small" />;
                                                    if (label.includes("TP")) return <SportsIcon color={'primary'}  fontSize="small" />;
                                                    if (label.includes("FT")) return <SportsMartialArtsIcon color={'primary'} fontSize="small" />;
                                                    return null;
                                                })();
                                                return (
                                                    <Grid size={{ xs: 12, md: 6 }}  key={key}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            {icon}
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {label}:
                                                            </Typography>
                                                            <Typography variant="body2">{typeof val === 'number' && Math.round(val)}</Typography>
                                                        </Stack>
                                                    </Grid>
                                                );
                                            })}
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    )}


                    {rankingObj && (
                        <Box sx={{ mt: 3 }}>
                            <ScoutRankingTable playerId={player.playerId} rankings={rankingObj} />
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Measurements Section */}
            {measurements && (
                <>
                    <Divider sx={{ my: 4 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                        Measurements
                    </Typography>
                    <Grid container spacing={{ xs:0, md:2}} sx={{ fontFamily: "'Inter', sans-serif" }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {measurements.heightNoShoes && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <StraightenIcon color={'primary'}  fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Height (No Shoes):</Typography>
                                <Typography variant="body2">{measurements.heightNoShoes} in</Typography>
                            </Stack>
                            }
                            { measurements.heightShoes  && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <StraightenIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Height (Shoes):</Typography>
                                <Typography variant="body2">{measurements.heightShoes} in</Typography>
                            </Stack>
                            }
                            { measurements.wingspan && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <StraightenIcon color={'primary'}  fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Wingspan:</Typography>
                                <Typography variant="body2">{measurements.wingspan} in</Typography>
                            </Stack>
                            }      
                            {measurements.reach && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <StraightenIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Standing Reach:</Typography>
                                <Typography variant="body2">{measurements.reach} in</Typography>
                            </Stack>
                            }
                            {measurements.weight && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <FitnessCenterIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Weight:</Typography>
                                <Typography variant="body2">{measurements.weight} lbs</Typography>
                            </Stack>
                            }
                            {measurements.handLength &&
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <StraightenIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Hand Length:</Typography>
                                <Typography variant="body2">{measurements.handLength} in</Typography>
                            </Stack>
                            }
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            {measurements.handWidth && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <StraightenIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Hand Width:</Typography>
                                <Typography variant="body2">{measurements.handWidth} in</Typography>
                            </Stack>
                            }
                            {measurements.maxVertical && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <HeightIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Max Vertical:</Typography>
                                <Typography variant="body2">{measurements.maxVertical}"</Typography>
                            </Stack>
                            }
                            {measurements.noStepVertical && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <HeightIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>No Step Vertical:</Typography>
                                <Typography variant="body2">{measurements.noStepVertical}"</Typography>
                            </Stack>
                            }
                            {measurements.sprint &&
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <SpeedIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Sprint:</Typography>
                                <Typography variant="body2">{measurements.sprint}s</Typography>
                            </Stack>
                            }
                            {measurements.agility && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <DirectionsRunIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Agility:</Typography>
                                <Typography variant="body2">{measurements.agility}s</Typography>
                            </Stack>
                            }
                            {measurements.shuttleBest && <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                <DirectionsRunIcon color={'primary'} fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Shuttle (Best):</Typography>
                                <Typography variant="body2">{measurements.shuttleBest}s</Typography>
                            </Stack>
                            }
                        </Grid>
                    </Grid>
                </>
            )}
            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>Scouting Reports</Typography>
            <ReportForm onSubmit={handleAddReport} />
            <Box component="ul" sx={{ pl: 3 }}>
                {reportList.map((r, idx) => (
                    <li key={idx}>
                        <Typography variant="body2">{r}</Typography>
                    </li>
                ))}
            </Box>
        </Paper>
    );
};

export default PlayerProfile;
