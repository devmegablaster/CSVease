function onOpen() {
  const ui = SpreadsheetApp.getUi()

  ui.createMenu("CSVease")
    .addItem("Import CSV from Link", "importCSVFromLink")
    .addItem("Import CSV from File", "importCSVFromLink")
    .addToUi()
}

function importCSVFromLink() {
  const ui = SpreadsheetApp.getUi()
  const sheet = SpreadsheetApp.getActiveSheet()

  const prevDataColumns = sheet.getLastColumn()

  const file = ui.prompt("Enter CSV file URL").getResponseText()
  const csv = UrlFetchApp.fetch(file).getContentText()
  const data = Utilities.parseCsv(csv)

  if (prevDataColumns > 0 && prevDataColumns != data[0].length) {
    const response = ui.prompt("Number of columns in CSV file does not match the number of columns in the sheet. Do you want to continue? (y/n)", ui.ButtonSet.YES_NO)

    if (response.getSelectedButton() == ui.Button.NO) {
      ui.alert("Import cancelled!")
      return
    }
  }

  const range = sheet.getRange(sheet.getLastRow() + 1, 1, data.length, data[0].length)
  range.setValues(data)
}
