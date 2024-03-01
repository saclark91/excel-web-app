// app.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const output = document.getElementById('output');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayData(data);
            output.style.display = 'block';
        })
        .catch(error => {
            let errorMessage;
            if (error instanceof TypeError) {
                errorMessage = "An unexpected type error occurred.";
            } else if (error instanceof SyntaxError) {
                errorMessage = "An unexpected syntax error occurred.";
            } else {
                errorMessage = error.message || "An unexpected error occurred. Please try again later.";
            }
            displayError(errorMessage);
        });
    });

    function displayData(data) {
        output.innerHTML = '';
        
        if (data.length === 0) {
            output.innerHTML = '<p>Please Select a File</p>';
            return;
        }

        const table = document.createElement('table');
        const headers = Object.keys(data[0]);

        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        data.forEach(rowData => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = rowData[header];
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        output.appendChild(table);
    }

    function displayError(errorMessage) {
        output.innerHTML = '<p class="error-message">' + errorMessage + '</p>';
    }
});
