# Data manipulator

The data manipulator tool allows the manipulation of a dataset, by filtering and sorting rows and by creating new columns, computed from the existing ones. The output file can be further analyzed with other tools. The data manipulator is meant for data pre-processing and cleaning.

## Installation

Just download this repository at a local directory and run `index.html`.

## Examples of usage

### Filtering / sorting

The following example shows how to perform filtering / sorting operations on a dataset.

* From the left panel, click on "Browse" and select `data/activity_data.json`. Click "Upload" to load the dataset.
* The data are loaded in a spreadsheet view.
* Click on the arrow icon on the header of the "room" column. A context menu is shown. From the filtering options at the bottom, click "Clear" to clear all filtering options and check manually the "bathroom" and "bedroom" values. Click "OK" to apply the filter. In the spreadsheet, only the rows containing the selected values in the "room" column are kept.
* Click on the "userID" column header to sort the records by "userID".
* Click on the "Export CSV" button to export the filtered and sorted data in a CSV format.

### Creating new columns

The following example shows how to create new columns in the loaded dataset, computed from the existing columns.

* From the left panel, click on "Browse" and select `data/xy_data.json`. Click "Upload" to load the dataset.
* The data are loaded in a spreadsheet view. The existing column names are "x" and "y".
* In the "Add new column" section at the bottom, in the "Name" field type `avg` and in the "Expression" field type `(x + y) / 2`.
* Click the "Add" button. A new column named "avg" is added to the data. The values of the "avg" column are the average values of the "x" and "y" columns, at the corresponding rows. The way that a row of the new column is computed from the corresponding row of the existing columns is denoted in the "Expression". Any JavaScript expression can be typed in the "Expression" field.
* The details of the new column (name and expression) are shown at the bottom of the "Add new column" section. You can add further columns.
* Add another column named `diff`, with expression `Math.abs(x - y)`. This is the absolute difference between "x" and "y".
* Click the "Remove" button next to the "avg" column details, to remove the "avg" column from the spreadsheet.
* Click the "Export CSV" button to export the shown data, including the displayed computed columns, in CSV format.
