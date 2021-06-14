import { Component, OnInit } from '@angular/core';
import { PostRequest, PostResult } from '../classes/post';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { AddQuery, AddNextScreens } from '../actions/query.actions';
import { QueryState } from '../state/query.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { RequestType } from '../model/query.model';

@Component({
  selector: 'app-ui-search',
  templateUrl: './ui-search.component.html',
  styleUrls: ['./ui-search.component.css'],
})
export class UISearchComponent implements OnInit {
  @Select(QueryState.getQueryResults) queryResults$: Observable<any[]>; // Select - observable that subscribes to the results of a search request that is forwarded by the state management to the backend
  @Select(QueryState.getLastQuery) lastQuery$: Observable<any[]>; // Select - observable that returns the latest 'query' or search request for UI screens

  postRequest: PostRequest = {
    query: '',
    method: 'bm25okapi',
    qe_method: '',
    max_results: 1000,
  };

  resultsMeta: any[]; // array containing the combined metadata of results and images for displaying
  resultsImages: any[]; // array containing the metadata of the images in the returned results from backend
  lastResults: any[]; // array holding the laste results from backend
  searchForm: FormGroup;
  counter: number;
  nextResults: any;
  indexNext: number = 0;
  moreOptions: boolean = false;

  constructor(private store: Store, public dialog: MatDialog) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      value: new FormControl('login'),
    });
  }

  // on clicking 'Seach' button the new request is added to the state log and the returned results from backend are prepared for rendeting
  sendRequest() {
    if (!this.searchForm.get('value').value) return;
    this.postRequest.query = this.searchForm.get('value').value;

    // dispatch an action of type 'AddQuery' to add latest request to the state management
    this.store.dispatch(
      new AddQuery({
        query: this.postRequest.query,
        requestType: RequestType[0],
        postRequest: this.postRequest,
        counter: this.counter,
      })
    );
    // subscribe to the query results; the form of 'results' is defined by interface 'QueryResult'
    this.queryResults$.subscribe((results) => {
      if (!results) return;

      this.resultsMeta = [];
      this.resultsImages = [];
      const primary = [];

      // interface QueryResult has a key 'result' that contains the metadata of all returned ranking results
      results.forEach((result) => {
        if (!result) return;
        // getting top results (20 or more based on having requested the 'more screens' option) and configuring the image data for fronted rendering
        const top = this.getTopResults(result.result);
        top.forEach((element) => {
          const index = element.index;
          const url = '/ui/' + index + '.jpg';
          primary.push(element);
          this.resultsImages.push(url);
        });
      });

      if (!this.resultsMeta && !primary && !this.resultsImages) return;
      // prepare the combined array of ranking metadata and image metadata for frontend rendering
      this.resultsMeta = this.combineArrays(primary, this.resultsImages);
      // after each query request is sent reset the search request input
      this.searchForm.reset();
    });
    // reset all configs after each request
    this.resultsMeta = [];
    this.resultsImages = [];
    this.moreOptions = true;
    this.indexNext = 0;
  }

  // dispatch action for state management and call method 'computeNextScreensResults()' on clicking 'More Screens' button
  showMoreScreens() {
    this.computeNextScreensResults(
      this.postRequest,
      this.counter,
      RequestType[RequestType.INITIAL]
    );
  }

  // computes next top results and displays results in browser
  computeNextScreensResults(
    extRequest: PostRequest,
    counter: number,
    type: string
  ) {
    this.nextResults = [];

    this.lastQuery$.subscribe((results) => {
      this.lastResults = results;
    });

    this.nextResults = this.getNextTopResults(this.lastResults[1].result);
    if (!this.nextResults) return;

    // dispatch an action of type 'AddNextScreens'
    this.store.dispatch(
      new AddNextScreens(
        {
          query: null,
          requestType: type,
          postRequest: null,
          counter: counter,
        },
        this.lastResults[1].result
      )
    );

    this.renderChatbotResultsFromMetaData(this.nextResults);
  }

  // method that prepares the top ranked results in array 'this.resultsMeta' to be displayed in the browser
  renderChatbotResultsFromMetaData(results: any) {
    if (!results) return;
    this.resultsMeta = [];
    this.resultsImages = [];
    const primary = [];

    const top = this.getTopResults(results);

    if (!top) return;
    top.forEach((result) => {
      if (!result) return;
      const index = result.index;
      const url = '/ui/' + index + '.jpg';
      primary.push(result);
      this.resultsImages.push(url);
    });
    if (!this.resultsMeta && !primary && !this.resultsImages) return;
    this.resultsMeta = this.combineArrays(primary, this.resultsImages);
  }

  // method to combine the ranking metadata with the image meta for displaying in the browser
  combineArrays(a1, a2) {
    a1 = a1.map((value, index) => ({
      resultMeta: value,
      screenURL: a2[index],
    }));

    return a1;
  }

  openImageDialog(url: String) {
    this.dialog.open(ImageDialogComponent, {
      data: {
        url: url,
      },
      panelClass: 'image-dialog-container',
    });
  }

  // get top 20 results
  getTopResults(metaResults: any[]) {
    if (!metaResults) return;
    if (this.indexNext === undefined) {
      console.log('in if statement');
      return;
    }
    let top = [];
    for (let i = 0; i < this.indexNext + 20; i++) {
      top.push(metaResults[i]);
    }
    return top;
  }

  // method that gets the next top 20 results based on the current 'indexNext'
  getNextTopResults(metaResults: any[]) {
    if (!metaResults) return;
    let top = [];
    // start from 0 in order to display also the previous results
    for (let i = 0; i < this.indexNext + 40; i++) {
      top.push(metaResults[i]);
    }
    this.indexNext = this.indexNext + 20;
    return top;
  }
}
