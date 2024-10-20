// Daniel Wu
// C21460424
// Lab 4


function renderTable(data) {
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = ''; // Clear existing table rows

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.firstName}</td><td>${row.lastName}</td><td>${row.id}</td>`;
        tableBody.appendChild(tr);
    });
}

function processData(data) {
    return data.map(entry => {
        const [firstName, lastName] = entry.name.split(' ');
        return {
            firstName,
            lastName,
            id: entry.id
        };
    });
}

function loadDataSync() 
{ // 1. Synchronous XMLHttpRequest

    try // Try block to catch any errors that may occur
    {

        let allData = []; 
        let currentFile = 'data/reference.json'; // Starting file to load data from

        while (currentFile) { // While Loop to follow the chain of data files

            const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest object
            xhr.open("GET", currentFile, false); // false indicates synchronous
            xhr.send(); // Send the request to the server

            if (xhr.status === 200) { // Check if the response status is OK
                const data = JSON.parse(xhr.responseText); 
                if (data.data) { 
                    
                    allData = allData.concat(processData(data.data)); // Process and add the data to the allData array
                }
                currentFile = data.data_location ? `data/${data.data_location}` : null; // Update currentFile to the next file, if specified
            } else {
                throw new Error(`Failed to load ${currentFile}`); 
            }
        }

        const finalXhr = new XMLHttpRequest(); // Create another XMLHttpRequest to load the final file
        finalXhr.open("GET", "data/data3.json", false); 
        finalXhr.send(); 

        if (finalXhr.status === 200) { 
            const finalData = JSON.parse(finalXhr.responseText); 
            allData = allData.concat(processData(finalData.data)); // Process and add the final data to the allData array
        } 
        else {

            throw new Error("Failed to load data3.json"); 

        }

        renderTable(allData); // Call the function to display the combined data

    } 
    
    catch (error) {
        console.error('Error:', error); 

    }
}

function loadDataAsync() 
{ // 2. Asynchronous XMLHttpRequest 

    let allData = []; 
    let currentFile = 'data/reference.json'; 

    function fetchFile(file) { // Function to fetch a file asynchronously

        const xhr = new XMLHttpRequest(); 
        xhr.open("GET", file, true); // true indicates asynchronous
        xhr.onload = function () { // Define the callback for when the request completes

            if (xhr.status === 200) { 

                const data = JSON.parse(xhr.responseText); 

                if (data.data) { // Check if the 'data' property exists in the response
                    allData = allData.concat(processData(data.data)); // Process and add the data to the allData array
                }

                if (data.data_location) { // Check if there is another file to load

                    fetchFile(`data/${data.data_location}`); // Recursively fetch the next file

                } 
                
                else {

                    
                    const finalXhr = new XMLHttpRequest(); 
                    finalXhr.open("GET", "data/data3.json", true); // Open an asynchronous GET request for data3.json
                    finalXhr.onload = function () { // Define the callback for the final request

                        if (finalXhr.status === 200) { 
                            const finalData = JSON.parse(finalXhr.responseText); 
                            allData = allData.concat(processData(finalData.data)); 
                            renderTable(allData); // Display the combined data
                        } 
                        
                        else {
                            console.error("Failed to load data3.json"); 
                        }

                    };

                    finalXhr.send(); // Send the final request
                }

            } 
            
            else {
                console.error(`Failed to load ${file}`); 
            }

        };

        xhr.send(); // Send the request
    }

    fetchFile(currentFile); // Start fetching the first file
}

function loadDataFetch() 
{ // 3. Fetch with Promises

    let allData = []; 
    let currentFile = 'data/reference.json'; 

    function fetchNextFile(file) 
    { // Function to fetch a file using promises

        return fetch(file) // Perform a fetch request

            .then(response => { // Handle the response

                if (!response.ok) { 
                    throw new Error(`Failed to load ${file}`); 
                }
                
                return response.json(); 
            })

            .then(data => { // Handle the parsed data
                if (data.data) { 
                    allData = allData.concat(processData(data.data)); 
                }

                if (data.data_location) { // Check if there is another file to load
                    return fetchNextFile(`data/${data.data_location}`); // Recursively fetch the next file
                }

            });

    }

    fetchNextFile(currentFile) // Start fetching the first file
        .then(() => {

            return fetch("data/data3.json") // Perform a fetch request for data3.json

                .then(response => { // Handle the response
                    if (!response.ok) { 
                        throw new Error("Failed to load data3.json"); 
                    }
                    return response.json(); 
                })

                .then(finalData => { // Handle the parsed data
                    allData = allData.concat(processData(finalData.data)); // Process and add the final data to the allData array
                });

        })

        .then(() => {
            renderTable(allData); 
            
        })

        .catch(error => {
            
        });

}
