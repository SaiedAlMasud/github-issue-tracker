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
        issuecard.innerHTML = `
                        <div class="flex justify-between p-5">
                            <img class="w-8 h-8" src="${issue.status === 'open' ? '../assets/Open-Status.png' : '../assets/Closed-Status.png'}" alt="">
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
                            <p class="text-gray-500">Updated At: ${issue.updatedAt}</p>
                        </div>
    `;
    issueContainer.appendChild(issuecard);
    });
}


loadAllIssues();