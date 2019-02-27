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
		document.getElementById("spinner").style.visibility = "hidden";
		document.getElementById("resultsDiv").style.visibility = "visible";
		
		var hot = createSpreadsheet(document.getElementById('example1'), data);
        
		var exportCsvBtn = document.getElementById('export-file-csv');
        exportCsvBtn.addEventListener('click', function() {
            var jsonData = tableDataToJson(hot);
            var csvStr = jsonToCSV(jsonData);
            download("data.csv", csvStr);
		});
        
		var exportJsonBtn = document.getElementById('export-file-json');
		exportJsonBtn.addEventListener('click', function() {
			var jsonData = tableDataToJson(hot);
			download("data.json", JSON.stringify(jsonData));
		});
});
}

function tableDataToJson(hot) {
    var data = hot.getData();
    var headers = hot.getColHeader();			
    var jsonData = data.map(d => {
        var obj = {};
        headers.forEach((h, i) => {
            obj[h] = d[i];
        });
        return obj;
    });
    return jsonData;
}

function jsonToCSV(data) {
    var headers = Object.keys(data[0]);
    var csvStr = "";
    headers.forEach((header, i) => {
        if (i > 0) {
            csvStr += ",";
        }
        csvStr += header;
    });
    csvStr += "\n";
    data.forEach(record => {
        headers.forEach((header, i) => {
            if (i > 0) {
                csvStr += ",";
            }
            csvStr += record[header];
        });
        csvStr += "\n";
    });
    return csvStr;
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

function createSpreadsheet(container, data) {
    // clear previous contents
    container.innerHTML = "";
    var licenceDiv = document.getElementById("hot-display-license-info");
    if (licenceDiv) {
        licenceDiv.remove();
    }
    
    // create spreadsheet
    var hot = new Handsontable(container, {
        data: data,
        height: 400,
        colHeaders: Object.keys(data[0]),
        rowHeaders: true,
        filters: true,
        dropdownMenu: true,
        columnSorting: true,
        contextMenu: true
        // hiddenRows: { rows: [1, 3, 5], indicators: true },
        // hiddenColumns: { columns: [1, 3, 5], indicators: true }
    });
    
    return hot;
}
