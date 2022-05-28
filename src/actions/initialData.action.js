import { initialDataConstants, categoryConstants, productConstants, orderConstants, userConstants } from "./constants";
import axios from "../helpers/axios";
export const getInitialData=()=>{
    return async dispatch=>{
//        dispatch({type:initialDataConstants.GET_All_INITIAL_DATA_REQUEST});
        const res=await axios.post('./initialData');
        if(res.status===200){
            const {categories,products,orders,address}=res.data;
            dispatch({
                type:categoryConstants.GET_ALL_CATEGORIES_SUCCESS,
                payload:{categories}
            });
            dispatch({
                type:productConstants.GET_ALL_PRODUCTS_SUCCESS,
                payload:{products}
            })
            dispatch({
                type:orderConstants.GET_CUSTOMER_ORDER_SUCCESS,
                payload:{orders}
            })
            dispatch({
                type: userConstants.GET_USER_ADDRESS_SUCCESS,
                payload: { address },
            })
        }
        console.log(res);
    }
}