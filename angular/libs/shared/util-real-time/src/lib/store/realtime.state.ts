import { ConnectionStatus } from './realtime.selectors';

export const featureName = 'realtime';

export interface RealTimeState {
  realTimeConnection: ConnectionStatus;
}

export const initialState: RealTimeState = {
  realTimeConnection: 'Not Set',
};
