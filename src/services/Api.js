// src/services/api.js
import axios from "axios";

export const loginUser = async (email, pswrd) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_BASE_URL2}/userSignin`,
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
    const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    // const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/accountStatement";

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
            timeout: 30000, // 30s timeout
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
};

export const FetchBranches = async () => {
    try {
        const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/findAllBranches";
        const response = await axios.get(httpUrl, {
            timeout: 30000, // 30s timeout
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
};
export const FetchSignature = async (accountNo) => {
    try {
        const httpUrl = `${process.env.REACT_APP_SIGN_URL}/retrieve?accountNumber=${accountNo}`;
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

export const CreateLogCategory = (deptParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/logCategory";

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

export const EditLogCategory = (deptParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/logCategory/"+deptParams.id;

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
export const EditBranch = (deptParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/branch/"+deptParams.id;

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
export const CreateBranch = (deptParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/branch";

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

export const UpdateBranch = (deptParams) => {
    // e.g. deptParams = { id: 5, action: "approve" }
    const httpUrl = `http://localhost:8082/api/accountstatementengine/v1/user/branch/${deptParams.id}/status?action=${deptParams.action}`;

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

export const EditRole = (deptParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/role/"+deptParams.id;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "PUT",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        const params = {
            name: deptParams.name,
            description: deptParams.description,
            department: deptParams.department
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

export const EditManager = (deptParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/manager/"+deptParams.id;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "PUT",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        };
        const params = {
            name: deptParams.name,
            description: deptParams.description,
            department: deptParams.department
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

export const UpdateLogCategory = (deptParams) => {
    // e.g. deptParams = { id: 5, action: "approve" }
    const httpUrl = `http://localhost:8082/api/accountstatementengine/v1/user/logCategory/${deptParams.id}/status?action=${deptParams.action}`;

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

export const UpdateRole = (deptParams) => {
    // e.g. deptParams = { id: 5, action: "approve" }
    const httpUrl = `http://localhost:8082/api/accountstatementengine/v1/user/role/${deptParams.id}/status?action=${deptParams.action}`;

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

export const UpdateManager = (deptParams) => {
    // e.g. deptParams = { id: 5, action: "approve" }
    const httpUrl = `http://localhost:8082/api/accountstatementengine/v1/user/manager/${deptParams.id}/status?action=${deptParams.action}`;

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

export const CreateManager = (roleParams) => {
    // const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountStatement`;
    const httpUrl = "http://localhost:8082/api/accountstatementengine/v1/user/manager";

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
export const TrackSmtAPI = (userParams) => {
    const httpUrl = `${process.env.REACT_APP_BASE_URL}/trackStatement`;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "POST",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        };
        const params = {
            startDt: userParams.startDt,
            endDt: userParams.endDt,
        };
        console.log(`httpUrl ${httpUrl}`);
        console.log(`Request ${JSON.stringify(params)}`);
        axios
            .post(httpUrl, params, { headers })
            .then((res) => {
                console.log(`Reccord statement ${JSON.stringify(res)}`);
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};

export const ConfigDetailsAPI = () => {
    const httpUrl = `${process.env.REACT_APP_BASE_URL}/fetchConfigs`;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "GET",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        };
        // window.alert(`Selected Date ${JSON.stringify(params)}`);
        axios
            .get(httpUrl, { headers })
            .then((res) => {
                // console.log(`Config response response ${JSON.stringify(res)}`);
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};

export const UsersAPI = () => {
    const httpUrl = `${process.env.REACT_APP_BASE_URL}/allUsers`;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "GET",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        };
        axios
            .get(httpUrl, { headers })
            .then((res) => {
                // console.log(`users ${JSON.stringify(res)}`);
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};

export const PrintSmtAPI = (userParams) => {
    const httpUrl = `${process.env.REACT_APP_BASE_URL}/accountBalance`;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "POST",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        };
        const params = {
            accountNo: userParams.loanAcc,
            startDt: userParams.startDt,
            endDt: userParams.endDt,
            base64Stmt: userParams.base64Stmt,
            numPages: userParams.numPages,
            curUser: userParams.curUser,
            statementType: userParams.request,
        };
        console.log(`Request ${JSON.stringify(params)}`);

        axios
            .post(httpUrl, params, { headers })
            .then((res) => {
                console.log(`Printer Response ${JSON.stringify(res.data)}`);
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};

export const WaiveChargeAPI = (userParams) => {
    const httpUrl = `${process.env.REACT_APP_BASE_URL}/waivecharge`;

    const resp = new Promise((resolve, reject) => {
        const headers = {
            method: "POST",
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        };
        const params = {
            accountNo: userParams.loanAcc,
            startDt: userParams.startDt,
            endDt: userParams.endDt,
            base64Stmt: userParams.base64Stmt,
            numPages: userParams.numPages,
            curUser: userParams.curUser,
            statementType: userParams.request,
        };
        console.log(`Request ${JSON.stringify(params)}`);

        axios
            .post(httpUrl, params, { headers })
            .then((res) => {
                console.log(`Printer Response ${JSON.stringify(res.data)}`);
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return resp;
};