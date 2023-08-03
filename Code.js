function onOpen() {
  const ui = SpreadsheetApp.getUi()

  // Create a menu and add options to it
  ui.createMenu("CSVease")
    .addItem("Import CSV from Link", "importCSVFromLink")
    .addItem("Import CSV from File", "importCSVFromLink")
    .addToUi()
}

function sendEmail(receiver, subject, htmlBody, inlineImages) {
  GmailApp.sendEmail(receiver, subject, "", {
    htmlBody: htmlBody,
    inlineImages: inlineImages
  })
}

function importCSVFromLink() {
  const ui = SpreadsheetApp.getUi()
  const sheet = SpreadsheetApp.getActiveSheet()

  const prevDataColumns = sheet.getLastColumn()

  // Get the CSV file from the URL and parsing it
  const file = ui.prompt("Enter CSV file URL").getResponseText()
  const csv = UrlFetchApp.fetch(file).getContentText()
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
    sendEmail(email, "CSV Analytics - CSVease", "<h1>CSV Analytics Here!</h1>", {})
  }
}
