import {
  getSelectors,
  RouterReducerState,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';

// `router` is used as the default feature name. You can use the feature name
// of your choice by creating a feature selector and pass it to the `getSelectors` function
export const selectRouter = createFeatureSelector<RouterReducerState>('router');

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
  selectTitle, // Select the title if available
} = getSelectors();

export function getAllRouteParameters(snapshot: SerializedRouterStateSnapshot) {
  let route = snapshot.root;
  let params = new Map(
    Object.keys(route.params).map((key) => [key, route.params[key]])
  );
  while (route.firstChild) {
    route = route.firstChild;
    Object.keys(route.params).forEach((key) =>
      params.set(key, route.params[key])
    );
  }
  return params;
}

export function getAllQueryParameters(snapshot: SerializedRouterStateSnapshot) {
  let route = snapshot.root;
  let params = new Map(
    Object.keys(route.queryParams).map((key) => [key, route.queryParams[key]])
  );
  while (route.firstChild) {
    route = route.firstChild;
    Object.keys(route.queryParams).forEach((key) =>
      params.set(key, route.queryParams[key])
    );
  }
  return params;
}
