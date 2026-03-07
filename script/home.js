const manageSpinner = (status) =>{
    if(status ==true){
        document.getElementById("spinner-section").classList.remove("hidden");
        document.getElementById("issue-cards").classList.add("hidden");
    }
    else{
        document.getElementById("spinner-section").classList.add("hidden");
        document.getElementById("issue-cards").classList.remove("hidden");
     }
}

const removeActive = () => {
    const allbtns = document.getElementsByClassName("all-btn");
    for (let btn of allbtns) {
        btn.classList.remove("btn-active");
        // Also remove any other active classes that might be present
        btn.classList.remove("bg-primary");
        btn.classList.remove("text-white");
    }
}

const loadAllIssues = async () => {
    manageSpinner(true);
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    const response = await fetch(url);
    const data = await response.json();
    removeActive();
    const allbtn = document.getElementById("all-button");
    if (allbtn) {
        allbtn.classList.add("btn-active");
    }

    displayIssues(data.data, data.data.length);
}

const loadOpenIssues = async () => {
    manageSpinner(true);
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    const response = await fetch(url);
    const data = await response.json();
    removeActive();
    const openbtn = document.getElementById("open-btn");
    if (openbtn) {
        openbtn.classList.add("btn-active");
    }
    const openIssues = data.data.filter(issue => issue.status === "open");
    displayIssues(openIssues, openIssues.length);
}

const loadClosedIssues = async () => {
    manageSpinner(true);
    const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
    const response = await fetch(url);
    const data = await response.json();
    removeActive();
    const closedbtn = document.getElementById("closed-btn");
    if (closedbtn) {
        closedbtn.classList.add("btn-active");
    }
    const closedIssues = data.data.filter(issue => issue.status === "closed");
    displayIssues(closedIssues, closedIssues.length);
}

const displayIssues = (issues, totalIssues) => {
    const issueContainer = document.getElementById("issue-cards");
    issueContainer.innerHTML = "";

    // Update the issue length display
    const issueLength = document.getElementById("issue-length");
    if (issueLength) {
        issueLength.textContent = `${totalIssues} Issues`;
    }

    issues.forEach(issue => {
        
        const issuecard = document.createElement("div");
        issuecard.classList.add("rounded-md", "shadow-md", "bg-white", "p-5");
        if(issue.status === "open"){
            issuecard.classList.add("border-green-500", "border-t-4");
        }
        else if(issue.status === "closed"){
            issuecard.classList.add("border-[#A855F7]", "border-t-4");
        }
        issuecard.onclick = () => handleIssueClick(issue.id);
        issuecard.innerHTML = `
                        <div class="flex justify-between items-center mb-3">
                            <img class="w-8 h-8" src="${issue.status === 'open' ? '/assets/Open-Status.png' : '/assets/Closed-Status.png'}" alt="">
                            <div class="px-4 flex justify-center items-center bg-${issue.priority === 'high' ? 'red-300' : issue.priority === 'medium' ? '[#FFF8DB]' : '[#EEEFF2]'} 
                            text-${issue.priority === 'high' ? 'red-600' : issue.priority === 'medium' ? '[#D97706]' : '[#5B5F67]'} rounded-2xl">
                                ${issue.priority}
                            </div>
                        </div>
                        <div class="space-y-3">
                            <h2 class="text-xl font-bold">
                                ${issue.title}
                            </h2>
                            <p class="text-gray-600">
                                ${issue.description}
                            </p>
                        </div>
                        <div class="flex gap-4 my-4">
                        ${issue.labels.map(label => `<div class="px-4 py-1 flex justify-center items-center bg-[#FFF8DB] text-[#D97706] rounded-2xl">${label}</div>`).join('')}
                        </div>
                        <hr class="border-gray-300">
                        <div class="space-y-3 my-3">
                            <p class="text-gray-500">#${issue.id} by ${issue.author}</p>
                            <p class="text-gray-500">Created At: ${issue.createdAt}</p>
                        </div>
    `;
    issueContainer.appendChild(issuecard);
    });
    manageSpinner(false);
}

const handleIssueClick = async (id) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
    // Implement the logic to fetch and display issue details
    const res = await fetch(url);
    const data = await res.json();
    showIssueDetails(data.data);
};

const showIssueDetails = (issue) => {
    const issueDetailsContainer = document.getElementById("issue-details-container");
    issueDetailsContainer.innerHTML = `
        <h2 class="text-2xl font-bold">${issue.title}</h2>
                        <div class="flex gap-2">
                            <div class="px-2 text-white bg-green-500 rounded-lg text-[13px]">${issue.status}ed</div>
                            <p class="text-gray-500 text-[13px]">Opened by ${issue.author}</p>
                            <p class="text-gray-500 text-[13px]">Created At: ${issue.createdAt}</p>
                        </div>
                        <div class="flex gap-3 my-4">
                            ${issue.labels.map(label => `<div class="bg-[#FFF8DB] text-[#D97706] rounded-xl px-2">${label}</div>`).join('')}
                        </div>
                        <p class="text-gray-500 mb-5">${issue.description}</p>
                        <div class="flex justify-between mx-5 bg-base-200 rounded-lg p-4">
                            <div class="mx-5">
                                <p class="text-gray-500">Assignee: </p>
                                <h3 class="font-bold">${issue.author}</h3>
                            </div>
                            <div class="mx-5">
                                <p class="text-gray-500">Priority: </p>
                                <h3 class="flex justify-center bg-red-500 text-white rounded-xl px-2">${issue.priority}</h3>
                            </div>
                        </div>
    `;
    document.getElementById("my_modal_5").showModal();

}

//search functionality
document.getElementById("btn-search").addEventListener("click", ()=>{
    removeActive();
    const searchInput = document.getElementById("search-input");
    // Implement search functionality here
    const searchValue = searchInput.value.trim().toLowerCase();
    manageSpinner(true);
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchValue}`)
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const matchedWord = allWords.filter((word) => word.title.toLowerCase().includes(searchValue));
        //length of the matched word
        const matchedWordLength = matchedWord.length;
        // display the matched word details
        displayIssues(matchedWord, matchedWordLength);
    });
});

loadAllIssues();