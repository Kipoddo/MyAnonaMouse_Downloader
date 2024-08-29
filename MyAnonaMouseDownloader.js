// download a file
function downloadFile(url, fileName) {
    var a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// handle downloading and pages
function downloadAndNavigate(startPage, maxPages) {
    var currentPage = startPage;

    // process current page
    function processPage() {
        // find rows (tr elements) containing directdownload links
        var downloadRows = document.querySelectorAll('tr[id^="tdr-"]');

        // loop through every found row and process directdownload links
        downloadRows.forEach(function(row) {
            var directDownloadLink = row.querySelector('a.directDownload');
            var browseActDiv = row.querySelector('div.browseAct');

            // check if directdownload link exists and if browseact is absent
            if (directDownloadLink && !browseActDiv) {
                var url = directDownloadLink.href;
                var fileName = directDownloadLink.getAttribute('id').replace('dlLink', 'download');
                downloadFile(url, fileName);
            }
        });

        // automatically navigate to the next page if available and within the maxpages limit
        var nextPageButton = document.querySelector('input.nextPage');
        if (nextPageButton && currentPage < startPage + maxPages - 1) {
            currentPage++;
            var newStartLocation = nextPageButton.getAttribute('data-newstartlocation');
            nextPageButton.setAttribute('data-newstartlocation', newStartLocation);
            nextPageButton.click();
            setTimeout(processPage, 3000); // wait for the page to load and then process it
        } else {
            console.log('Finished downloading after ' + (currentPage - startPage + 1) + ' pages.');
        }
    }

    // start processing the 1st page
    processPage();
}

// start downloading from the current page
function startDownloadingFromCurrentPage() {
    // prompt user for number of pages to download
    var maxPages = prompt('Enter the number of pages to download:');
    if (!maxPages || isNaN(maxPages) || maxPages <= 0) {
        console.log('Invalid input or no input provided. Stopping download.');
        return;
    }

    // get the current page number from the URL
    var currentPage = parseInt(new URL(window.location.href).searchParams.get('tor[startNumber]')) || 1;
    
    // call downloadandnavigate with the current page number and max pages
    downloadAndNavigate(currentPage, parseInt(maxPages));
}

// start downloading based on user input for number of pages
startDownloadingFromCurrentPage();
