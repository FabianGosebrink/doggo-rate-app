import { createReducer, on } from '@ngrx/store';
import { DoggosActions } from './doggos.actions';
import { DoggoState, initialState } from './doggos.state';

export const doggosReducer = createReducer<DoggoState>(
  initialState,

  on(
    DoggosActions.loadDoggosFinished,
    DoggosActions.loadMyDoggosFinished,
    (state, { doggos }) => {
      return {
        ...state,
        loading: false,
        lastAddedDoggo: null,
        doggos,
      };
    }
  ),

  on(DoggosActions.addDoggoWithPicture, DoggosActions.loadDoggos, (state) => {
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
      loading: false,
      lastAddedDoggo: doggo,
    };
  }),

  on(DoggosActions.addDoggoRealtimeFinished, (state, { doggo }) => {
    return {
      ...state,
      doggos: [...state.doggos, doggo],
      loading: false,
    };
  }),

  on(
    DoggosActions.deleteDoggoFinished,
    DoggosActions.deleteDoggoRealtimeFinished,
    (state, { id }) => {
      const doggos = [...state.doggos].filter((existing) => existing.id !== id);

      if (state.selectedDoggo?.id === id) {
        const currentIndex = state.doggos.findIndex((doggo) => doggo.id === id);
        const nextIndex = (currentIndex + 1) % state.doggos.length;
        const selectedDoggo = state.doggos[nextIndex];

        return {
          ...state,
          doggos,
          selectedDoggo,
        };
      }

      return {
        ...state,
        doggos,
      };
    }
  )
);
