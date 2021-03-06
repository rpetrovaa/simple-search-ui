import { PostResult } from '../classes/post';
import { Query } from '../model/query.model';

export class AddQuery {
  static readonly type = '[QUERY] Add';

  constructor(public payload: Query) {}
}

export class AddNextScreens {
  static readonly type = '[QUERY] Add Next Top 20 Screens';

  constructor(public query: Query, public result: PostResult[]) {}
}
