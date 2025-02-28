let bidderIds = [];
let combinedData = [];
let dataC = [];
let dataX = [];

function googleClientLoaded() {
    gapi.load('client', function() {
        gapi.client.init({
            apiKey: 'YAIzaSyAOeuLYMYBkFeGyzI_mJQo1tFAjTf8UL9w',
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
    const spreadsheetId = '1Uk0Od2M5zJU5oywHDY5vxAdsQslKEoOo5xyhROQnAK8';
    const ranges = [
        'Summary!M5:M',
        'Flow!D:D', 'Flow!G:G', 'Flow!L:L', 'Flow!S:S',
        'Flow1!D:D', 'Flow1!G:G', 'Flow1!L:L', 'Flow1!S:S',
        'Data!C:C', 'Data!X:X'
    ];

    gapi.client.sheets.spreadsheets.values.batchGet({
        spreadsheetId: spreadsheetId,
        ranges: ranges
    }).then(function(response) {
        const batchResponse = response.result.valueRanges;
        
        // Process Bidder IDs
        bidderIds = batchResponse[0].values ? batchResponse[0].values.map(row => row[0]) : [];
        populateDropdown('bidder-id', bidderIds, 'Select Bidder ID');

        // Process Flow and Flow1 data
        let flowD = batchResponse[1].values ? batchResponse[1].values.map(row => row[0]) : [];
        let flowG = batchResponse[2].values ? batchResponse[2].values.map(row => row[0]) : [];
        let flowL = batchResponse[3].values ? batchResponse[3].values.map(row => row[0]) : [];
        let flowS = batchResponse[4].values ? batchResponse[4].values.map(row => row[0]) : [];
        let flow1D = batchResponse[5].values ? batchResponse[5].values.map(row => row[0]) : [];
        let flow1G = batchResponse[6].values ? batchResponse[6].values.map(row => row[0]) : [];
        let flow1L = batchResponse[7].values ? batchResponse[7].values.map(row => row[0]) : [];
        let flow1S = batchResponse[8].values ? batchResponse[8].values.map(row => row[0]) : [];

        // Create combined data for Flow and Flow1
        let flowData = [];
        for (let i = 0; i < Math.max(flowD.length, flowG.length, flowL.length, flowS.length); i++) {
            flowData.push({
                D: flowD[i] || '',
                G: flowG[i] || '',
                L: flowL[i] || '',
                S: flowS[i] || ''
            });
        }
        let flow1Data = [];
        for (let i = 0; i < Math.max(flow1D.length, flow1G.length, flow1L.length, flow1S.length); i++) {
            flow1Data.push({
                D: flow1D[i] || '',
                G: flow1G[i] || '',
                L: flow1L[i] || '',
                S: flow1S[i] || ''
            });
        }
        combinedData = flowData.concat(flow1Data);

        // Process Data sheet
        dataC = batchResponse[9].values ? batchResponse[9].values.map(row => row[0]) : [];
        dataX = batchResponse[10].values ? batchResponse[10].values.map(row => row[0]) : [];

        // Add event listener for Bidder ID change
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
    const poNumbers = combinedData
        .filter(row => row.L === 'Closed' && row.G === bidderId)
        .map(row => row.D);
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

    // Update Shipment Detail
    const shipmentIndex = dataC.indexOf(poNumber);
    document.getElementById('shipmentDetailText').textContent = 
        shipmentIndex !== -1 ? `Shipment Detail: ${dataX[shipmentIndex] || 'N/A'}` : 'Shipment Detail: N/A';

    // Calculate Percentage
    const relevantRows = combinedData.filter(row => row.D === poNumber);
    if (relevantRows.length === 0) {
        document.getElementById('percentageText').textContent = 'Percentage: N/A';
        document.getElementById('commentText').textContent = 'Comment: N/A';
        return;
    }
    const sValues = relevantRows.map(row => parseFloat(row.S) || 0).filter(v => !isNaN(v));
    const minS = sValues.length ? Math.min(...sValues) : 0;
    const selectedRow = combinedData.find(row => row.G === bidderId && row.D === poNumber);
    if (!selectedRow || isNaN(parseFloat(selectedRow.S))) {
        document.getElementById('percentageText').textContent = 'Percentage: N/A';
        document.getElementById('commentText').textContent = 'Comment: N/A';
        return;
    }
    const selectedS = parseFloat(selectedRow.S);
    let percentage = selectedS === minS ? 0 : ((selectedS - minS) / minS) * 100;
    percentage = Math.round(percentage * 100) / 100; // Round to 2 decimals
    document.getElementById('percentageText').textContent = `Percentage: ${percentage.toFixed(2)}%`;
    document.getElementById('commentText').textContent = 
        percentage === 0 ? 'Comment: -- Won' : 'Comment: higher than the lowest bid';
}