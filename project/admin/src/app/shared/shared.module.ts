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
import { NoSpaceDirective } from './directives/no-space.directive';
import { ShowAuthedDirective } from './directives/show-authed.directive';
import { UserRolePipe } from './pipes/user-role.pipe';
import { UserStatusPipe } from './pipes/user-status.pipe';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ImagePipe } from './pipes/image.pipe';
import { LoaderComponent } from './loader/loader.component';
import { TournamentStatusPipe } from './pipes/tournament-status.pipe';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.components';
@NgModule({
  declarations: [
    ErrorsComponent,
    AlphaOnlyDirective,
    NumericOnlyDirective,
    AlphaNumericOnlyDirective,
    AlphaSpaceOnlyDirective,
    UsernameDirective,
    DecimalOnlyDirective,

    NoSpaceDirective,
    ShowAuthedDirective,
    UserRolePipe,
    UserStatusPipe,
    UploadFileComponent,
    ImagePipe,
    LoaderComponent,
    TournamentStatusPipe,
    DateTimePickerComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,

    HttpClientModule,
    FileUploadModule,
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
    NoSpaceDirective,
    ShowAuthedDirective,
    UserRolePipe,
    UserStatusPipe,
    FileUploadModule,
    UploadFileComponent,
    ImagePipe,
    LoaderComponent,
    TournamentStatusPipe,
    DateTimePickerComponent
  ]
})
export class SharedModule { }
