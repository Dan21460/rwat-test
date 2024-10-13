const STUDENT_DATA_JSON = '[' + 
'{"name": "Annie Apple","id": "X00111111","address": "Phibsboro, D7","grades": [60, 71, 55, 53, 44, 62]},' + 
'{"name": "Ben Bounce","id": "B00111111","address": "Rathmines, D6","grades": [44, 22, 77, 33, 41, 50]},' +
'{"name": "Charlie Curry","id": "B00222222","address": "Phibsboro, D7","grades": [80, 88, 75, 81, 90, 77]},' +
'{"name": "Dan Dreamer","id": "X00222222","address": "Cabra, D7","grades": [64, 55, 66, 65, 78, 62]},' +
'{"name": "Emmy Ember","id": "X00333333","address": "Stoneybatter, D7","grades": [33, 25, 55, 22, 31, 60]},' +
'{"name": "Fiona Falls","id": "C00111111","address": "Grangegorman, D7","grades": [90, 91, 88, 80, 81, 97]},' +
'{"name": "Georgina Gull","id": "C00222222","address": "City Centre, D1","grades": [76, 67, 63, 71, 55, 82]},' +
'{"name": "Harry Hops","id": "C00333333","address": "Cabra, D7","grades": [20, 33, 35, 11, 42, 61]},' +
'{"name": "Iris Indie","id": "X00444444","address": "Tallaght, D24","grades": [61, 71, 58, 70, 65, 67]},' +
'{"name": "Jack Jobs","id": "C00444444","address": "Phibsboro, D7","grades": [10, 21, 15, 53, 24, 42]},' +
'{"name": "Kat Kid","id": "C00555555","address": "Grangegorman, D7","grades": [41, 41, 50, 48, 55, 44]},' +
'{"name": "Lula Lock","id": "C00666666","address": "Cabra, D7","grades": [77, 80, 85, 80, 78, 81]}' + 
']';

// Exercise 2

const STUDENT_DATA = JSON.parse(STUDENT_DATA_JSON);


const calculateAverage = (grades) => grades.reduce((acc, curr) => acc + curr, 0) / grades.length; // Function to calculate average of an array

const ids = STUDENT_DATA.map(student => student.id).join(', ');


document.getElementById('student-ids').innerText = `IDs: ${ids}`; // Display IDs in HTML

const newStudentList = STUDENT_DATA.map(student => {
    const [town, postcode] = student.address.split(', D'); // Split the address
    const [name, surname] = student.name.split(' ');       // Split name and surname
    const averageGrade = calculateAverage(student.grades);  // Calculate the average grade
    const isBest = averageGrade === Math.max(...STUDENT_DATA.map(s => calculateAverage(s.grades)));

    let resultCategory = averageGrade >= 40 ? 'P' : 'F';    // Pass or Fail
    if (isBest && averageGrade >= 40) resultCategory = 'A'; // Best in class

    return {
        name,
        surname,
        id: student.id,
        town: town.trim(),
        postcode: parseInt(postcode.trim()),
        averageGrade: averageGrade.toFixed(2),
        resultCategory
    };
});

const tbody = document.getElementById('student-table').querySelector('tbody'); // Display the new student list in a table


newStudentList.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.surname}</td>
        <td>${student.id}</td>
        <td>${student.town}</td>
        <td>${student.postcode}</td>
        <td>${student.averageGrade}</td>
        <td>${student.resultCategory}</td>
    `;
    tbody.appendChild(row);
});

const hasFailures = newStudentList.some(student => student.resultCategory === 'F');
console.log('Has any student failed? ', hasFailures); // Displays in console

const failedStudents = newStudentList.filter(student => student.resultCategory === 'F');

const failedStudentsDiv = document.getElementById('failed-students');
if (failedStudents.length > 0) {  // Check if there are any failed students in the list

    const failedTable = document.createElement('table'); // Create a new HTML table element
    failedTable.border = "1";
    failedTable.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Surname</th>
                <th>ID</th>
                <th>Result Category</th>
            </tr>
        </thead>
        <tbody>
        ${failedStudents.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.surname}</td>
                <td>${student.id}</td>
                <td>${student.resultCategory}</td>
            </tr>`).join('')}
        </tbody>
    `;
    failedStudentsDiv.appendChild(failedTable);
} else {
    failedStudentsDiv.innerText = 'No students have failed.';
}

const classAverage = (newStudentList.reduce((acc, student) => acc + parseFloat(student.averageGrade), 0) / newStudentList.length).toFixed(2); // Calculate the class average by summing all student average grades and dividing by the number of students


document.getElementById('class-average').innerText = `Class Average: ${classAverage}%`;

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exercise 3

const messageTemplate = (messageType) => (name, percentage) => {
    if (messageType === 'progression') {
        return `Dear ${name}, your average result for the semester is ${percentage}. Congratulations on your progression to the next semester!`;
    } else if (messageType === 'fail') {
        return `Dear ${name}, your average result for the semester is ${percentage}. Unfortunately, you have not passed and will have to repeat some exams.`;
    } else if (messageType === 'bestInClass') {
        return `Dear ${name}, your average result for the semester is ${percentage}. Congratulations, you have won the Best in Class award!`;
    }
};

const messagesContainer = document.getElementById('student-messages');

const allMessages = newStudentList.reduce((acc, student) => {
    let message;
    if (student.resultCategory === 'A') {
        message = messageTemplate('bestInClass')(student.name, student.averageGrade);
    } else if (student.resultCategory === 'P') {
        message = messageTemplate('progression')(student.name, student.averageGrade);
    } else if (student.resultCategory === 'F') {
        message = messageTemplate('fail')(student.name, student.averageGrade);
    }
    
    return acc + `<p>${message}</p>`;
}, '');

// Display all messages in the HTML
messagesContainer.innerHTML = allMessages;

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exercise 4



const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // Delay after only 3 seconds

async function* infiniteMessageGenerator() {
    let index = 0; // Initialize index to track the current student
    const studentNames = STUDENT_DATA.map(student => student.name); // Extract student names into an array

    while (true) {
        const name = studentNames[index];         // Get the current student's name from the array using the index

        
        // Yield the personalized welcome message
        yield `Hello ${name}, welcome to the new semester!`;

        // Increment the index to move to the next student
        // Use modulus to ensure the index loops back to the start when it reaches the end of the list
        index = (index + 1) % studentNames.length;

        // Wait for exactly 3 seconds before yielding the next message
        await delay(3000); // 3000 milliseconds = 3 seconds
    }
}



async function displayMessages() { // Displays messages as they arrive
    const messageElement = document.getElementById('welcome-message');
    const messageGenerator = infiniteMessageGenerator();
    
   
    for await (const message of messageGenerator) {  // Continuously fetch and display new messages
        messageElement.innerText = message;
    }
}

// Start displaying the messages
displayMessages();



