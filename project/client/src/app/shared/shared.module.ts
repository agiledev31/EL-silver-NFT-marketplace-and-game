import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsComponent } from './errors/errors.component';
import { AlphaOnlyDirective } from './directives/alpha-only.directive';
import { AlphaNumericOnlyDirective } from './directives/alphanumeric-only.directive';
import { AlphaSpaceOnlyDirective } from './directives/alphaspace-only.directive';
import { DecimalOnlyDirective } from './directives/decimal-only.directive';
import { NumericOnlyDirective } from './directives/numeric-only.directive';
import { UsernameDirective } from './directives/username.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatchModalComponent } from './match-modal/match-modal.component';
import { MatchResultsComponent } from './match-results/match-results.component';
import { SuccessComponent } from './success/success.component';
import { MatchFoundComponent } from './match-found/match-found.component';
import { OverlayComponent } from './overlay/overlay.component';
import { NoSpaceDirective } from './directives/no-space.directive';
import { ShowAuthedDirective } from './directives/show-authed.directive';

import { PlayerTypePipe } from './pipes/playerType.pipe';
import { TypeIconPipe } from './pipes/typeIcon.pipe';
import { MatchTypePipe } from './pipes/matchType.pipe';

import { UploadFileComponent } from './upload-file/upload-file.component';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { ImagePipe } from './pipes/image.pipe';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { LoaderComponent } from './loader/loader.component';
import { SubmitComponent } from './submit/submit.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { RoundedImageComponent } from './rounded-image/rounded-image.component';
import { PlayerTypeIconPipe } from './pipes/player-type-icon.pipe';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SilverPricePipe } from './pipes/silver-price.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { PlayerLevelPipe } from './pipes/player-level.pipe';
import { PaymentTypePipe } from './pipes/payment-type.pipe';
import { RegionPipe } from './pipes/region.pipe';
import { ConfirmComponent } from './confirm/confirm.component';
import { InviteComponent } from './invite/invite.component';


@NgModule({
  declarations: [
    ErrorsComponent,
    AlphaOnlyDirective,
    NumericOnlyDirective,
    AlphaNumericOnlyDirective,
    AlphaSpaceOnlyDirective,
    UsernameDirective,
    DecimalOnlyDirective,
    MatchModalComponent,
    MatchResultsComponent,
    SuccessComponent,
    MatchFoundComponent,
    OverlayComponent,
    NoSpaceDirective,
    ShowAuthedDirective,
    
    
    PlayerTypePipe,
    TypeIconPipe,
    MatchTypePipe,

    UploadFileComponent,
    ImagePipe,
    UpdateProfileComponent,
    UpdatePasswordComponent,
    LoaderComponent,
    SubmitComponent,
    PageLoaderComponent,
    RoundedImageComponent,
    PlayerTypeIconPipe,
    SilverPricePipe,
    SpinnerComponent,
    PlayerLevelPipe,
    PaymentTypePipe,
    RegionPipe,
    InviteComponent,
    ConfirmComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    HttpClientModule,
    FileUploadModule,
    NgCircleProgressModule.forRoot({}),
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ErrorsComponent,
    AlphaOnlyDirective,
    NumericOnlyDirective,
    AlphaNumericOnlyDirective,
    AlphaSpaceOnlyDirective,
    UsernameDirective,
    DecimalOnlyDirective,
    NgSelectModule,
    MatchModalComponent,
    MatchResultsComponent,
    SuccessComponent,
    MatchFoundComponent,
    OverlayComponent,
    NoSpaceDirective,
    ShowAuthedDirective,

    
    PlayerTypePipe,
    TypeIconPipe,
    MatchTypePipe,

    FileUploadModule,
    UploadFileComponent,
    ImagePipe,
    UpdateProfileComponent,
    UpdatePasswordComponent,
    LoaderComponent,
    SubmitComponent,
    PageLoaderComponent,
    RoundedImageComponent,
    PlayerTypeIconPipe,
    SilverPricePipe,
    SpinnerComponent,
    PlayerLevelPipe,
    PaymentTypePipe,
    RegionPipe,
    InviteComponent, ConfirmComponent,

  ],
})
export class SharedModule {}
