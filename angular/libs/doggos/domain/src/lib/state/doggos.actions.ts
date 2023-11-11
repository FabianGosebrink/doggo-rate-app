import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Doggo } from '../models/doggo';

export const DoggosActions = createActionGroup({
  source: 'Doggos',
  events: {
    'Start Listening to Realtime Doggo Events': emptyProps(),
    'Stop Listening to Realtime Doggo Events': emptyProps(),

    'Load Doggos': emptyProps(),
    'Load Doggos Finished': props<{ doggos: Doggo[] }>(),
    'Load Doggos Error': emptyProps(),

    'Load Single Doggo': emptyProps(),
    'Load Single Doggo Finished': props<{ doggo: Doggo }>(),
    'Load Single Doggo Error': emptyProps(),
    'Clear Single Doggo': emptyProps(),

    'Load My Doggos': emptyProps(),
    'Load My Doggos Finished': props<{ doggos: Doggo[] }>(),
    'Load My Doggos Error': emptyProps(),

    'Rate Doggo': props<{ rating: number }>(),
    'Rate Doggo Finished': props<{ doggo: Doggo }>(),
    'Rate Doggo Realtime Finished': props<{ doggo: Doggo }>(),

    'Select Next Doggo': emptyProps(),
    'Select Doggo': props<{ id: string }>(),

    'Add Doggo With Picture': props<{
      name: string;
      breed: string;
      comment: string;
      formData: FormData;
    }>(),
    'Add Doggo Finished': props<{ doggo: Doggo }>(),
    'Add Doggo Realtime Finished': props<{ doggo: Doggo }>(),
    'Add Doggo To My Doggos': props<{ doggo: Doggo }>(),
    'Add Doggo To All Doggos': props<{ doggo: Doggo }>(),

    'Navigate To Last Added Doggo': props<{ id: string }>(),
    'Delete Doggo': props<{ doggo: Doggo }>(),
    'Delete Doggo Finished': props<{ id: string }>(),
    'Delete Doggo Realtime Finished': props<{ id: string }>(),
  },
});
