import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RealTimeState, featureName } from './realtime.state';

const getRealTimeState = createFeatureSelector<RealTimeState>(featureName);

export const getRealTimeConnection = createSelector(
  getRealTimeState,
  (state: RealTimeState) => state?.realTimeConnection || ''
);
