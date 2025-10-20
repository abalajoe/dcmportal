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
    console.log('llllll')
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/accountStatement";

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

export const FetchDepartments = async () => {
    try {
        const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/findAllDepartment";
        const response = await axios.get(httpUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            timeout: 30000, // 30s timeout
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
};

export const CreateDept = (deptParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/department";

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "POST",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        const params = {
            name: deptParams.name,
            description: deptParams.description
        };
        console.log(`Request ${JSON.stringify(params)}`);

        // Set timeout to 30 seconds (30000 milliseconds)
        axios
            .post(httpUrl, params, { headers, timeout: 1200000 })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};

export const EditDept = (deptParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/department/"+deptParams.id;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "PUT",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        const params = {
            name: deptParams.name,
            description: deptParams.description
        };
        console.log(`Request ${JSON.stringify(params)}`);

        // Set timeout to 30 seconds (30000 milliseconds)
        axios
            .put(httpUrl, params, { headers, timeout: 1200000 })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};

export const UpdateDept = (deptParams) => {
    // e.g. deptParams = { id: 5, action: "approve" }
    const httpUrl = `http://localhost:8082/api/accountstatementengine/v1/user/department/${deptParams.id}/status?action=${deptParams.action}`;

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
    };

    console.log(`Requesting: ${httpUrl}`);

    return new Promise((resolve, reject) => {
        axios
            .put(httpUrl, {}, { headers, timeout: 1200000 }) // empty body for now
            .then((res) => resolve(res))
            .catch((err) => reject(err));
    });
};

export const CreateRole = (roleParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/role";

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "POST",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        const params = {
            name: roleParams.name,
            description: roleParams.description,
            department: roleParams.department
        };
        console.log(`Request ${JSON.stringify(params)}`);

        // Set timeout to 30 seconds (30000 milliseconds)
        axios
            .post(httpUrl, params, { headers, timeout: 1200000 })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};