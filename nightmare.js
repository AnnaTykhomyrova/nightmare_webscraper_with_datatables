var csvWriter = require('csv-write-stream');
var writer = csvWriter();
var fs = require('fs');
var Nightmare = require('nightmare');

(async () => {
	let nightmare;
	try {
	nightmare = Nightmare({ show: true });
	await nightmare
		.goto('https://www.google.com')
		.type('form[action*="/search"] [name=q]', 'datatables')
		.click('form[action*="/search"] [type=submit]')
		.wait(2500)
		await nightmare.evaluate( () => {
			var link = document.querySelector(".r a");
			link.click();
		})
		await nightmare
			.wait('select[name="example_length"]')
			.select('select[name="example_length"]', 100);
		
		await nightmare.evaluate( () => {
			let tableRows = Array.from(document.querySelectorAll('table#example tr'));
			let tableKeysRow = Array.from((tableRows[0]).querySelectorAll('th')).map(e => e.innerHTML); 
			let tableDataRows = tableRows.slice(1,58); 
			let arrayOfRowObjects = [];
			let rowObject = {};
			let formattedValues = [];

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
				writer.pipe(fs.createWriteStream('outputData.csv'));
				result.forEach( obj => {
					writer.write(obj);
				});
				writer.end();
			})
        } catch (error) {
			console.error(error);
			throw error;
		} finally {
			await nightmare.end();
		}
})();

