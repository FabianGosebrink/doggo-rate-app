import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoggosRoutingModule } from './doggos-routing.module';
import { MainDoggoComponent } from './container/main-doggo/main-doggo.component';
import { DoggoListComponent } from './presentational/doggo-list/doggo-list.component';
import { DoggoRateComponent } from './presentational/doggo-rate/doggo-rate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { doggosReducer } from './store/doggos.reducer';
import { featureName } from './store/doggos.state';
import { EffectsModule } from '@ngrx/effects';
import { DoggosEffects } from './store/doggos.effects';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MainDoggoComponent, DoggoListComponent, DoggoRateComponent],
  imports: [
    CommonModule,
    DoggosRoutingModule,
    StoreModule.forFeature(featureName, doggosReducer),
    EffectsModule.forFeature([DoggosEffects]),
    // BrowserAnimationsModule,
  ],
})
export class DoggosModule {}
