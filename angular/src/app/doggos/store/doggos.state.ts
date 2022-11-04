import { Doggo } from '../models/doggo';

export const featureName = 'doggos';

export interface DoggoState {
  doggos: Doggo[];
  selectedDoggo: Doggo | null;
  loading: boolean;
}

export const initialState: DoggoState = {
  doggos: [],
  selectedDoggo: null,
  loading: false,
};
