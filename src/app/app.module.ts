import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { StatusComponent } from './status/status.component';
import { SearchComponent } from './search/search.component';
import { TaskComponent } from './task/task.component';
import { AuthenticationComponent } from './authentication/authentication.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    StatusComponent,
    SearchComponent,
    TaskComponent,
    AuthenticationComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
