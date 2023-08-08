const readline = require("readline");
const axios = require("axios");
require("dotenv").config();

const api_key = process.env.CHECKR_API_KEY;
const base_url = process.env.BASE_URL;

const config = {
    auth: { username: api_key },
    headers: { "Content-Type": "application/json" },
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function createCandidate(firstName, lastName, email) {

    try {
        const response = await axios.post(
            `${base_url}/candidates`,
            {
                first_name: firstName,
                last_name: lastName,
                email: email,
            },
            config
        );

        console.log("Candidate creation response:", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred", error.message);
    }
}

async function getPackages() {
    const response = await axios.get(`${base_url}/packages`, config)
    let packages = response.data
    const slugs = packages.data.filter(item => item.slug)
    console.log(slugs);
    return slugs
}

async function createInvitation(firstName, lastName, email) {
    let candidateData = await createCandidate(firstName, lastName, email)
    let packageName = await getPackages()
    try {
        const response = await axios.post(
            `${base_url}/invitations`,
            {
                candidate_id: candidateData.id,
                package: packageName,
            },
            config
        );
        console.log(response.data);
    }
    catch (error) {

    }
}
const read = () => {
    console.log("1. Create Candidate\n2. Create Invitation\n3. Get Package");
    rl.question("Select option: ", (userInput) => {
        if (userInput.toLowerCase() === "exit") {
            console.log("Goodbye!");
            rl.close();
        } else {
            main(userInput)
                .then(() => {
                    read();
                })
                .catch((error) => {
                    console.error("An error occurred", error);
                });
        }
    });
};
async function main(value) {
    try {
        value = parseInt(value);
        switch (value) {
            case 1:
                await createCandidate();
                console.log("Created candidate\n");
                break;
            case 2:
                await createInvitation()
                console.log("Created Invitation\n");
                break;
            case 3:
                await getPackages();
                break
            default:
                console.log("Invalid option\n");
        }
    } catch (error) {
        console.error("An error occurred", error);
    }
}
read();
