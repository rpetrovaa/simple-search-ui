import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app.routing.module';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { AppComponent } from './app.component';
import { Gui2wireApiService } from './services/gui2wire-api.service';
import { QueryState } from './state/query.state';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostRequestService } from './services/post-request.service';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { UISearchComponent } from './ui-search/ui-search.component';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    NgxsModule.forRoot([QueryState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    BrowserAnimationsModule,
  ],
  declarations: [
    AppComponent,
    ImageDialogComponent,
    UISearchComponent,
    NavBarComponent,
  ],
  providers: [Gui2wireApiService, PostRequestService],
  bootstrap: [AppComponent],
})
export class AppModule {}
