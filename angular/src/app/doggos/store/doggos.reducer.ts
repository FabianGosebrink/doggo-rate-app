import { createReducer, on, Action } from '@ngrx/store';
import { DoggosActions } from './doggos.actions';
import { DoggoState, initialState } from './doggos.state';

export const doggosReducer = createReducer<DoggoState>(
  initialState,

  on(DoggosActions.loadDoggosFinished, (state, { doggos }) => {
    return {
      ...state,
      loading: false,
      doggos,
    };
  }),

  on(DoggosActions.rateDoggo, (state, { rating }) => {
    const selectedDoggoRatings = state.selectedDoggo?.ratings ?? [];
    const newRatings = [...selectedDoggoRatings, rating];
    const updatedDoggo = { ...state.selectedDoggo, ratings: newRatings };
    const currentDoggoIndex = state.doggos.findIndex(
      (x) => x.id === state.selectedDoggo.id
    );
    const allDoggosCopy = [...state.doggos];
    allDoggosCopy.splice(currentDoggoIndex, 1, updatedDoggo);

    return {
      ...state,
      doggos: allDoggosCopy,
    };
  }),

  on(DoggosActions.selectDoggo, (state, { id }) => {
    const newSelectedDoggo = state.doggos.find((doggo) => doggo.id === id);

    return {
      ...state,
      selectedDoggo: newSelectedDoggo,
    };
  })
);
