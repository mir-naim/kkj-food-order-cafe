//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: List of Orders page
//Descrption: List of Orders will be shown in this section
//First written on: 09 September, 2023
//Edited on: 07 January, 2024

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
import { clearErrors, myOrders } from "../../actions/orderActions";

const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(myOrders());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);



  const downloadOrder = (order) => {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Cafe KKJ Order Receipt", 20, 20);
  

  doc.setFontSize(12);

doc.text(`Customer Name: ${user ? user.name : ""}`, 20, 35);
doc.text(`Phone Number: ${order.shippingInfo.phoneNo}`, 20, 45);

doc.text(`Order ID: ${order._id}`, 20, 55);
doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 65);
doc.text(`Order Status: ${order.orderStatus}`, 20, 75);
doc.text(`Total Amount: RM${order.totalPrice}`, 20, 85);

  const tableColumn = [
    "Food",
    "Price",
    "Quantity",
    "Subtotal"
  ];

  const tableRows = [];

  order.orderItems.forEach(item => {

    tableRows.push([
      item.name,
      `RM${item.price}`,
      item.quantity,
      `RM${item.price * item.quantity}`
    ]);

  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80
  });

  doc.save(`Order_${order._id}.pdf`);

};

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

    const sortedOrders = orders.sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

    sortedOrders.forEach(order => {
        data.rows.push({
            id:order._id,
            numOfItems: order.orderItems.length,
            amount: `RM${order.totalPrice}`,
            status: order.orderStatus && String(order.orderStatus).includes('Delivered')
            ? <p style={{color:'green'}}>{order.orderStatus}</p>
            : <p style={{color:'red'}}>{order.orderStatus}</p>,
            deliveredAt: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : '-',

            actions:
            <>
              <Link
                to={`/order/${order._id}`}
                className="btn btn-primary mr-2"
                title="View Order"
              >
                <i className="fa fa-eye"></i>
              </Link>

              <button
                className="btn btn-success"
                title="Download PDF"
                onClick={() => downloadOrder(order)}
              >
                <i className="fa fa-download"></i>
              </button>
            </>
        })
    })
    return data;
  }

  return (
    <Fragment>
      <MetaData title={"My Orders"} />
      <h1 className="my-5">My Orders</h1>
      {loading ? <Loader /> : (
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
  );
};

export default ListOrders;
