import React from "react";
import { Container, Box } from "@mui/material";
import { redirect } from "react-router-dom";
import BigBoard from "../components/BigBoard";

const Home: React.FC = () => {
    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                backgroundImage: '/logo-background.png',
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    flexGrow: 1,
                    px: { xs: 2, sm: 3 },
                    py: 2,
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
                <BigBoard />
            </Container>
        </Box>
    );
};

export default Home;
