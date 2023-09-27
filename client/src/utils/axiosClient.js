import axios from 'axios';
import { KEY_ACCESS_TOKEN, getItem, removeItem, setItem } from './localStorage';
import store from '../redux/store'
import { setLoading, showToast } from '../redux/slices/appConfigureSlice';
import { TOAST_FAILURE } from '../App';
export const axiosClient= axios.create({
    baseURL:process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials:true
})



axiosClient.interceptors.request.use(
    (request)=>{
        
        const accessToken=getItem(KEY_ACCESS_TOKEN);
        
        request.headers['Authorization']=`Bearer ${accessToken}`;
        store.dispatch(setLoading(true));

        return request;
    }
)


axiosClient.interceptors.response.use(
    async (response)=>{
        const data=response.data;

        store.dispatch(setLoading(false));
        
        if(data.status === 'ok'){
            return data;
        }   

        const originalrequest=response.config;
        const statusCode=data.statusCode;
        const error=data.message;

        store.dispatch(showToast({
            type:TOAST_FAILURE,
            message:error
        }))
        

        if(statusCode===401 && !originalrequest._retry){

            originalrequest._retry=true;
            
            const response=await axios.create({
                withCredentials:true,
            }).get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);
            

            if(response.data.status === 'ok'){
                
                setItem(KEY_ACCESS_TOKEN,response.data.result.accessToken);
                originalrequest.headers['Authorization']=`Bearer ${response.data.result.accessToken}`;

                return axios(originalrequest);
            }
            else{
                removeItem(KEY_ACCESS_TOKEN);
                window.location.replace('/login','_self');
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },async(error)=>{
        store.dispatch(setLoading(false));
        store.dispatch(showToast({
            type:TOAST_FAILURE,
            message:error.message
        }))
        return Promise.reject(error);
    }
)