document.getElementById('extractEmailsBtn').addEventListener('click', function() {
    extractEmailsFromDocx();
});

async function extractEmailsFromDocx() {
    const files = document.getElementById('docxFiles').files;
    if (files.length === 0) {
        alert('Please select one or more .docx files.');
        return;
    }

    const emailsOutput = document.getElementById('emailsOutput');
    emailsOutput.innerHTML = ''; // Clear previous results
    const allEmails = new Set(); // Use a Set to store unique emails

    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        mammoth.extractRawText({arrayBuffer: arrayBuffer})
            .then(result => {
                const text = result.value;
                const emails = extractEmailsFromText(text);
                emails.forEach(email => allEmails.add(email));
            })
            .then(() => {
                emailsOutput.innerHTML = ''; // Clear previous emails
                allEmails.forEach(email => {
                    const emailDiv = document.createElement('div');
                    emailDiv.textContent = email;
                    emailsOutput.appendChild(emailDiv);
                });
                updateEmailCount(allEmails.size); // Update the count of extracted emails
            })
            .catch(err => console.log(err));
    }
}

function extractEmailsFromText(text) {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    return text.match(emailRegex) || [];
}

function updateEmailCount(count) {
    const emailCountParagraph = document.getElementById('emailCount');
    emailCountParagraph.textContent = `${count} emails extracted.`; // Update the text to show the number of unique emails extracted
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