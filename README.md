# Simple Search UI

This is the code for the search-engine-based approach, Simple Search UI.

The tool has NGXS State Management for logging purposes: Each search requests is logged as type INITIAL. There is no connection (implicit feedback) between requests.

The proxy to the GUI Retrieval and Ranking API is specified in ./proxy.config.json.

To run the project locally, execute the command `ng serve` in the project location in a terminal. The local frontend server will be reachable on `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

You can type search requests in the search input mask and requests more screens via the button option.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
