import React, { useRef, useState, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { playerBio, scoutRankings } from "../assets/data";
import { getAverageRank } from "../utils/helpers";
import PlayerCard from "./PlayerCard";

type Player = typeof playerBio[number];
type ScoutRank = typeof scoutRankings[number];

interface PlayerWithRank extends Player {
    avgRank: number;
    ranks: ScoutRank;
}

const BigBoard: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    // States to track scroll position for arrow visibility
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Returns card width fraction based on screen size
    const getCardWidth = () => {
        if (isMobile) return 1; // 100%
        if (isTablet) return 0.5; // 50%
        return 0.33; // 33%
    };

    // Calculate scroll amount (width * fraction of one card)
    const scrollByAmount = () => {
        if (!scrollRef.current) return 0;
        const containerWidth = scrollRef.current.clientWidth;
        return containerWidth * getCardWidth();
    };

    // Scroll left or right smoothly
    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = scrollByAmount();
        scrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    // Update arrow visibility based on scroll position
    const updateScrollButtons = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 48);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    // Attach scroll and resize listeners to update arrow visibility
    useEffect(() => {
        updateScrollButtons();
        const container = scrollRef.current;
        if (!container) return;

        container.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);

        return () => {
            container.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, []);

    // Prepare players with avgRank and filter/sort them
    const playersWithRank: PlayerWithRank[] = playerBio
        .map((player) => {
            const rankObj = scoutRankings.find((r) => r.playerId === player.playerId);
            if (!rankObj) return null;
            const avgRank = getAverageRank(rankObj);
            return {
                ...player,
                avgRank,
                ranks: rankObj,
            };
        })
        .filter((p): p is PlayerWithRank => p !== null)
        .sort((a, b) => a.avgRank - b.avgRank);

    return (
        <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                        background: "linear-gradient(145deg, #0f4c81, #1d70b7)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0)",
                        fontWeight: "900",
                        fontSize: {
                            xs: "1.5rem",  
                            sm: "1.5rem",   
                            md: "2.5rem",  
                        },
                        letterSpacing: 1,
                    }}
                >
                    Mavericks Draft Hub
                </Typography>
            </Box>

            <Box
                position="relative"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {canScrollLeft && (
                    <IconButton
                        onClick={() => scroll("left")}
                        sx={{
                            position: "absolute",
                            left: {
                                xs: -30,
                                sm: -30,
                                md: -40,
                            },
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            boxShadow: "none",
                            borderRadius: 0,
                            color: "white",
                            zIndex: 2,
                            padding: "6px",
                        }}
                        aria-label="scroll left"
                    >
                        <ArrowBackIosIcon sx={{ fontSize: "38px" }} />
                    </IconButton>
                )}

                <Box
                    ref={scrollRef}
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: 5,
                        width: "100%",
                        scrollBehavior: "smooth",
                        "&::-webkit-scrollbar": { display: "none" },
                        scrollbarWidth: "none",
                        scrollSnapType: "x mandatory",
                        px: 6,
                    }}
                >
                    {playersWithRank.map((player) => (
                        <Box
                            key={player?.playerId}
                            sx={{
                                flex: "0 0 auto",
                                backgroundColor: "white",
                                borderRadius: "10px",
                                width: {
                                    xs: "100%",
                                    sm: "48%",
                                    md: "28%",
                                },
                                scrollSnapAlign: "start",
                                overflow: "hidden",
                            }}
                        >
                            <PlayerCard
                                playerId={player.playerId}
                                name={player.name}
                                team={player.currentTeam}
                                position={player.position}
                                photoUrl={player.photoUrl}
                                avgRank={player.avgRank}
                                height={player.height}
                                weight={player.weight}
                                birthDate={player.birthDate}
                                highSchool={player.highSchool}
                                homeTown={player.homeTown}
                                homeState={player.homeState}
                                homeCountry={player.homeCountry}
                                nationality={player.nationality}
                            />
                        </Box>
                    ))}
                </Box>

                {/* Right Arrow */}
                {canScrollRight && (
                    <IconButton
                        onClick={() => scroll("right")}
                        sx={{
                            position: "absolute",
                            right: {
                                xs: -30,
                                sm: -30,
                                md: -40,
                            },
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            boxShadow: "none",
                            borderRadius: 0,
                            color: "white",
                            zIndex: 2,
                            padding: "6px",
                        }}
                        aria-label="scroll right"
                    >
                        <ArrowForwardIosIcon sx={{ fontSize: "38px" }} />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};

export default BigBoard;
