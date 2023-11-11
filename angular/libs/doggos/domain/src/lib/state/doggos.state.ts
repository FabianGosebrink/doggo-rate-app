import { Doggo } from '../models/doggo';

export const featureName = 'doggos';

export interface DoggoState {
  doggos: Doggo[];
  myDoggos: Doggo[];
  selectedDoggo: Doggo | null;
  detailDoggo: Doggo | null;
  loading: boolean;
  realTimeConnection: string;
}

export const initialState: DoggoState = {
  doggos: [],
  myDoggos: [],
  selectedDoggo: null,
  detailDoggo: null,
  loading: false,
  realTimeConnection: '',
};
