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

async function createCandidate() {

    try {
        const response = await axios.post(
            `${base_url}/candidates`,
            {
                copy_requested: true,
                dob: "1964-03-15",
                driver_license_number: "981736076",
                driver_license_state: "CT",
                email: "michael.scott@gmail.com",
                first_name: "Michael",
                last_name: "Scott",
                middle_name: "Gary",
                phone: "2035408926",
                ssn: "151-11-2001",
                work_locations: [{ country: "US" }],
                zipcode: "06831",
            },
            config
        );

        console.log("---------------------------------------------------------");
        console.log("Candidate creation response:", response.data);
        console.log("---------------------------------------------------------");
        return response.data;
    } catch (error) {
        console.error("An error occurred", error.message);
        console.log("---------------------------------------------------------");
        console.log("An error occurred", error);
        console.log("---------------------------------------------------------");
    }
}

const read = () => {
    console.log("1. Create Candidate\n2. Create Invitation");
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
                console.log("Created Invitation\n");
                break;
            default:
                console.log("Invalid option\n");
        }
    } catch (error) {
        console.error("An error occurred", error);
    }
}
read();
