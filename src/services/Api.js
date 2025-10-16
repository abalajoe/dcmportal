// src/services/api.js
import axios from "axios";

export const loginUser = async (email, pswrd) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/userSignin`,
            // "http://localhost:8082/api/userSignin",
            // "http://172.16.20.112:8082/api/userSignin",
            // "http://localhost:7081/api/accountstatementengine/v1/auth/authenticate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, pswrd }),
            }
        );

        console.log('--> ',response)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();
        console.log('--22> ',data)
        return data; // the token or any response from backend
    } catch (err) {
        throw err;
    }
};

export const AccountSmtAPI = (userParams) => {
    const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "POST",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        const params = {
            accountNo: userParams.loanAcc,
            startDt: userParams.startDt,
            endDt: userParams.endDt,
            curUser: localStorage.getItem("curUserEmail")
        };
        console.log(`Request ${JSON.stringify(params)}`);

        // Set timeout to 30 seconds (30000 milliseconds)
        axios
            .post(httpUrl, params, { headers, timeout: 1200000 })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};