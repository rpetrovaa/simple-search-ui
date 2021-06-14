import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddQuery, AddNextScreens } from '../actions/query.actions';
import { QueryResult } from '../model/query.model';
import { Gui2wireApiService } from '../services/gui2wire-api.service';
import { tap, take } from 'rxjs/operators';

// Class for managing the state of the application. Requests are forwarded to the backend from this class. Each request and its results are recorded by the state management.
export class QueryStateModel {
  queries: QueryResult[];
}

@State<QueryStateModel>({
  name: 'queries',
  defaults: {
    queries: [],
  },
})
@Injectable()
export class QueryState {
  constructor(private queryService: Gui2wireApiService) {}

  @Selector()
  static getQueryResults(state: QueryStateModel) {
    const current = state.queries[state.queries.length - 1];
    if (!current) return;
    return [current];
  }

  @Selector()
  static getLastQuery(state: QueryStateModel) {
    const current = state.queries[state.queries.length - 1];
    const prev = state.queries[state.queries.length - 2];
    return [prev, current];
  }

  // action dispatched on making initial requests for UI screens
  @Action(AddQuery)
  add(
    { getState, setState }: StateContext<QueryStateModel>,
    { payload }: AddQuery
  ) {
    const state = getState();
    // make request to backend using '/api' proxy
    return this.queryService.post('/api', payload.postRequest).pipe(
      take(1),
      tap((result) => {
        if (!result) return;
        setState({
          queries: [
            ...state.queries,
            {
              query: {
                query: payload.query,
                requestType: payload.requestType,
                postRequest: payload.postRequest,
                counter: payload.counter,
              },
              result: result.results,
            },
          ],
        });
      })
    );
  }

  // action dispatched on requesting more screens
  @Action(AddNextScreens)
  AddNextScreens(
    { getState, setState }: StateContext<QueryStateModel>,
    { query, result }: AddNextScreens
  ) {
    const state = getState();
    return setState({
      queries: [
        ...state.queries,
        {
          query: {
            query: state.queries[state.queries.length - 1].query.query,
            requestType: query.requestType,
            postRequest:
              state.queries[state.queries.length - 1].query.postRequest,
            counter: query.counter,
          },
          result: result,
        },
      ],
    });
  }
}
