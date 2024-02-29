document.getElementById('extractEmailsBtn').addEventListener('click', function() {
    extractEmailsFromFiles();
});

async function extractEmailsFromFiles() {
    const files = document.getElementById('pdfFiles').files;
    if (files.length === 0) {
        alert('Please select one or more PDF files.');
        return;
    }

    const emailsOutput = document.getElementById('emailsOutput');
    emailsOutput.innerHTML = ''; // Clear previous results
    const allEmails = new Set(); // Use a Set to store unique emails

    for (const file of files) {
        const text = await getPdfText(file);
        const emails = extractEmailsFromText(text);
        emails.forEach(email => allEmails.add(email));
    }

    allEmails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.textContent = email;
        emailsOutput.appendChild(emailDiv);
    });

    // Update the count below the output box
    updateEmailCount(allEmails.size);
}

function extractEmailsFromText(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    return text.match(emailRegex) || [];
}

async function getPdfText(file) {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    const maxPages = pdf.numPages;
    let text = '';

    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const tokenizedText = await page.getTextContent();
        text += tokenizedText.items.map(token => token.str).join(' ');
    }

    return text;
}

function updateEmailCount(count) {
    const emailCountParagraph = document.getElementById('emailCount');
    emailCountParagraph.textContent = `${count} emails extracted.`; // Update the text to show the number of unique emails
}

document.getElementById('emailsOutput').onclick = function() {
    // Check if the user's browser supports the selection API
    if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(this);
      range.select();
    } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(this);
      selection.removeAllRanges(); // Clear any existing selections
      selection.addRange(range);
    }
  };