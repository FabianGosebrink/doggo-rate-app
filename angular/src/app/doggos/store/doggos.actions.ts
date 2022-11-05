import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Doggo } from '../models/doggo';

export const DoggosActions = createActionGroup({
  source: 'Doggos',
  events: {
    'Load Doggos': emptyProps(),
    'Load Doggos Finished': props<{ doggos: Doggo[] }>(),
    'Rate Doggo': props<{ rating: number }>(),
    'Rate Doggo Finished': props<{ doggo: Doggo }>(),
    'Select Next Doggo': emptyProps(),
    'Select Doggo': props<{ id: string }>(),

    'Add Doggo With Picture': props<{
      name: string;
      breed: string;
      comment: string;
      formData: FormData;
    }>(),
    'Add Doggo Finished': props<{ doggo: Doggo }>(),

    'Navigate To Last Added Doggo': props<{ id: string }>(),
    'Delete Doggo': props<{ doggo: Doggo }>(),
    'Delete Doggo Finished': props<{ doggo: Doggo }>(),
  },
});
