export type Measurements = {
    playerId?: number;
    heightNoShoes?: number;
    heightShoes?: number;
    wingspan?: number | null;
    reach?: number | undefined;
    maxVertical?: number;
    noStepVertical?: number;
    weight?: number;
    bodyFat?: number | null;
    handLength?: number;
    handWidth?: number;
    agility?: number;
    sprint?: number;
    shuttleLeft?: number | null;
    shuttleRight?: number | null;
    shuttleBest?: number;
}

export type Player = {
    playerId: number;
    name: string;
    age: number;
    position: string;
    team: string;
    height: string;
    weight: string;
    photoUrl: string;
    birthDate: string;
    nationality: string;
    highSchool: string;
    homeTown: string;
    homeState: string;
    homeCountry: string;
};