# CSV Importer for Google Sheets

This is a Google Apps Script project that allows users to import CSV data into Google Sheets from a URL or by uploading a CSV file. After importing the data, users will receive graphs related to the data in their email. Additionally, if another CSV file is imported with the same structure as the previously imported one, the new data will be appended to the existing Google Sheets.

## Sample Sheet with the Script Attached to it  
[Link To Sheet](https://docs.google.com/spreadsheets/d/10zQ4TjxLa3Zu7VDBa0on7OfBa4QsUvHx-Scp-PFsUys)

## Features

- Import CSV data from a URL or by uploading a CSV file.
- Generate graphs based on the imported data and send them to the user's email.
- Append data to the existing Google Sheets if the structure of the newly imported CSV is the same.

## Prerequisites

To use this CSV importer for Google Sheets, you need the following:

1. A Google account to access Google Sheets and Google Apps Script.
2. Basic knowledge of Google Apps Script and Google Sheets.
3. Access to a Google Sheets document where the imported data will be stored and graphs will be generated.

## Installation

1. Create a new Google Apps Script project.
2. Copy and paste the contents of the `code.gs`, `index.html` files into the corresponding files in your Google Apps Script project.
3. Save the project.

## Note

- Make sure that the CSV files have the same structure (columns) for successful appending.
- The email containing the graphs may take some time to arrive, depending on the size of the data and the number of graphs generated.
