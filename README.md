# Webscraping with Nightmare

My first experience with Nightmare.js.

## What it does

1. Navigates to https://datatables.net/ by typing "datatables" into the Google search bar, and clicking on the correct result.
2. Finds a table example with some data. Fetches data from the table into array. 
3. Exports the array as a .csv file.

## Getting Started

1. You need installed `npm` and `node.js` on your local machine.
2. Clone this Github repo.
3. Run `npm install` to install all dependencies.
4. If you want to see generated new file delete the included outputData.csv file. 
5. Run ```DEBUG=nightmare node  nightmare.js```.
6. Open generated outputData.csv file to confirm results.

## Dependencies

* csv-write-stream
* nightmare
