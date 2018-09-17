var rawData;
var currentData;

var dataLoaders = {
	"application/json": file => d3.json(file),
	"application/vnd.ms-excel": file => d3.csv(file)
};

function uploadFile() {	
	var fileInfo = document.getElementById("fileToUpload").files[0];
	var file = "data/" + fileInfo.name;
	
	document.getElementById("spinner").style.visibility = "visible";

	dataLoaders[fileInfo.type](file).then(data => {		
		rawData = data.map(d => {
            if (d.room)
                return d;
            else {
                d.room = "no_room";
                return d;
            }
        });
		currentData = data;
		// $('#dataTable').DataTable( {
			// data: data.map(d => Object.values(d)),
			// columns: Object.keys(data[0]).map(d => ({title: d}))
		// } );		
		document.getElementById("spinner").style.visibility = "hidden";
		document.getElementById("resultsDiv").style.visibility = "visible";
        
        // var table = $('#dataTable').DataTable();
        // console.log(table.rows().data());
		
		var container1 = document.getElementById('example1');
		var hot1 = new Handsontable(container1, {
			data: data,
			height: 400,
			colHeaders: Object.keys(data[0]),
			rowHeaders: true,
			filters: true,
			dropdownMenu: true
			// hiddenRows: { rows: [1, 3, 5], indicators: true },
			// hiddenColumns: { columns: [1, 3, 5], indicators: true }
		});
		var button1 = document.getElementById('export-file-csv');
		var button2 = document.getElementById('export-file-json');
		var exportPlugin1 = hot1.getPlugin('exportFile');

		button1.addEventListener('click', function() {
			exportPlugin1.downloadFile('csv', {
				bom: false,
				columnDelimiter: ',',
				columnHeaders: true,
				// exportHiddenColumns: true,
				// exportHiddenRows: true,
				fileExtension: 'csv',
				filename: 'data',
				mimeType: 'text/csv',
				rowDelimiter: '\r\n',
				rowHeaders: false
			});
		});
		
		button2.addEventListener('click', function() {
			var shownData = hot1.getData();
			var headers = Object.keys(data[0]);			
			var jsonData = shownData.map(d => {
				var obj = {};
				headers.forEach((h, i) => {
					obj[h] = d[i];
				});
				return obj;
			});			
			download("data.json", JSON.stringify(jsonData));
		});
});
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function exportResults() {
	download("results.json", JSON.stringify(features));
}
