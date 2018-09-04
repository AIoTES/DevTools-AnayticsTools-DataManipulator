var rawData;
var currentData;
var features;

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

var populateMethods = {
	histogram: populateHistogram
}

function populateHistogram() {
	fillSelectInput("#histogramEntitySelect", Object.keys(currentData[0]));
	fillSelectInput("#histogramAttributeSelect", Object.keys(currentData[0]));
}

function generateHistograms() {	
	var entityAttr = document.querySelector("#histogramEntitySelect").value;
	var histogramAttr = document.querySelector("#histogramAttributeSelect").value;
	
	var bins = [... new Set(currentData.map(d => d[histogramAttr]))];

	// main logic
	var groups = d3.nest().key(d => d[entityAttr]).entries(currentData);
	features = groups.map(g => ({
		group: g.key,
		feature: computeHistogram(g.values.map(d => d[histogramAttr]), bins)
	}));
	
	var columns = ["entity"].concat(bins);
	var arr = features.map(d => [d.group].concat(d.feature));
	
	console.log(columns);
	console.log(arr);
	
	$('#histogramsTable').DataTable( {
		data: arr,
		columns: columns.map(d => ({title: d}))
	} );
}

function useHistogramResults() {
	currentData = features;
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

function computeHistogram(values, bins) {
	var histogram = bins.map(bin => values.filter(d => d == bin).length);
	return histogram;
}

function featureExtractionSelected() {
	var select = document.getElementById("featureExtractionSelect");
	var method = select.options[select.selectedIndex].value;	
	openAnalysis(method);
	populateMethods[method]();
}

function featureSelectionSelected() {
	var select = document.getElementById("featureSelectionSelect");
	var method = select.options[select.selectedIndex].value;	
	openAnalysis(method);
}

function anomalyDetectionSelected() {
	var select = document.getElementById("anomalyDetectionSelect");
	var method = select.options[select.selectedIndex].value;	
	openAnalysis(method);
}

function probabilisticPredictionSelected() {
	var select = document.getElementById("probabilisticPredictionSelect");
	var method = select.options[select.selectedIndex].value;	
	openAnalysis(method);
}

function timeseriesPredictionSelected() {
	var select = document.getElementById("timeseriesPredictionSelect");
	var method = select.options[select.selectedIndex].value;	
	openAnalysis(method);
}

function clusteringSelected() {
	var select = document.getElementById("clusteringSelect");
	var method = select.options[select.selectedIndex].value;	
	openAnalysis(method);
}

function hypothesisTestingSelected() {
	var select = document.getElementById("hypothesisTestingSelect");
	var method = select.options[select.selectedIndex].value;	
	openAnalysis(method);
}

function fillSelectInput(selector, values) {
	let options = d3.select(selector).selectAll("option")
		.data(values);
	options
		.attr("value", d => d)
		.text(d => d);
	options.enter()
		.append("option")
		.attr("value", d => d)
		.text(d => d);
	options.exit().remove();
}
