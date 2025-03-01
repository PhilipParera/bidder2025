let bidderIds = [];
let combinedData = [];

function googleClientLoaded() {
    gapi.load('client', function() {
        gapi.client.init({
            apiKey: 'AIzaSyAOeuLYMYBkFeGyzI_mJQo1tFAjTf8UL9w',
            clientId: '664374659896-m0a5r65ev0kfldmaberdmb7nf6llucae.apps.googleusercontent.com',
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
        }).then(function() {
            gapi.auth2.getAuthInstance().signIn().then(function() {
                fetchData();
            }, function(error) {
                console.error('Sign-in error:', error);
                alert('Failed to sign in. Please try again.');
            });
        });
    });
}

function fetchData() {
    const spreadsheetId = '1zVxwxloY9W5ZtmOCYxspmqKeTBsEXOtN2nS_Pax0Tbo';
    const ranges = ['Evaluation!C:F'];

    gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: spreadsheetId,
        ranges: ranges
    }).then(function(response) {
        const batchResponse = response.result.valueRanges;
        const evaluationData = batchResponse[0].values ? batchResponse[0].values : [];

        // Assuming the first row contains headers, skip it
        combinedData = evaluationData.slice(1).map(row => ({
            poNumber: row[0] || '',
            bidderId: row[1] || '',
            validOffer: row[2] || '',
            shipmentDetail: row[3] || ''
        }));

        // Extract unique bidder IDs from Evaluation!D:D
        bidderIds = [...new Set(combinedData.map(row => row.bidderId))].filter(id => id !== '');
        populateDropdown('bidder-id', bidderIds, 'Select Bidder ID');

        // Add event listeners for dropdown changes
        document.getElementById('bidder-id').addEventListener('change', function() {
            updatePONumbers();
        });
        document.getElementById('po-number').addEventListener('change', function() {
            updateResults();
        });
    }, function(error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data from Google Sheet. Please try again.');
    });
}

function resizeImage(img) {
    img.width = img.naturalWidth / 2;
    img.height = img.naturalHeight / 2;
}

function populateDropdown(id, values, defaultText) {
    const select = document.getElementById(id);
    select.innerHTML = `<option value="">${defaultText}</option>`;
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function updatePONumbers() {
    const bidderId = document.getElementById('bidder-id').value;
    if (!bidderId) {
        populateDropdown('po-number', [], 'Select PO Number');
        return;
    }

    // Get unique PO Numbers for the selected Bidder ID from Evaluation!C:C
    const poNumbers = [...new Set(combinedData
        .filter(row => row.bidderId === bidderId)
        .map(row => row.poNumber))].filter(po => po !== '');
    populateDropdown('po-number', poNumbers.length ? poNumbers : ['N/A'], 'Select PO Number');
    updateResults();
}

function updateResults() {
    const poNumber = document.getElementById('po-number').value;
    const bidderId = document.getElementById('bidder-id').value;
    if (!poNumber || poNumber === 'N/A' || !bidderId) {
        document.getElementById('shipmentDetailText').textContent = 'Shipment Detail: N/A';
        document.getElementById('percentageText').textContent = 'Percentage: N/A';
        document.getElementById('commentText').textContent = 'Comment: N/A';
        return;
    }

    // Update Shipment Detail from Evaluation!F:F
    const shipmentRow = combinedData.find(row => row.poNumber === poNumber);
    const shipmentDetail = shipmentRow ? shipmentRow.shipmentDetail : 'N/A';
    document.getElementById('shipmentDetailText').textContent = `Shipment Detail: ${shipmentDetail}`;

    // Calculate Percentage using Valid Offers from Evaluation!E:E
    const offers = combinedData
        .filter(row => row.poNumber === poNumber)
        .map(row => parseFloat(row.validOffer))
        .filter(v => !isNaN(v));
    if (offers.length === 0) {
        document.getElementById('percentageText').textContent = 'Percentage: N/A';
        document.getElementById('commentText').textContent = 'Comment: N/A';
        return;
    }

    const minOffer = Math.min(...offers);
    const selectedRow = combinedData.find(row => row.poNumber === poNumber && row.bidderId === bidderId);
    if (!selectedRow || isNaN(parseFloat(selectedRow.validOffer))) {
        document.getElementById('percentageText').textContent = 'Percentage: N/A';
        document.getElementById('commentText').textContent = 'Comment: N/A';
        return;
    }

    const selectedOffer = parseFloat(selectedRow.validOffer);
    let percentage = selectedOffer === minOffer ? 0 : ((selectedOffer - minOffer) / minOffer) * 100;
    percentage = Math.round(percentage * 100) / 100; // Round to 2 decimal places
    document.getElementById('percentageText').textContent = `Percentage: ${percentage.toFixed(2)}%`;
    document.getElementById('commentText').textContent = 
        percentage === 0 ? 'Comment: -- Won' : 'Comment: higher than the lowest bid';
}