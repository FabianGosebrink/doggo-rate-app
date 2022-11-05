import { createReducer, on, Action } from '@ngrx/store';
import { DoggosActions } from './doggos.actions';
import { DoggoState, initialState } from './doggos.state';

export const doggosReducer = createReducer<DoggoState>(
  initialState,

  on(DoggosActions.loadDoggosFinished, (state, { doggos }) => {
    return {
      ...state,
      loading: false,
      lastAddedDoggo: null,
      doggos,
    };
  }),

  on(DoggosActions.addDoggo, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),

  on(DoggosActions.rateDoggoFinished, (state, { doggo }) => {
    const currentDoggoIndex = state.doggos.findIndex((x) => x.id === doggo.id);
    const allDoggosCopy = [...state.doggos];
    allDoggosCopy.splice(currentDoggoIndex, 1, doggo);

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
  }),

  on(DoggosActions.addDoggoFinished, (state, { doggo }) => {
    return {
      ...state,
      doggos: [...state.doggos, doggo],
      lastAddedDoggo: doggo,
    };
  }),

  on(DoggosActions.deleteDoggoFinished, (state, { doggo }) => {
    const doggos = [...state.doggos].filter(
      (existing) => existing.id !== doggo.id
    );

    return {
      ...state,
      doggos,
    };
  })
);
