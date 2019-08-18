/* package definitions */
var csvWriter = require('csv-write-stream');
var writer = csvWriter();
var fs = require('fs');
var Nightmare = require('nightmare');

(async () => {
	let nightmare;
	try {
	nightmare = Nightmare({ show: true });
	await nightmare

		/* connect to the webpage */
		.goto('https://www.google.com')		
		.type('form[action*="/search"] [name=q]', 'datatables')
		.click('form[action*="/search"] [type=submit]')
		.wait()

		/* click on datatables.net link */
		.click('a[href^="https://datatables.net/"]')

		await nightmare
			.wait('select[name="example_length"]')
			.select('select[name="example_length"]', 100)

		/* extract info from the datatable */
		await nightmare.evaluate( () => {
			let tableRows = Array.from(document.querySelectorAll('table#example tr'));

			/* separating values from retrieved table data */
			let tableKeysRow = Array.from((tableRows[0]).querySelectorAll('th')).map(e => e.innerHTML); 
			let tableDataRows = tableRows.slice(1,58); 
			let arrayOfRowObjects = [];
			let rowObject = {};
			let formattedValues = [];

			/* extract info from each row */
			tableDataRows.forEach( row => {
				formattedValues = Array.from(row.querySelectorAll('td')).map(e => e.innerHTML);
				
				rowObject = {};
				for(i = 0; i < tableKeysRow.length; i++) {
					rowObject[tableKeysRow[i]] = formattedValues[i];
				}

				arrayOfRowObjects.push(rowObject);
			})

				return arrayOfRowObjects;
		})
		.then( result => {
			console.log("Extracted values from datatable...");

			/* fetch data as a CSV file */
			writer.pipe(fs.createWriteStream('outputData.csv'));
			result.forEach( obj => {
				writer.write(obj);
			});
			writer.end();
			console.log("Wrote values to csv file...")
		})
	} catch (error) {
		console.error("error: ", error);
		throw error;
	} finally {
		await nightmare.end();
	}
})();

