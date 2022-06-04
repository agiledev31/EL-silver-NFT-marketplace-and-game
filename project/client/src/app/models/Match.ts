import { MatchPlayer } from "./MatchPlayer";

export class Match {
    _id: any | undefined;
    createdBy: any | undefined;
    teamA: MatchPlayer[] | undefined;
    teamB: MatchPlayer[] | undefined;
    status: number | undefined;
    entryFee: number | undefined;
    region: string | undefined;
    winnerTeam: MatchPlayer[] | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    tournamentParent: any | undefined;
    tournamentChild: any | undefined;
}