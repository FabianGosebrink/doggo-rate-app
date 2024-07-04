import { createActionGroup, props } from '@ngrx/store';
import { Doggo } from '../models/doggo';

export const DoggosActions = createActionGroup({
  source: 'Doggos',
  events: {
    'Rate Doggo Realtime Finished': props<{ doggo: Doggo }>(),
    'Add Doggo Realtime Finished': props<{ doggo: Doggo }>(),
    'Delete Doggo Realtime Finished': props<{ id: string }>(),
  },
});
