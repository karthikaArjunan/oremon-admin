import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrder, getAddress } from "../../actions";
import { Layout } from "../../components/Layout";
import Card from "../../components/UI/Card";

import "./style.css";

/**
 * @author
 * @function Orders
 **/

export const Orders = (props) => {
  const user = useSelector(state => state.user);
  const order = useSelector((state) => state.order);
  const product = useSelector((state) => state.product)
  const [type, setType] = useState("");
  const [address, setAddress] = useState([]);
  const dispatch = useDispatch();
  const onOrderUpdate = (orderId) => {
    const payload = {
      orderId,
      type,
    };
    console.log(payload);
    dispatch(updateOrder(payload));
  };

  const formatDate = (date) => {
    if (date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
    return "";
  };
  const names = (id) => {
    let x = product.products.map(product => (
      <div>{product._id == id ? product.name : null}</div>
    ));
    return x;
  }
  const addr = (userid,id) => {
    let x = user.address.map(adr => (
     <div>{ adr.user==userid ? adr.address:null }</div> 
    ));
    console.log(x);
    var k=""
    x.forEach(y => {
      if(y.props.children!=null){
        let t=y.props.children;
        t.forEach(f => {
          k+=f.address+" "+f.mobileNumber
        });}
    });
    return k;
  }
  return (
    <Layout sidebar>
      {order.orders.map((orderItem, index) => (
        <Card
          style={{
            margin: "10px 0",
          }}
          key={index}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "50px 50px",
              alignItems: "center",
            }}
          >
            <div>
              <div className="title">Items</div>
              {orderItem.items.map((item) => (
                <div className="value" >
                  {names(item.productId)}
                </div>
              ))}
            </div>
            <div>
              <span className="title">Total Price</span>
              <br />
              <span className="value">Rs. {orderItem.totalAmount}</span>
            </div>
            <div>
              <span className="title">Payment Type</span> <br />
              <span className="value">{orderItem.paymentType}</span>
            </div>
            <div>
              <span className="title">Address</span> <br />
              <span className="value">
                {addr(orderItem.user,orderItem.addressId)}
              </span>
            </div>
          </div>
          <div
            style={{
              boxSizing: "border-box",
              padding: "100px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="orderTrack">
              {orderItem.orderStatus.map((status) => (
                <div
                  className={`orderStatus ${status.isCompleted ? "active" : ""
                    }`}
                >
                  <div
                    className={`point ${status.isCompleted ? "active" : ""}`}
                  ></div>
                  <div className="orderInfo">
                    <div className="status">{status.type}</div>
                    <div className="date">{formatDate(status.date)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* select input to apply order action */}
            <div
              style={{
                padding: "0 50px",
                boxSizing: "border-box",
              }}
            >
              <select onChange={(e) => setType(e.target.value)}>
                <option value={""}>select status</option>
                {orderItem.orderStatus.map((status) => {
                  return (
                    <>
                      {!status.isCompleted ? (
                        <option key={status.type} value={status.type}>
                          {status.type}
                        </option>
                      ) : null}
                    </>
                  );
                })}
              </select>
            </div>
            {/* button to confirm action */}

            <div
              style={{
                padding: "0 50px",
                boxSizing: "border-box",
              }}
            >
              <button onClick={() => onOrderUpdate(orderItem._id)}>
                confirm
              </button>
            </div>
          </div>
        </Card>
      ))}
    </Layout>
  );
}

