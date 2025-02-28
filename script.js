let bidderIds = [];
let combinedData = [];

function googleClientLoaded() {
    gapi.load('client', function() {
        gapi.client.init({
            apiKey: 'AIzaSyAOeuLYMYBkFeGyzI_mJQo1tFAjTf8UL9w',
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        }).then(function() {
            console.log('Google API client initialized');
            fetchData();
        }).catch(function(error) {
            console.error('Error initializing Google API client:', error);
            alert('Failed to initialize Google API client. Please check the console for details.');
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

        combinedData = evaluationData.slice(1).map(row => ({
            poNumber: row[0] || '',
            bidderId: row[1] || '',
            validOffer: row[2] || '',
            shipmentDetail: row[3] || ''
        }));

        bidderIds = [...new Set(combinedData.map(row => row.bidderId))].filter(id => id !== '');
        populateDropdown('bidder-id', bidderIds, 'Select Bidder ID');
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

    const poNumbers = [...new Set(combinedData
        .filter(row => row.bidderId === bidderId)
        .map(row => row.poNumber))].filter(po => po !== '');
    populateDropdown('po-number', poNumbers.length ? poNumbers : ['N/A'], 'Select PO Number');
    updateResults();
}

function updateResults() {
    const poNumber = document.getElementById('po-number').value;
    const bidderId = document.getElementById('bidder-id').value;
    
    // Check if selections are valid
    if (!poNumber || poNumber === 'N/A' || !bidderId) {
        document.getElementById('shipmentDetailText').textContent = 'Shipment Detail: N/A';
        document.getElementById('percentageText').textContent = 'Percentage: N/A';
        document.getElementById('commentText').textContent = 'Comment: N/A';
        return;
    }

    // Find the row matching both poNumber and bidderId
    const selectedRow = combinedData.find(row => row.poNumber === poNumber && row.bidderId === bidderId);
    if (!selectedRow) {
        document.getElementById('shipmentDetailText').textContent = 'Shipment Detail: N/A';
        document.getElementById('percentageText').textContent = 'Percentage: N/A';
        document.getElementById('commentText').textContent = 'Comment: N/A';
        return;
    }

    // Use shipmentDetail from the selected row
    const shipmentDetail = selectedRow.shipmentDetail || 'N/A';
    document.getElementById('shipmentDetailText').textContent = `Shipment Detail: ${shipmentDetail}`;

    // Calculate offers for the selected poNumber across all bidders
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
    const selectedOffer = parseFloat(selectedRow.validOffer);
    if (isNaN(selectedOffer)) {
        document.getElementById('percentageText').textContent = 'Percentage: N/A';
        document.getElementById('commentText').textContent = 'Comment: N/A';
        return;
    }

    // Calculate and display percentage
    let percentage = selectedOffer === minOffer ? 0 : ((selectedOffer - minOffer) / minOffer) * 100;
    percentage = Math.round(percentage * 100) / 100;
    document.getElementById('percentageText').textContent = `Percentage: ${percentage.toFixed(2)}%`;
    document.getElementById('commentText').textContent = 
        percentage === 0 ? 'Comment: -- Won' : 'Comment: higher than the lowest bid';
}

document.addEventListener('DOMContentLoaded', function() {
    const emailLink = document.getElementById('email-link');
    const email = 'julius.timotius@indorama.com';
    emailLink.href = 'mailto:' + email;
    emailLink.textContent = email;
});

document.getElementById('bidder-id').addEventListener('change', updatePONumbers);
document.getElementById('po-number').addEventListener('change', updateResults);
