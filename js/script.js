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
		rawData = data;
		currentData = data;
		$('#dataTable').DataTable( {
			data: data.map(d => Object.values(d)),
			columns: Object.keys(data[0]).map(d => ({title: d}))
		} );		
		document.getElementById("spinner").style.visibility = "hidden";
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
