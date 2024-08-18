import axios from 'axios';
import { store } from "../../store/index";
import { setToken, setUser } from "../../store/auth/auth.slice";
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
    baseURL,
    timeout: 100000,
});

const errorHandler = (error, hooks) => {
    console.log(error);
    return Promise.reject(error.response)
}

axiosInstance.interceptors.request.use(
    config => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => errorHandler(error)
)

axiosInstance.interceptors.response.use(response => {
    const res = response.data;
    if (res.code === 1003) {
        localStorage.removeItem('token')
        store.dispatch(setToken(null));
        store.dispatch(setUser(null));
        // history.push('/login')
        // window.location.href = "/login"
    }
    if (res.code === 4001 || res.code === 4002) {
        localStorage.removeItem('token')
        store.dispatch(setToken(null));
        store.dispatch(setUser(null));
    }
    if (res.code != 200) {
        if (res.message != 'INVALID_TOKEN') {
            toast.error(
                <div>
                    <div className="fw-600 fz16 mb-5px">Error [{res.code}]</div>
                    <div className="fz14">
                        {res.message}
                    </div>
                </div>
            )
        }
    }
    return response;
}, error => errorHandler(error));


export default axiosInstance;
