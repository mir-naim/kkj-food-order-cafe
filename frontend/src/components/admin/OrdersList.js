//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: All orders list 
//Descrption: Admin and staff can view total numbers of orders
//First written on: 7 October, 2023
//Edited on:

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import React, { useState, Fragment, useEffect } from "react";
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

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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


  const filteredOrders = orders
  ? orders.filter(order => {

      if (!fromDate || !toDate) return true;

      const orderDate = new Date(order.createdAt);

      const from = new Date(fromDate);
      const to = new Date(toDate);

      to.setHours(23,59,59,999);

      return orderDate >= from && orderDate <= to;

  })
  : [];

  const totalOrders = filteredOrders.length;

  const completedOrders = filteredOrders.filter(
      order => order.orderStatus === "Delivered"
  ).length;

  const cancelledOrders = filteredOrders.filter(
      order =>
          order.paymentInfo &&
          order.paymentInfo.status === "CANCELLED"
  ).length;

  const pendingOrders = totalOrders - completedOrders - cancelledOrders;

  const totalSales = filteredOrders.reduce((sum, order) => {

      if(order.paymentInfo.status !== "CANCELLED")
          return sum + order.totalPrice;

      return sum;

  },0);


  const printReport = () => {

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text("Cafe KKJ Weekly / Monthly Report",20,20);

    doc.setFontSize(12);

    doc.text(`From : ${fromDate || "All time"}`,20,40);
    doc.text(`To : ${toDate || "All time"}`,20,50);

    doc.text(`Total Orders : ${totalOrders}`,20,70);
    doc.text(`Completed Orders : ${completedOrders}`,20,80);
    doc.text(`Cancelled Orders : ${cancelledOrders}`,20,90);
    doc.text(`Pending Orders : ${pendingOrders}`,20,100);
    doc.text(`Total Sales : RM${totalSales.toFixed(2)}`,20,110);

    const rows=[];

    filteredOrders.forEach(order=>{

        rows.push([
            order._id,
            order.orderStatus,
            order.paymentInfo.status,
            `RM${order.totalPrice}`
        ]);

    });

    autoTable(doc,{
        startY:130,
        head:[[
            "Order ID",
            "Order Status",
            "Payment",
            "Amount"
        ]],
        body:rows
    });

    doc.save("CafeKKJ_Report.pdf");

}

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
      const sortedOrders = [...filteredOrders].reverse();

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
      <div className="row align-items-start">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-4">All Orders</h1>

            <div className="card shadow-sm border-0 p-4 mb-3 orders-report-card">

              {/* Header row: title left, print button right */}
              <div className="d-flex justify-content-between align-items-center flex-wrap mb-3 pb-3 report-header">
                <div>
                  <h4 className="mb-1">Order Report</h4>
                  <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                    Overview of orders {fromDate && toDate ? "in the selected date range" : "(all time)"}
                  </p>
                </div>

                <button
                  className="btn btn-primary d-flex align-items-center gap-2 mt-2 mt-md-0"
                  onClick={printReport}
                  disabled={loading || totalOrders === 0}
                >
                  <i className="fa fa-print mr-2"></i> Print Report
                </button>
              </div>

              {/* Date filter row */}
              <div className="row align-items-end mb-4">

                <div className="col-12 col-md-4">
                  <label className="font-weight-bold small text-uppercase text-muted">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="font-weight-bold small text-uppercase text-muted">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                <div className="col-12 col-md-4 mt-3 mt-md-0">
                  {(fromDate || toDate) && (
                    <button
                      className="btn btn-outline-secondary btn-block"
                      onClick={() => { setFromDate(""); setToDate(""); }}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>

              </div>

              <hr className="mt-0 mb-3" />

              {/* Stat cards */}
              <div className="row text-center report-stats no-gutters-y">

                <div className="col-6 col-md-3 mb-3 mb-md-0 px-2">
                  <div className="stat-box p-3 rounded">
                    <i className="fa fa-list-alt fa-lg text-primary mb-2"></i>
                    <h6 className="text-muted mb-1">Total Orders</h6>
                    <h3 className="mb-0">{totalOrders}</h3>
                  </div>
                </div>

                <div className="col-6 col-md-3 mb-3 mb-md-0 px-2">
                  <div className="stat-box p-3 rounded">
                    <i className="fa fa-check-circle fa-lg text-success mb-2"></i>
                    <h6 className="text-muted mb-1">Completed</h6>
                    <h3 className="mb-0 text-success">{completedOrders}</h3>
                  </div>
                </div>

                <div className="col-6 col-md-3 px-2">
                  <div className="stat-box p-3 rounded">
                    <i className="fa fa-times-circle fa-lg text-danger mb-2"></i>
                    <h6 className="text-muted mb-1">Cancelled</h6>
                    <h3 className="mb-0 text-danger">{cancelledOrders}</h3>
                  </div>
                </div>

                <div className="col-6 col-md-3 px-2">
                  <div className="stat-box p-3 rounded">
                    <i className="fa fa-money fa-lg text-warning mb-2"></i>
                    <h6 className="text-muted mb-1">Total Sales</h6>
                    <h3 className="mb-0">RM {totalSales.toFixed(2)}</h3>
                  </div>
                </div>

              </div>

            </div>

            {loading ? (
              <Loader />
            ) : (
              <div className="table-responsive mt-2">
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

      {/* Scoped styling for the report card */}
      <style>{`
        /* Stop the content column from stretching to match a taller sidebar,
           which is what creates blank space below short content */
        .row.align-items-start > [class*="col-"] {
          align-self: flex-start;
        }
        .orders-report-card {
          border-radius: 12px;
        }
        .report-header {
          border-bottom: 1px solid #eee;
        }
        .stat-box {
          background: #f8f9fa;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .stat-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        }
        .report-stats h3 {
          font-weight: 600;
        }
      `}</style>
    </Fragment>
  )
}

export default OrdersList
