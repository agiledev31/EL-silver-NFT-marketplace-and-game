import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LolChallengeRoutingModule } from './lolchallenge-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LolChallengeComponent } from './lolchallenge/lolchallenge.component';
import { ViewComponent } from './view/view.component';
import { WithdrawalsComponent } from './withdrawals/withdrawals.component';
import { LolchallengehistoryComponent } from './lolchallenge/lolchallengehistory/lolchallengehistory.component';


@NgModule({
    imports: [CommonModule, LolChallengeRoutingModule, SharedModule],
    declarations: [ViewComponent, WithdrawalsComponent, LolchallengehistoryComponent],
    exports: [
        LolchallengehistoryComponent
    ]
})
export class LolChallengeModule { }
