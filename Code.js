function onOpen() {
  const ui = SpreadsheetApp.getUi()

  // Create a menu and add options to it
  ui.createMenu("CSVease")
    .addItem("Import CSV from Link", "importCSVFromLink")
    .addItem("Import CSV from File", "importCSVFromFile")
    .addToUi()
}

function sendEmail(receiver, subject, htmlBody, inlineImages) {
  GmailApp.sendEmail(receiver, subject, "", {
    htmlBody: htmlBody,
    inlineImages: inlineImages
  })
}

function createGraphFromData(csvData) {
  var data = Charts.newDataTable()

  // Add columns using csvData[0]
  for (var i = 0; i < csvData[0].length; i++) {
    // check the next row to see if it is a number or not
    var isNumber = !isNaN(csvData[1][i])

    // add column with the correct type
    if (isNumber) {
      data.addColumn(Charts.ColumnType.NUMBER, csvData[0][i])
    }
    else {
      data.addColumn(Charts.ColumnType.STRING, csvData[0][i])
    }
  }

  // Add rows using csvData rows
  for (var i = 1; i < csvData.length; i++) {
    data.addRow(csvData[i])
  }

  // Create chart
  var barChart = Charts.newBarChart()
    .setDataTable(data)
    .setDimensions(1000, 1000)
    .build()

  var areaChart = Charts.newAreaChart()
    .setDataTable(data)
    .setDimensions(1000, 1000)
    .build()

  // return charts as blobs for inline images
  return {
    barChart: barChart.getBlob(),
    areaChart: areaChart.getBlob()
  }
}

function importCsvFromText(text) {
  const ui = SpreadsheetApp.getUi()
  const sheet = SpreadsheetApp.getActiveSheet()

  const prevDataColumns = sheet.getLastColumn()

  // Parsing the CSV text
  const csv = text
  const data = Utilities.parseCsv(csv)

  // Check if the structure of the CSV file matches the structure of the sheet
  if (prevDataColumns > 0 && prevDataColumns != data[0].length) {
    const response = ui.alert("Number of columns in CSV file does not match the number of columns in the sheet. Do you want to continue?", ui.ButtonSet.YES_NO)

    if (response == ui.Button.NO) {
      ui.alert("Import cancelled!")
      return
    }
  }

  // Populate sheet with data
  const range = sheet.getRange(sheet.getLastRow() + 1, 1, data.length, data[0].length)
  range.setValues(data)

  // Show success message and ask for email if user wants to receive CSV analytics
  const response = ui.alert("Import successful, do you want to receive a mail for CSV analytics?", ui.ButtonSet.YES_NO)

  if (response == ui.Button.YES) {
    const email = ui.prompt("Enter your email").getResponseText()
    sendEmail(email, "CSV Analytics - CSVease", `<h2>Here are the analytics for your CSV File</h2><img src="cid:barChart"><img src="cid:areaChart">`, createGraphFromData(data))
  }

  const chart = HtmlService.createHtmlOutputFromFile("chart").getContent().replace("SHEET_URL_HERE", `"${getURL()}"`)
  ui.showModalDialog(HtmlService.createHtmlOutput(chart).setHeight(1000).setWidth(1000), "CSV Analytics")
}

function importCSVFromFile() {
  const html = HtmlService.createHtmlOutputFromFile("index")
  SpreadsheetApp.getUi().showModalDialog(html.setHeight(100), "Import CSV from File")
}

function importCSVFromLink() {
  // Get the CSV file from the link specified by user
  const ui = SpreadsheetApp.getUi()
  const file = ui.prompt("Enter CSV file URL").getResponseText()
  const csv = UrlFetchApp.fetch(file).getContentText()
  importCsvFromText(csv)
}

function getURL() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl()
}

