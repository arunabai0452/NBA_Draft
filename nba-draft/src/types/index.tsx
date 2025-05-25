export type Measurements = {
    playerId: number | null;
    heightNoShoes: number | null;
    heightShoes: number | null;
    wingspan?: number | null;
    reach: number | null;
    maxVertical: number | null;
    noStepVertical: number | null;
    weight: number | null;
    bodyFat: number | null;
    handLength?: number | null;
    handWidth: number | null;
    agility: number | null;
    sprint: number | null;
    shuttleLeft: number | null;
    shuttleRight: number | null;
    shuttleBest: number | null;
}

export type Player = {
    playerId: number;
    name: string | null;
    age: number | null;
    position: string | null;
    team: string | null;
    height: string | null;
    weight: string | null;
    photoUrl: string | null;
    birthDate: string | null;
    nationality: string | null;
    highSchool: string | null;
    homeTown: string | null;
    homeState: string | null;
    homeCountry: string | null;
};