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
import { API } from '../model/api';

@Component({
  selector: 'app-ui-search',
  templateUrl: './ui-search.component.html',
  styleUrls: ['./ui-search.component.css'],
})
export class UISearchComponent implements OnInit {
  @Select(QueryState.getQueryResults) queryResults$: Observable<any[]>;
  @Select(QueryState.getLastQuery) lastQuery$: Observable<any[]>;

  api = API;

  postRequest: PostRequest = {
    query: '',
    method: 'bm25okapi',
    qe_method: '',
    max_results: 1000,
  };

  results: any;
  resultsMeta: any;
  resultsImages: any;
  isImageLoading: boolean;
  imageToShow: string | ArrayBuffer;
  searchForm: FormGroup;

  request: PostRequest;
  requestNegative: PostRequest;
  requestExtended: PostRequest;

  resultsNegative: any;
  resultsDiff: PostResult[];

  resultsExtended: any;
  resultsIntersect: PostResult[];

  snapshot;
  lastResults: any;

  state: string;
  stateExt: string;

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

  sendRequest() {
    if (!this.searchForm.get('value').value) return;
    this.postRequest.query = this.searchForm.get('value').value;

    this.store.dispatch(
      new AddQuery({
        query: this.postRequest.query,
        requestType: RequestType[0],
        postRequest: this.postRequest,
        counter: this.counter,
      })
    );
    this.queryResults$.subscribe((results) => {
      if (!results) return;

      this.resultsMeta = [];
      this.resultsImages = [];
      const primary = [];

      results.forEach((result) => {
        console.log('iteration results');
        if (!result) return;
        const top = this.getTopResults(result.result);
        console.log('TOP', top);
        top.forEach((element) => {
          const index = element.index;
          const url = '/ui/' + index + '.jpg';
          primary.push(element);
          this.resultsImages.push(url);
        });
      });

      if (!this.resultsMeta && !primary && !this.resultsImages) return;
      this.resultsMeta = this.combineArrays(primary, this.resultsImages);

      this.searchForm.reset();
    });
    this.resultsMeta = [];
    this.resultsImages = [];
    this.moreOptions = true;
  }

  showMoreScreens() {
    this.computeNextScreensResults(
      this.postRequest,
      this.counter,
      RequestType[RequestType.INITIAL]
    );
  }

  computeNextScreensResults(
    extRequest: PostRequest,
    counter: number,
    type: string
  ) {
    this.nextResults = [];

    this.lastQuery$.subscribe((results) => {
      this.lastResults = results;
      // console.log('what is state?', this.stateExt);
      // console.log('LAST RES', this.lastResults);
    });

    this.nextResults = this.getNextTopResults(this.lastResults[1].result);
    // console.log('NEXT RES: ', this.nextResults);

    if (!this.nextResults) return;
    // console.log('next res', this.nextResults);

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

  renderChatbotResultsFromMetaData(results: any) {
    if (!results) return;

    let query_results = results;

    //console.log('RESULTS', results);

    this.resultsMeta = [];
    this.resultsImages = [];
    const primary = [];

    const top = this.getTopResults(results);
    console.log('TOP', top);

    if (!top) return;
    top.forEach((result) => {
      // console.log('iterating in TOP', result);
      if (!result) return;
      const index = result.index;
      const url = '/ui/' + index + '.jpg';
      primary.push(result);
      this.resultsImages.push(url);
    });
    if (!this.resultsMeta && !primary && !this.resultsImages) return;
    this.resultsMeta = this.combineArrays(primary, this.resultsImages);
    //console.log('this.resultsMeta', this.resultsMeta);
  }

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

  //get top 20 results
  getTopResults(metaResults: any[]) {
    if (!metaResults) return;
    let top = [];
    for (let i = 0; i < 20; i++) {
      top.push(metaResults[i]);
    }
    return top;
  }

  getNextTopResults(metaResults: any[]) {
    if (!metaResults) return;
    console.log('NEXT INDEX', this.indexNext);
    let top = [];
    for (let i = this.indexNext + 20; i < this.indexNext + 40; i++) {
      //console.log('i: ', i);
      top.push(metaResults[i]);
    }
    this.indexNext = this.indexNext + 20;
    return top;
  }
}
