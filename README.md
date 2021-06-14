# Simple Search UI

This is the code for the search-engine-based approach, Simple Search UI.

The tool has NGXS State Management for logging purposes: Each search requests is logged as type INITIAL. There is no connection (implicit feedback) between requests.

The proxy to the GUI Retrieval and Ranking API is specified in ./proxy.config.json.

## Run the project

To run the project locally, execute the command `ng serve` in the project location in a terminal. The local frontend server will be reachable on `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

You can type search requests in the search input mask and requests more screens via the button option.

## View the state changes

To view the state changes in real-time while the user is making search requests with the tool, open the browser console (right click, "Inspect" and go to "Console"). You will see the current and next system state being logged by NGXS. The two states will be updated after each request (you need to scroll down the console to see the most recent changes).
The states will log the incomming search query and the retrieved and ranked GUIs.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
