//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: All orders list 
//Descrption: Admin and staff can view total numbers of orders
//First written on: 7 October, 2023
//Edited on:

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";

import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { allOrders, clearErrors, deleteOrder } from '../../actions/orderActions'
import Sidebar from "./Sidebar";
import { DELETE_ORDERS_RESET } from "../../constants/orderConstants";



const OrdersList = () => {

  const navigate = useNavigate(); // Initialize the navigate function
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.allOrders);
  const { isDeleted } = useSelector(state => state.order)

  useEffect(() => {
    dispatch(allOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success('Order deleted successfully');
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDERS_RESET })
    }

  }, [dispatch, alert, isDeleted]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id))
  }

  const downloadOrder = (order) => {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Cafe KKJ Order Receipt", 20, 20);

    doc.setFontSize(12);

    doc.text(`Customer Name: ${order.user ? order.user.name : "N/A"}`, 20, 35);

    doc.text(
      `Phone Number: ${order.shippingInfo ? order.shippingInfo.phoneNo : "N/A"
      }`,
      20,
      45
    );

    doc.text(`Order ID: ${order._id}`, 20, 55);

    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      20,
      65
    );

    doc.text(`Order Status: ${order.orderStatus}`, 20, 75);

    doc.text(`Payment Status: ${order.paymentInfo.status}`, 20, 85);

    doc.text(`Total Amount: RM${order.totalPrice}`, 20, 95);

    const tableColumn = [
      "Food",
      "Price",
      "Quantity",
      "Subtotal",
    ];

    const tableRows = [];

    order.orderItems.forEach((item) => {

      tableRows.push([
        item.name,
        `RM${item.price}`,
        item.quantity,
        `RM${item.price * item.quantity}`,
      ]);

    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 110,
    });

    doc.save(`Order_${order._id}.pdf`);

  };

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "No of Items",
          field: "numofItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Delivered Time & Date",
          field: "deliveredAt",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };
    if (orders) {
      const sortedOrders = [...orders].reverse();

      sortedOrders.forEach((order) => {
        data.rows.push({
          id: order._id,
          numofItems: order.orderItems.length,
          amount: `RM${order.totalPrice}`,
          status: order.orderStatus && String(order.orderStatus).includes('Delivered')
            ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
            : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
          deliveredAt: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : '-',
          actions: (
            <Fragment>

              <Link
                to={`/admin/order/${order._id}`}
                className="btn btn-primary py-1 px-2"
                title="View"
              >
                <i className="fa fa-eye"></i>
              </Link>

              <button
                className="btn btn-success py-1 px-2 ml-2"
                title="Download PDF"
                onClick={() => downloadOrder(order)}
              >
                <i className="fa fa-download"></i>
              </button>

              <button
                className="btn btn-danger py-1 px-2 ml-2"
                title="Delete"
                onClick={() => deleteOrderHandler(order._id)}
              >
                <i className="fa fa-trash"></i>
              </button>

            </Fragment>
          ),
        });
      });
    }
    return data;
  };

  return (
    <Fragment>
      <MetaData title={`All Orders`} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Orders</h1>

            {loading ? (
              <Loader />
            ) : (
              <div className="table-responsive">
                <MDBDataTable
                  data={setOrders()}
                  className="px-3"
                  bordered
                  striped
                  hover
                />
              </div>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default OrdersList
