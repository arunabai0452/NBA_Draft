import React, { useRef, useState, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilterListIcon from "@mui/icons-material/FilterList";
import { playerBio, scoutRankings } from "../assets/data";
import { getAverageRank } from "../utils/helpers";
import PlayerCard from "./PlayerCard";

type Player = typeof playerBio[number];
type ScoutRank = typeof scoutRankings[number];

type PlayerWithRank = Player & {
    avgRank: number;
    ranks: ScoutRank;
};

type Filters = {
    homeCountry: string;
    homeState: string;
    highSchool: string;
};

const BigBoard: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>({
        homeCountry: "",
        homeState: "",
        highSchool: "",
    });


    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const getCardWidth = () => {
        if (isMobile) return 1;
        if (isTablet) return 0.5;
        return 0.33;
    };

    const scrollByAmount = () => {
        if (!scrollRef.current) return 0;
        const containerWidth = scrollRef.current.clientWidth;
        return containerWidth * getCardWidth();
    };

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = scrollByAmount();
        scrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    const updateScrollButtons = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 48);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

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


    const uniqueValues = {
        homeCountry: [...new Set(playersWithRank.map((p) => p.homeCountry).filter(Boolean))],
        homeState: [...new Set(playersWithRank.map((p) => p.homeState).filter(Boolean))],
        highSchool: [...new Set(playersWithRank.map((p) => p.highSchool).filter(Boolean))],
    };


    const filteredPlayers = playersWithRank.filter((player) => {
        return (
            (!filters.homeCountry || player.homeCountry === filters.homeCountry) &&
            (!filters.homeState || player.homeState === filters.homeState) &&
            (!filters.highSchool || player.highSchool === filters.highSchool)
        );
    });

    const handleFilterChange : any = (key: keyof Filters) => (event: React.ChangeEvent<{ value: unknown }>) => {
        const newFilters = {
            ...filters,
            [key]: event.target.value as string,
        };
        const filtered = playersWithRank.filter((player) => {
            return (
                (!newFilters.homeCountry || player.homeCountry === newFilters.homeCountry) &&
                (!newFilters.homeState || player.homeState === newFilters.homeState) &&
                (!newFilters.highSchool || player.highSchool === newFilters.highSchool)
            );
        });

        if (filtered.length === 0) {
            setFilters({ homeCountry: "", homeState: "", highSchool: "" });
            setSnackbarOpen(true);
        } else {
            setFilters(newFilters);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
            >
                <Box flex={1} display="flex" justifyContent="center">
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
                            textAlign: "center",
                        }}
                    >
                        Mavericks Draft Hub
                    </Typography>
                </Box>

                <IconButton
                    onClick={() => setFilterDialogOpen(true)}
                    aria-label="open filters"
                    sx={{
                        backgroundColor: "#fff",
                        color: "#1d70b7",
                        "&:hover": { backgroundColor: "#eee" },
                        ml: 0,
                        width: { xs: 30, md: 40 },   
                        height: { xs: 30, md: 40 },
                    }}
                >
                    <FilterListIcon fontSize="inherit" />
                </IconButton>
            </Box>

            <Box position="relative" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {canScrollLeft && (
                    <IconButton
                        onClick={() => scroll("left")}
                        sx={{
                            position: "absolute",
                            left: { xs: -30, sm: -30, md: -40 },
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
                    {filteredPlayers.map((player) => (
                        <Box
                            key={player.playerId}
                            sx={{
                                flex: "0 0 auto",
                                backgroundColor: "white",
                                borderRadius: "10px",
                                width: { xs: "100%", sm: "48%", md: "28%" },
                                scrollSnapAlign: "start",
                                overflow: "hidden",
                            }}
                        >
                            <PlayerCard
                                playerId={player.playerId}
                                name={player.name}
                                team={player.currentTeam}
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

                {canScrollRight && (
                    <IconButton
                        onClick={() => scroll("right")}
                        sx={{
                            position: "absolute",
                            right: { xs: -40, sm: -40, md: -40 },
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
            <Dialog
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                disableEnforceFocus
                disableEscapeKeyDown
            >
                <DialogTitle
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                    Filter Players
                    <IconButton
                        aria-label="close"
                        onClick={() => setFilterDialogOpen(false)}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid sx={{ p: 3 }} container spacing={2}>
                        {(["homeCountry", "homeState", "highSchool"] as (keyof Filters)[]).map((key) => (
                            <Grid size={{xs:12, md:12}} key={key}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>{key}</InputLabel>
                                    <Select
                                        value={filters[key]}
                                        label={key}
                                        onChange={handleFilterChange(key)}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 300,
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>All</em>
                                        </MenuItem>
                                        {uniqueValues[key].map((val) => (
                                           val && ( 
                                            <MenuItem key={val} value={val}>
                                                {val}
                                            </MenuItem>
                                           )
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="warning"
                    sx={{ width: "100%" }}
                    variant="filled"
                >
                    No players match the selected filters. Filters have been reset.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BigBoard;
