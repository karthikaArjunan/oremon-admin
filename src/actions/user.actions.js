import { authConstants,userConstants } from "./constants"
import axios from "../helpers/axios";
export const signup = (user) => {
    console.log(user);
    return async (dispatch) => {
        dispatch({type:userConstants.USER_REGISTER_REQUEST});
        const res = await axios.post(`/admin/signup`, {
            ...user
        });
        if(res.status===201){
            const {message}=res.data;
            dispatch({
                type:userConstants.USER_REGISTER_SUCCESS,
                payload:{message}
            });
        }else{
            if(res.status===400){
                dispatch({
                    type:userConstants.USER_REGISTER_FAILURE,
                    payload:{error:res.data.error}
                });
            }
        }
    }
}
export const getAddress = () => {
    return async (dispatch) => {
      try {
          console.log("j");
        //const res = await axios.post(`/user/getcustomeraddress`);
        const res=await axios.post('./initialData');
        console.log("q");
        dispatch({ type: userConstants.GET_USER_ADDRESS_REQUEST });
        if (res.status === 200) {
          
          const {categories,products,orders,address}=res.data;
          /*const {
            userAddress: { address },
          } = res.data;*/
          dispatch({
            type: userConstants.GET_USER_ADDRESS_SUCCESS,
            payload: { address },
          });
        } else {
          const { error } = res.data;
          dispatch({
            type: userConstants.GET_USER_ADDRESS_FAILURE,
            payload: { error },
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
