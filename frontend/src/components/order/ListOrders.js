//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: List of Orders page
//Descrption: List of Orders will be shown in this section
//First written on: 09 September, 2023
//Edited on: 07 January, 2024


import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";

import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderActions";

const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);

  useEffect(() => {
    dispatch(myOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  const setOrders = () => {
    const data = {
        columns:[
            {
                label: 'Order ID',
                field: 'id',
                sort: 'asc'
            },
            {
                label: 'Number of Items',
                field: 'numOfItems',
                sort: 'asc'
            },
            {
                label: 'Amount',
                field: 'amount',
                sort: 'asc'
            },
            {
                label: 'Status',
                field: 'status',
                sort: 'asc'
            },
            {
              label: "Delivered Time & Date",
              field: "deliveredAt",
              sort: "asc",
            },
            {
                label: 'Actions',
                field: 'actions',
                sort: 'asc'
            }
        ],
        rows: []
    }

      [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach(order => {
        data.rows.push({
            id:order._id,
            numOfItems: order.orderItems.length,
            amount: `RM${order.totalPrice}`,
            status: order.orderStatus && String(order.orderStatus).includes('Delivered')
            ? <p style={{color:'green'}}>{order.orderStatus}</p>
            : <p style={{color:'red'}}>{order.orderStatus}</p>,
            deliveredAt: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : '-',

            actions:
            <Link to={`/order/${order._id}`} className="btn btn-primary">
                <i className="fa fa-eye"></i>
            </Link>
        })
    })
    return data;
  }

  return (
    <Fragment>
      <MetaData title={"My Orders"} />
      <h1 className="my-5">My Orders</h1>
      {loading ? <Loader /> : (
        <MDBDataTable 
        data ={setOrders()}
        className="px-3"
        bordered
        striped
        hover
        />
      )}
    </Fragment>
  );
};

export default ListOrders;
