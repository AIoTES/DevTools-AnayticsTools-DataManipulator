var dataLoaders = {
	"application/json": file => d3.json(file),
	"application/vnd.ms-excel": file => d3.csv(file)
};

hotGlobal = null;

var addedColumns = {};

function uploadFile() {	
	var fileInfo = document.getElementById("fileToUpload").files[0];
	var file = "data/" + fileInfo.name;
	
	document.getElementById("spinner").style.visibility = "visible";

	dataLoaders[fileInfo.type](file).then(data => {

		document.getElementById("spinner").style.visibility = "hidden";
		document.getElementById("resultsDiv").style.visibility = "visible";
		
		createSpreadsheet(document.getElementById('example1'), data);
        
        var exportCsvBtn = document.getElementById('export-file-csv');
        exportCsvBtn.addEventListener('click', function() {
            var jsonData = tableDataToJson();
            var csvStr = jsonToCSV(jsonData);
            download("data.csv", csvStr);
        });
        
        var exportJsonBtn = document.getElementById('export-file-json');
        exportJsonBtn.addEventListener('click', function() {
            var jsonData = tableDataToJson();
            download("data.json", JSON.stringify(jsonData));
        });

        addedColumns = {};
        renderAddedColumns();
    });
}

function tableDataToJson() {
    var data = hotGlobal.getData();
    var headers = hotGlobal.getColHeader();			
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
    hotGlobal = new Handsontable(container, {
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
    
    // return hot;
}

function addColumn() {
    let colName = document.getElementById("colNameTextBox").value;
    let expr = document.getElementById("colExprTextBox").value;
    let data = tableDataToJson(hotGlobal);
    let compData = addComputedAttr(data, colName, expr);
    createSpreadsheet(document.getElementById('example1'), compData);

    addedColumns[colName] = {
        colNameTextboxID: colName + "_textbox",
        exprTextboxID: colName + "_expr_textbox",
        expr: expr,
        updateBtnID: colName + "_update_btn",
        removeBtnID: colName + "_remove_btn"
    };

    renderAddedColumns();
}

function renderAddedColumns() {
    let container = document.getElementById("addedColumnsDiv");
    container.innerHTML = "";
    for (key in addedColumns) {
        let col = addedColumns[key];
        container.innerHTML += `
            Name: <input type="text" value="${key}" id="${col.colNameTextboxID}" />
            Expression: <input type="text" value="${col.expr}" id="${col.exprTextboxID}" class="exprBox" />
            <button onclick="removeColumn('${key}')">Remove</button>
            <br>
        `;
    }
    document.getElementById("colNameTextBox").value = "";
    document.getElementById("colExprTextBox").value = "";
}

function removeColumn(colName) {
    let data = tableDataToJson(hotGlobal);
    let compData = removeComputedAttr(data, colName);
    createSpreadsheet(document.getElementById('example1'), compData);

    delete addedColumns[colName];

    renderAddedColumns();
}

function addComputedAttr(data, colName, expr) {
    let res = data.map(d => {
        let obj = {...d};
        obj[colName] = applyExpr(expr, d);
        return obj;
    });
    return res;
}

function removeComputedAttr(data, colName) {
    let res = data.map(d => {
        let obj = {...d};
        delete obj[colName];
        return obj;
    });
    return res;
}

function applyExpr(expr, obj) {
    let resExpr = expr;
    for (key in obj) {
        let re = new RegExp('\\b' + key + '\\b');
        resExpr = resExpr.replace(re, obj[key]);
    }
    return eval(resExpr);
}
