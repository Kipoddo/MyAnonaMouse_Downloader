// Function to download a file
function downloadFile(url, fileName) {
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to handle downloading and pagination
function downloadAndNavigate(startPage, maxPages) {
    var currentPage = startPage;

    // Function to process current page
    function processPage() {
        // Find all rows (tr elements) containing directDownload links
        var downloadRows = document.querySelectorAll('tr[id^="tdr-"]');

        // Loop through all found rows and process directDownload links
        downloadRows.forEach(function(row) {
            var directDownloadLink = row.querySelector('a.directDownload');
            var browseActDiv = row.querySelector('div.browseAct');

            // Check if directDownload link exists and if browseAct is absent
            if (directDownloadLink && !browseActDiv) {
                var url = directDownloadLink.href;
                var fileName = directDownloadLink.getAttribute('id').replace('dlLink', 'download');
                downloadFile(url, fileName);
            }
        });

        // Navigate to the next page if available and within maxPages limit
        var nextPageButton = document.querySelector('input.nextPage');
        if (nextPageButton && currentPage < startPage + maxPages - 1) {
            currentPage++;
            var newStartLocation = nextPageButton.getAttribute('data-newstartlocation');
            nextPageButton.setAttribute('data-newstartlocation', newStartLocation); // Use the actual value directly
            nextPageButton.click(); // Click on the next page button
            setTimeout(processPage, 3000); // Wait for the page to load and then process it
        } else {
            console.log('Finished downloading after ' + (currentPage - startPage + 1) + ' pages.');
        }
    }

    // Start processing the first page
    processPage();
}

// Function to start downloading from the current page
function startDownloadingFromCurrentPage() {
    // Prompt user for number of pages to download
    var maxPages = prompt('Enter the number of pages to download:');
    if (!maxPages || isNaN(maxPages) || maxPages <= 0) {
        console.log('Invalid input or no input provided. Stopping download.');
        return;
    }

    // Get the current page number from the URL
    var currentPage = parseInt(new URL(window.location.href).searchParams.get('tor[startNumber]')) || 1;
    
    // Call downloadAndNavigate with the current page number and max pages
    downloadAndNavigate(currentPage, parseInt(maxPages));
}

// Usage example: Start downloading based on user input for number of pages
startDownloadingFromCurrentPage();
