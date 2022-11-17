import { Doggo } from '../models/doggo';

export const featureName = 'doggos';

export interface DoggoState {
  doggos: Doggo[];
  myDoggos: Doggo[];
  selectedDoggo: Doggo | null;
  loading: boolean;
  lastAddedDoggo: Doggo;
  realTimeConnection: string;
}

export const initialState: DoggoState = {
  doggos: [],
  myDoggos: [],
  selectedDoggo: null,
  lastAddedDoggo: null,
  loading: false,
  realTimeConnection: '',
};
