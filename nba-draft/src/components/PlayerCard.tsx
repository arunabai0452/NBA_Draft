import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
    playerId: number;
    name: string;
    team: string;
    photoUrl: string | null;
    avgRank: number;
    height?: number;
    weight?: number;
    birthDate?: string;
    highSchool: string | null;
    homeTown?: string;
    homeState: string | null;
    homeCountry?: string;
    nationality?: string;
}

const PlayerCard: React.FC<Props> = ({
    playerId,
    name,
    team,
    photoUrl,
    avgRank,
    height,
    weight,
    birthDate,
    highSchool,
    homeTown,
    homeState,
    homeCountry,
    nationality,
}) => {
    const imageUrl =
        photoUrl || "https://cdn.nba.com/headshots/nba/latest/1040x760/1641750.png";

    return (
        <Card
            component={Link}
            to={`/player/${playerId}`}
            sx={{
                backgroundColor: "#fff",
                textDecoration: "none",
                color: "inherit",
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: 6,
                },
                maxWidth: 345,
                mx: "auto",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    height: { xs: 200, sm: 250, md: 300 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                }}
            >
                <img
                    src={imageUrl}
                    alt={name}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom align="center">
                    {name}
                </Typography>

                <Typography variant="body2" color="text.secondary" align="center" mb={1}>
                    {team} 
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Grid container spacing={1}>
                    {height && (
                        <Grid size={{xs:6}}>
                            <Typography variant="caption">
                                <strong>Height:</strong> {height}"
                            </Typography>
                        </Grid>
                    )}
                    {weight && (
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="caption">
                                <strong>Weight:</strong> {weight} lbs
                            </Typography>
                        </Grid>
                    )}
                    {birthDate && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="caption">
                                <strong>DOB:</strong> {new Date(birthDate).toLocaleDateString()}
                            </Typography>
                        </Grid>
                    )}
                    {nationality && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="caption">
                                <strong>Nationality:</strong> {nationality}
                            </Typography>
                        </Grid>
                    )}
                    {highSchool && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="caption">
                                <strong>High School:</strong> {highSchool}
                            </Typography>
                        </Grid>
                    )}
                    {(homeTown || homeState || homeCountry) && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="caption">
                                <strong>Hometown:</strong>{" "}
                                {[homeTown, homeState, homeCountry].filter(Boolean).join(", ")}
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                <Divider sx={{ my: 1 }} />

                <Typography variant="body2" fontWeight="medium" align="center">
                    <strong>Avg Rank:</strong> {avgRank.toFixed(2)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default PlayerCard;
