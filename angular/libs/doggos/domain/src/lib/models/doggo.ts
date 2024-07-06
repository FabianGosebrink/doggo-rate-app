export interface Doggo {
  id: string;
  name: string;
  breed: string;
  comment: string;
  imageUrl: string;
  ratingSum: number;
  ratingCount: number;
  created: Date;
  userId: string;
}

export type DoggoAddedEvent = { type: 'doggoadded'; doggo: Doggo };
export type DoggoRemovedEvent = { type: 'doggodeleted'; id: string };
export type DoggoRatedEvent = { type: 'doggorated'; doggo: Doggo };

export type DoggoEvent = DoggoAddedEvent | DoggoRemovedEvent | DoggoRatedEvent;
