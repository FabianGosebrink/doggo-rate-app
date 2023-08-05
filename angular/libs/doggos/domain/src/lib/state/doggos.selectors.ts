import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Doggo } from '../models/doggo';
import { DoggoState, featureName } from './doggos.state';

const getDoggoState = createFeatureSelector<DoggoState>(featureName);

export const getAllDoggos = createSelector(
  getDoggoState,
  (state: DoggoState) => state.doggos
);

export const getMyDoggos = createSelector(
  getDoggoState,
  (state: DoggoState) => state?.myDoggos || []
);

export const getAllIdsOfMyDoggos = createSelector(
  getMyDoggos,
  (myDoggos: Doggo[]) => {
    if (myDoggos.length === 0) {
      return [];
    }

    return myDoggos.map((x) => x.id);
  }
);

export const getLoading = createSelector(
  getDoggoState,
  (state: DoggoState) => state.loading
);

export const getSelectedDoggo = createSelector(
  getDoggoState,
  (state: DoggoState) => state.selectedDoggo
);

export const getSelectedDoggoIndex = createSelector(
  getAllDoggos,
  getSelectedDoggo,
  (allDoggos: Doggo[], selectedDoggo: Doggo) => {
    return allDoggos.findIndex((doggo) => doggo.id === selectedDoggo.id);
  }
);

export const getNextDoggoIndex = createSelector(
  getAllDoggos,
  getSelectedDoggoIndex,
  (allDoggos: Doggo[], currentDoggoIndex: number) => {
    return (currentDoggoIndex + 1) % allDoggos.length;
  }
);

export const getLastAddedDoggo = createSelector(
  getDoggoState,
  (state: DoggoState) => state.lastAddedDoggo
);

export const getRealTimeConnection = createSelector(
  getDoggoState,
  (state: DoggoState) => state?.realTimeConnection || ''
);

export const getAllDoggosButSelected = createSelector(
  getAllDoggos,
  getSelectedDoggo,
  (allDoggos: Doggo[], selectedDoggo: Doggo) => {
    if (allDoggos.length === 0) {
      return [];
    }

    if (!selectedDoggo) {
      return allDoggos;
    }

    return allDoggos.filter((doggo) => doggo.id !== selectedDoggo.id);
  }
);
