import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TournamentService } from 'src/app/core/services/tournament.service';
import { MatchService,  UserService } from 'src/app/core';

import { InitiatedComponent } from '../modals/initiated/initiated.component';
import { JoinComponent } from '../modals/join/join.component';
import { SuccessComponent } from '../modals/success/success.component';
import { SocketService } from './../../core/services/socket.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  @ViewChild(SuccessComponent) successComponent!: SuccessComponent;
  @ViewChild(InitiatedComponent) initiatedComponent!: InitiatedComponent;
  @ViewChild(JoinComponent) joinComponent!: JoinComponent;
  isLoader: boolean = false;
  id: any = null;
  tournament: any = null;

  currentUser :any = null;
  teams:any = [];
  canEnroll = false;
  constructor(private matchService: MatchService, private router: Router, private tournamentService: TournamentService,
    private socketService: SocketService,
    private userService: UserService, private route: ActivatedRoute) {

    this.userService.currentUser.subscribe(u => this.currentUser = u)
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.isLoader = true;
        this.getData();
        this.realTimeTournament();

      }
    });

  }
  realTimeTournament() {
    this.socketService.onEvent('Tournament'+this.id).subscribe(e => {
      this.getData();
    })
  }

  private getData() {

    this.tournamentService.get(this.id).subscribe((res: any) => {
      this.isLoader = false;
      // ;
      if (res.status == 200) {
        this.tournament = res.data.tournament;
        this.teams = [];
        for (let index = 0; index < this.tournament.maxTeams; index++) {
            this.teams.push(this.tournament.teams[index] ? this.tournament.teams[index] : null)
        }
      }
    }, err => {
      this.isLoader = false;
      this.tournament = null;
      ;
    });

  }

  onPlayClick(type: number) {
    this.matchService.setType(type);
    this.router.navigate(['/match/setup']);
  }
  onSuccess(){

    this.joinComponent.close();
    this.initiatedComponent.open();
  }

  onJoinClick() {
    this.joinComponent.open();
  }
  get isMeAlreadyJoined () : boolean {
    return  this.myTeam(this.tournament).length > 0;
  }
  myTeam(tournament: any) { return tournament.teams.filter((team: any) =>  team.players.some((player: any) => player.user.toString() == this.currentUser._id.toString()))}
}
