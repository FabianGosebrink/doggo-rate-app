import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RealTimeState, featureName } from './realtime.state';

export type ConnectionStatus = 'On' | 'Off' | 'Reconnecting' | 'Not Set';

const getRealTimeState = createFeatureSelector<RealTimeState>(featureName);

export const getRealTimeConnection = createSelector(
  getRealTimeState,
  (state: RealTimeState) => state?.realTimeConnection || 'Not Set'
);
