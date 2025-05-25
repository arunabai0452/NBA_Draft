// src/pages/Profile.tsx

import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import PlayerProfile from "../components/PlayerProfile";
import { playerBio } from "../assets/data";

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const player = playerBio.find((p) => p.playerId.toString() === id);

    if (!player) {
        return (
            <Container>
                <Typography variant="h5" color="error">
                    Player not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container
            maxWidth={false}
            sx={{
                flexGrow: 1,
                px: { xs: 2, sm: 3 },
                py: 2,
                minHeight: "100vh",
                position: "relative",
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/Mav.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color: "white", // Ensure content is readable on dark background
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <a href="https://www.mavs.com/" target="_self" rel="noopener noreferrer">
                    <img
                        src="/Dallas_logo.png"
                        alt="Mavericks Logo"
                        style={{ height: 100, cursor: "pointer" }}
                    />
                </a>
            </Box>
            <PlayerProfile player={player} />
        </Container>
    );
};

export default Profile;
