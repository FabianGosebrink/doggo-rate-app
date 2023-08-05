import { createReducer, on } from '@ngrx/store';
import { Doggo } from '../models/doggo';
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

  on(DoggosActions.addDoggoToAllDoggos, (state, { doggo }) => {
    return {
      ...state,
      doggos: [...state.doggos, doggo],
      loading: false,
    };
  }),

  on(DoggosActions.loadMyDoggosFinished, (state, { doggos }) => {
    return {
      ...state,
      loading: false,
      lastAddedDoggo: null,
      myDoggos: doggos,
    };
  }),

  on(DoggosActions.addDoggoWithPicture, DoggosActions.loadDoggos, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),

  on(DoggosActions.rateDoggoFinished, (state, { doggo }) => {
    const newDoggos = replaceItemInArray(state.doggos, doggo);

    if (state.selectedDoggo.id === doggo.id) {
      const updatedSelectedDoggo = newDoggos.find(
        (dog) => dog.id === state.selectedDoggo.id
      );

      return {
        ...state,
        doggos: newDoggos,
        selectedDoggo: updatedSelectedDoggo,
      };
    }

    return {
      ...state,
      doggos: newDoggos,
    };
  }),

  on(DoggosActions.selectDoggo, (state, { id }) => {
    const selectedDoggo = state.doggos.find((doggo) => doggo.id === id);

    return {
      ...state,
      selectedDoggo,
    };
  }),

  on(DoggosActions.addDoggoToMyDoggos, (state, { doggo }) => {
    return {
      ...state,
      myDoggos: [...state.myDoggos, doggo],
      lastAddedDoggo: doggo,
    };
  }),

  on(DoggosActions.setRealTimeConnection, (state, { connection }) => {
    return {
      ...state,
      realTimeConnection: connection,
    };
  }),

  on(
    DoggosActions.deleteDoggoFinished,
    DoggosActions.deleteDoggoRealtimeFinished,
    (state, { id }) => {
      const doggos = removeItemFromArray(state.doggos, id);
      const myDoggos = removeItemFromArray(state.myDoggos, id);

      if (state.selectedDoggo?.id === id) {
        const currentIndex = state.doggos.findIndex((doggo) => doggo.id === id);
        const nextIndex = (currentIndex + 1) % state.doggos.length;
        const selectedDoggo = state.doggos[nextIndex];

        return {
          ...state,
          doggos,
          myDoggos,
          selectedDoggo,
        };
      }

      return {
        ...state,
        myDoggos,
        doggos,
      };
    }
  )
);

function replaceItemInArray(array: Doggo[], newItem: Doggo): Doggo[] {
  const currentDoggoIndex = array.findIndex((x) => x.id === newItem.id);
  const allDoggosCopy = [...array];
  allDoggosCopy.splice(currentDoggoIndex, 1, newItem);

  return allDoggosCopy;
}

function removeItemFromArray(array: Doggo[], id: string): Doggo[] {
  return [...array].filter((existing) => existing.id !== id);
}
