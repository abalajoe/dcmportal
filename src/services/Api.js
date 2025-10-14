// src/services/api.js
export const loginUser = async (email, pswrd) => {
    try {
        const response = await fetch(
            "http://localhost:8082/api/userSignin",
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
