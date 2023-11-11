import { Doggo } from '../models/doggo';

export const featureName = 'doggos';

export interface DoggoState {
  doggos: Doggo[];
  myDoggos: Doggo[];
  selectedDoggo: Doggo | null;
  loading: boolean;
  realTimeConnection: string;
}

export const initialState: DoggoState = {
  doggos: [],
  myDoggos: [],
  selectedDoggo: null,
  loading: false,
  realTimeConnection: '',
};
