export const featureName = 'realtime';

export interface RealTimeState {
  realTimeConnection: string;
}

export const initialState: RealTimeState = {
  realTimeConnection: '',
};
