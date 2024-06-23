import { signalStore, withState } from "@ngrx/signals";
import { initialState } from "./doggos.state";

export const DoggosStore = signalStore(
  withState(initialState)
);
