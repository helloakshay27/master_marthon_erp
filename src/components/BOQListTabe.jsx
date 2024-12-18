import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";



const BOQListTable = () => {

    const [openSubProject2, setOpenSubProject2] = useState(false)
    const handleSubProject2 = () => {
        setOpenSubProject2(!openSubProject2)
    }
    const [openSubProject2_1, setOpenSubProject2_1] = useState(false)
    const handleSubProject2_1 = () => {
        setOpenSubProject2_1(!openSubProject2_1)
    }

    const [openSubProject2_11, setOpenSubProject2_11] = useState(false)
    const handleSubProject2_11 = () => {
        setOpenSubProject2_11(!openSubProject2_11)
    }

    const [openSubProject2_12, setOpenSubProject2_12] = useState(false)
    const handleSubProject2_12 = () => {
        setOpenSubProject2_12(!openSubProject2_12)
    }

    const [openSubProject2_13, setOpenSubProject2_13] = useState(false)
    const handleSubProject2_13 = () => {
        setOpenSubProject2_13(!openSubProject2_13)
    }

    const [openSubProjectDetails, setOpenSubProjectDetails] = useState(false)
    const handleSubProjectDetails = () => {
        setOpenSubProjectDetails(!openSubProjectDetails)
    }


    const [openSubProject3, setOpenSubProject3] = useState(false)
    const handleSubProject3 = () => {
        setOpenSubProject3(!openSubProject3)
    }

    const [openSubProject, setOpenSubProject] = useState(false)
    const handleSubProject = () => {
        setOpenSubProject(!openSubProject)
    }

    const tableData = [
        {
            id: 1,
            project: "Sanvo",
            boqId: "",
            unit: "",
            costQty: "",
            costRate: "",
            costValue: "",
            status: "",
            subRows: [
                {
                    id: 11,
                    description: "Admin expense",
                    boqId: "",
                    unit: "",
                    costQty: "",
                    costRate: "",
                    costValue: "",
                    status: "",
                },
                {
                    id: 12,
                    description: "Purchase of Item",
                    boqId: "187062",
                    unit: "",
                    costQty: "",
                    costRate: "",
                    costValue: "",
                    status: "Approved",
                },
            ],
        },
    ];
 const handleClick =()=>{
    setOpenSubProject(false)
    setOpenSubProject2(false)
    setOpenSubProject2_1(false)
    setOpenSubProject2_11(false)
    setOpenSubProject2_12(false)
    setOpenSubProject2_13(false)
    setOpenSubProjectDetails(false)
    setOpenSubProject3(false)
   
 }
 console.log(openSubProject)

    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4">


                    <div className="d-flex justify-content-start ms-3">
                        <button className="purple-btn2" onClick={handleClick}>Collapse All</button>
                    </div>
                    <div className="tbl-container mx-3 mt-1">
                        <table className="w-100">
                            <thead>
                                <tr>
                                    <th className="text-start">Expand</th>
                                    <th className="text-start">Project/Sub-Project</th>
                                    <th className="text-start">BOQ ID</th>
                                    <th className="text-start">Unit</th>
                                    <th className="text-start">Cost Qty</th>
                                    <th className="text-start">Cost Rate</th>
                                    <th className="text-start">Cost Value</th>
                                    <th>
                                        <div className="d-flex justify-content-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={14}
                                                height={14}
                                                fill="currentColor"
                                                style={{ marginTop: 3 }}
                                                className="bi bi-trash3-fill"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                            </svg>
                                            <input className="ms-1 me-1 mb-1" type="checkbox" />
                                            <p>Status</p>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {/* 1st row main project */}
                                <tr>
                                    <td>
                                        <button
                                            className="btn btn-link p-0"
                                            onClick={handleSubProject}
                                            aria-label="Toggle row visibility"
                                        >
                                            {openSubProject ? (
                                                // Show minus SVG if row is expanded
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="black"
                                                    className="bi bi-dash-circle"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z" />
                                                </svg>
                                            ) : (
                                                // Show plus SVG if row is collapsed
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="black"
                                                    className="bi bi-plus-circle"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                                </svg>
                                            )}
                                        </button>
                                    </td>
                                    <td className="text-start">Nex-zone Phase2</td>
                                    <td className="text-start"></td>
                                    <td className="text-start"></td>
                                    <td className="text-start"></td>
                                    <td className="text-start"></td>
                                    <td className="text-start"></td>
                                    <td className="text-start">
                                        <div className="d-flex justify-content-center">
                                            <input className="pe-2" type="checkbox" />
                                            <img
                                                data-bs-toggle="modal"
                                                data-bs-target="#addnewModal"
                                                className="pe-1"
                                                src="../Data_Mapping/img/Edit.svg"
                                                alt=""
                                            />
                                            <img
                                                className="pe-1"
                                                src="../Data_Mapping/img/Delete_red.svg"
                                                alt=""
                                            />
                                        </div>
                                    </td>
                                </tr>
                                {openSubProject && (
                                    <>
                                        {/* sub project1 */}
                                        <tr>
                                            <td>
                                                <button
                                                    className="btn btn-link p-0"
                                                    onClick={handleSubProject2}
                                                    aria-label="Toggle row visibility"
                                                >
                                                    {openSubProject2 ? (
                                                        // Show minus SVG if row is expanded
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="black"
                                                            className="bi bi-dash-circle"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z" />
                                                        </svg>
                                                    ) : (
                                                        // Show plus SVG if row is collapsed
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="black"
                                                            className="bi bi-plus-circle"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="text-start">Aster</td>
                                            <td className="text-start"></td>
                                            <td className="text-start"></td>
                                            <td className="text-start"></td>
                                            <td className="text-start"></td>
                                            <td className="text-start"></td>
                                            <td className="text-start">
                                                <div className="d-flex justify-content-center">
                                                    <input className="pe-2" type="checkbox" />
                                                    <img
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#addnewModal"
                                                        className="pe-1"
                                                        src="../Data_Mapping/img/Edit.svg"
                                                        alt=""
                                                    />
                                                    <img
                                                        className="pe-1"
                                                        src="../Data_Mapping/img/Delete_red.svg"
                                                        alt=""
                                                    />
                                                </div>
                                            </td>
                                        </tr>

                                        {openSubProject2 && (
                                            <>
                                                <tr>
                                                    <td>
                                                        <button
                                                            className="btn btn-link p-0"
                                                            onClick={handleSubProject2_1}
                                                            aria-label="Toggle row visibility"
                                                        >
                                                            {openSubProject2_1 ? (
                                                                // Show minus SVG if row is expanded
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="black"
                                                                    className="bi bi-dash-circle"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z" />
                                                                </svg>
                                                            ) : (
                                                                // Show plus SVG if row is collapsed
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="black"
                                                                    className="bi bi-plus-circle"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="text-start">Cedar</td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start"></td>
                                                    <td className="text-start">
                                                        <div className="d-flex justify-content-center">
                                                            <input className="pe-2" type="checkbox" />
                                                            <img
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#addnewModal"
                                                                className="pe-1"
                                                                src="../Data_Mapping/img/Edit.svg"
                                                                alt=""
                                                            />
                                                            <img
                                                                className="pe-1"
                                                                src="../Data_Mapping/img/Delete_red.svg"
                                                                alt=""
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>

                                                {openSubProject2_1 && (
                                                    <>
                                                        <tr>
                                                            <td>
                                                            </td>
                                                            <td className="text-start">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="black"
                                                                    className="bi bi-arrow-down"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                                                                    />
                                                                </svg>

                                                                Facade</td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start">
                                                                <div className="d-flex justify-content-center">
                                                                    <input className="pe-2" type="checkbox" />
                                                                    <img
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#addnewModal"
                                                                        className="pe-1"
                                                                        src="../Data_Mapping/img/Edit.svg"
                                                                        alt=""
                                                                    />
                                                                    <img
                                                                        className="pe-1"
                                                                        src="../Data_Mapping/img/Delete_red.svg"
                                                                        alt=""
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                            </td>
                                                            <td className="text-start">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    fill="black"
                                                                    className="bi bi-arrow-down"
                                                                    viewBox="0 0 16 16"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                                                                    />
                                                                </svg>

                                                                RCC</td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start">
                                                                <div className="d-flex justify-content-center">
                                                                    <input className="pe-2" type="checkbox" />
                                                                    <img
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#addnewModal"
                                                                        className="pe-1"
                                                                        src="../Data_Mapping/img/Edit.svg"
                                                                        alt=""
                                                                    />
                                                                    <img
                                                                        className="pe-1"
                                                                        src="../Data_Mapping/img/Delete_red.svg"
                                                                        alt=""
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                            </td>
                                                            <td className="text-start">
                                                                <button
                                                                    onClick={handleSubProject2_11}

                                                                >
                                                                    {openSubProject2_11 ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="black"
                                                                            className="bi bi-arrow-down"
                                                                            viewBox="0 0 16 16"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M8 15a.5.5 0 0 1-.5-.5V2.707l-3.146 3.147a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1-.708.708L8.5 2.707V14.5a.5.5 0 0 1-.5.5z"
                                                                            />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            fill="black"
                                                                            className="bi bi-arrow-up"
                                                                            viewBox="0 0 16 16"
                                                                        >


                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                                                                            />
                                                                        </svg>

                                                                    )}

                                                                </button>

                                                                Flat Finishing</td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start"></td>
                                                            <td className="text-start">
                                                                <div className="d-flex justify-content-center">
                                                                    <input className="pe-2" type="checkbox" />
                                                                    <img
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#addnewModal"
                                                                        className="pe-1"
                                                                        src="../Data_Mapping/img/Edit.svg"
                                                                        alt=""
                                                                    />
                                                                    <img
                                                                        className="pe-1"
                                                                        src="../Data_Mapping/img/Delete_red.svg"
                                                                        alt=""
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {openSubProject2_11 && (
                                                            <>
                                                                <tr>
                                                                    <td>
                                                                    </td>
                                                                    <td className="text-start">



                                                                        Plastor FF</td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start">
                                                                        <div className="d-flex justify-content-center">
                                                                            <input className="pe-2" type="checkbox" />
                                                                            <img
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#addnewModal"
                                                                                className="pe-1"
                                                                                src="../Data_Mapping/img/Edit.svg"
                                                                                alt=""
                                                                            />
                                                                            <img
                                                                                className="pe-1"
                                                                                src="../Data_Mapping/img/Delete_red.svg"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td>
                                                                    </td>
                                                                    <td className="text-start">
                                                                        <button
                                                                            onClick={handleSubProject2_12}
                                                                        >
                                                                            {openSubProject2_12 ? (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16"
                                                                                    height="16"
                                                                                    fill="black"
                                                                                    className="bi bi-arrow-down"
                                                                                    viewBox="0 0 16 16"
                                                                                >
                                                                                    <path
                                                                                        fillRule="evenodd"
                                                                                        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                                                                                    />
                                                                                </svg>
                                                                            ) : (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16"
                                                                                    height="16"
                                                                                    fill="black"
                                                                                    className="bi bi-arrow-up"
                                                                                    viewBox="0 0 16 16"
                                                                                >
                                                                                    <path
                                                                                        fillRule="evenodd"
                                                                                        d="M8 15a.5.5 0 0 1-.5-.5V2.707l-3.146 3.147a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1-.708.708L8.5 2.707V14.5a.5.5 0 0 1-.5.5z"
                                                                                    />
                                                                                </svg>

                                                                            )}

                                                                        </button>

                                                                        Painting FF</td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start">
                                                                        <div className="d-flex justify-content-center">
                                                                            <input className="pe-2" type="checkbox" />
                                                                            <img
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#addnewModal"
                                                                                className="pe-1"
                                                                                src="../Data_Mapping/img/Edit.svg"
                                                                                alt=""
                                                                            />
                                                                            <img
                                                                                className="pe-1"
                                                                                src="../Data_Mapping/img/Delete_red.svg"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>


                                                            </>
                                                        )}
                                                        {openSubProject2_12 && (
                                                            <>
                                                                <tr>
                                                                    <td>
                                                                        <input type="checkbox" name="" id="" />
                                                                    </td>
                                                                    <td className="text-start">
                                                                        <button
                                                                            onClick={handleSubProject2_13}
                                                                        >
                                                                            {openSubProject2_13 ? (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16"
                                                                                    height="16"
                                                                                    fill="black"
                                                                                    className="bi bi-arrow-down"
                                                                                    viewBox="0 0 16 16"
                                                                                >
                                                                                    <path
                                                                                        fillRule="evenodd"
                                                                                        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                                                                                    />
                                                                                </svg>
                                                                            ) : (
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    width="16"
                                                                                    height="16"
                                                                                    fill="black"
                                                                                    className="bi bi-arrow-up"
                                                                                    viewBox="0 0 16 16"
                                                                                >
                                                                                    <path
                                                                                        fillRule="evenodd"
                                                                                        d="M8 15a.5.5 0 0 1-.5-.5V2.707l-3.146 3.147a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1-.708.708L8.5 2.707V14.5a.5.5 0 0 1-.5.5z"
                                                                                    />
                                                                                </svg>

                                                                            )}

                                                                        </button>

                                                                        Flat 2&4</td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start"></td>
                                                                    <td className="text-start">
                                                                        <div className="d-flex justify-content-center">
                                                                            <input className="pe-2" type="checkbox" />
                                                                            <img
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#addnewModal"
                                                                                className="pe-1"
                                                                                src="../Data_Mapping/img/Edit.svg"
                                                                                alt=""
                                                                            />
                                                                            <img
                                                                                className="pe-1"
                                                                                src="../Data_Mapping/img/Delete_red.svg"
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {openSubProject2_13 && (
                                                                    <>
                                                                        <tr>
                                                                            <td>
                                                                                <input type="checkbox" name="" id="" />
                                                                            </td>
                                                                            <td className="text-start">
                                                                                <button
                                                                                // onClick={handleSubProject2_13}
                                                                                >
                                                                                    {openSubProject2_13 ? (
                                                                                     <svg
                                                                                     xmlns="http://www.w3.org/2000/svg"
                                                                                     width="16"
                                                                                     height="16"
                                                                                     fill="black"
                                                                                     className="bi bi-caret-up"
                                                                                     viewBox="0 0 16 16"
                                                                                   >
                                                                                     <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                                   </svg>
                                                                                    ) : (
                                                                                        <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        width="16"
                                                                                        height="16"
                                                                                        fill="black"
                                                                                        className="bi bi-caret-down"
                                                                                        viewBox="0 0 16 16"
                                                                                      >
                                                                                        <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                                      </svg>
                                                                                    )}

                                                                                </button>

                                                                                Internal Painting Work</td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start">
                                                                                <div className="d-flex justify-content-center">
                                                                                    <input className="pe-2" type="checkbox" />
                                                                                    <img
                                                                                        data-bs-toggle="modal"
                                                                                        data-bs-target="#addnewModal"
                                                                                        className="pe-1"
                                                                                        src="../Data_Mapping/img/Edit.svg"
                                                                                        alt=""
                                                                                    />
                                                                                    <img
                                                                                        className="pe-1"
                                                                                        src="../Data_Mapping/img/Delete_red.svg"
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>
                                                                                {/* <input type="checkbox" name="" id="" /> */}
                                                                            </td>
                                                                            <td className="text-start">
                                                                                <button
                                                                                    onClick={handleSubProjectDetails}
                                                                                >
                                                                                    {openSubProjectDetails ? (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="16"
                                                                                            height="16"
                                                                                            fill="black"
                                                                                            className="bi bi-caret-up"
                                                                                            viewBox="0 0 16 16"
                                                                                        >
                                                                                            <path d="M3.204 9h9.592L8 4.48 3.204 9z" />
                                                                                        </svg>
                                                                                    ) : (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            width="16"
                                                                                            height="16"
                                                                                            fill="black"
                                                                                            className="bi bi-caret-down"
                                                                                            viewBox="0 0 16 16"
                                                                                        >
                                                                                            <path d="M3.204 6h9.592L8 10.52 3.204 6z" />
                                                                                        </svg>

                                                                                    )}

                                                                                </button>

                                                                                Flat Internal Wall Ceiling</td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start"></td>
                                                                            <td className="text-start">
                                                                                <div className="d-flex justify-content-center">
                                                                                    <input className="pe-2" type="checkbox" />
                                                                                    <img
                                                                                        data-bs-toggle="modal"
                                                                                        data-bs-target="#addnewModal"
                                                                                        className="pe-1"
                                                                                        src="../Data_Mapping/img/Edit.svg"
                                                                                        alt=""
                                                                                    />
                                                                                    <img
                                                                                        className="pe-1"
                                                                                        src="../Data_Mapping/img/Delete_red.svg"
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr >
                                                                            <td colSpan={8}>

                                                                                {openSubProjectDetails && (
                                                                                    <div>
                                                                                        <CollapsibleCard title="Material Type">
                                                                                            <div
                                                                                                className="card-body mt-0 pt-0"
                                                                                            //   style={{ display: "none" }}
                                                                                            >
                                                                                                <div className="tbl-container mx-3 mt-1">
                                                                                                    <table className="w-100">
                                                                                                        <thead>
                                                                                                            <tr>
                                                                                                                <th rowSpan={2}>Material Type</th>
                                                                                                                <th rowSpan={2}>Material Sub-Type</th>
                                                                                                                <th rowSpan={2}>Material</th>
                                                                                                                <th rowSpan={2}>Generic Specification</th>
                                                                                                                <th rowSpan={2}>Colour </th>
                                                                                                                <th rowSpan={2}>Brand </th>
                                                                                                                <th rowSpan={2}>UOM</th>
                                                                                                                <th rowSpan={2}>Cost QTY</th>
                                                                                                                <th colSpan={3}>Cost</th>
                                                                                                                <th rowSpan={2}>Wastage</th>
                                                                                                                <th rowSpan={2}>
                                                                                                                    Total Estimated Qty Wastage
                                                                                                                </th>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <th>Co-Efficient Factor</th>
                                                                                                                <th colSpan={2}>Estimated Qty</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td>SAND</td>
                                                                                                                <td>SAND</td>
                                                                                                                <td>SAND River (BAG)</td>
                                                                                                                <td>SAND River (BAG)</td>
                                                                                                                <td>GOLD</td>
                                                                                                                <td />
                                                                                                                <td>Bags</td>
                                                                                                                <td />
                                                                                                                <td>2</td>
                                                                                                                <td>2</td>
                                                                                                                <td>4%</td>
                                                                                                                <td>2.08</td>
                                                                                                            </tr>


                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>

                                                                                        </CollapsibleCard>



                                                                                        <CollapsibleCard title="Labour Type">


                                                                                            <div
                                                                                                className="card-body mt-0 pt-0"
                                                                                            //   style={{ display: "none" }}
                                                                                            >
                                                                                                <div className="tbl-container mx-3 mt-1">
                                                                                                    <table className="w-100">
                                                                                                        <thead>
                                                                                                            <tr>
                                                                                                                <th rowSpan={2}>Labour Type</th>
                                                                                                                <th rowSpan={2}>Labour Sub-Type</th>
                                                                                                                <th rowSpan={2}>Labour</th>
                                                                                                                <th rowSpan={2}>UOM</th>
                                                                                                                <th colSpan={2}>Cost</th>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <th>Co-Efficient Factor</th>
                                                                                                                <th colSpan={2}>Estimated Qty</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td />
                                                                                                                <td />
                                                                                                                <td />
                                                                                                                <td />
                                                                                                                <td />
                                                                                                                <td />
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>

                                                                                        </CollapsibleCard>

                                                                                        <CollapsibleCard title="Assest Type">

                                                                                            <div
                                                                                                className="card-body mt-0 pt-0"
                                                                                            //   style={{ display: "none" }}
                                                                                            >
                                                                                                <div className="tbl-container mx-3 mt-1">
                                                                                                    <table className="w-100">
                                                                                                        <thead>
                                                                                                            <tr>
                                                                                                                <th rowSpan={2}>Assest Type</th>
                                                                                                                <th rowSpan={2}>Assest Sub-Type</th>
                                                                                                                <th rowSpan={2}>Assest</th>
                                                                                                                <th rowSpan={2}>UOM</th>
                                                                                                                <th colSpan={2}>Cost</th>
                                                                                                            </tr>
                                                                                                            <tr>
                                                                                                                <th>Co-Efficient Factor</th>
                                                                                                                <th colSpan={2}>Estimated Qty</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            <tr>
                                                                                                                <td />
                                                                                                                <td />
                                                                                                                <td />
                                                                                                                <td />
                                                                                                                <td />
                                                                                                                <td />
                                                                                                            </tr>
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>

                                                                                        </CollapsibleCard>

                                                                                    </div>
                                                                                )}

                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )}

                                                            </>
                                                        )}

                                                    </>
                                                )}
                                            </>
                                        )}

                                        <tr>
                                            <td>
                                                <button
                                                    className="btn btn-link p-0"
                                                    onClick={handleSubProject3}
                                                    aria-label="Toggle row visibility"
                                                >
                                                    {openSubProject3 ? (
                                                        // Show minus SVG if row is expanded
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="black"
                                                            className="bi bi-dash-circle"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z" />
                                                        </svg>
                                                    ) : (
                                                        // Show plus SVG if row is collapsed
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="black"
                                                            className="bi bi-plus-circle"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="text-start">Bodhi</td>
                                            <td className="text-start" />
                                            <td className="text-start" />
                                            <td className="text-start" />
                                            <td className="text-start" />
                                            <td className="text-start" />
                                            <td className="text-start">
                                                <div className="d-flex justify-content-center">
                                                    <input className="pe-2" type="checkbox" />
                                                    <img
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#addnewModal"
                                                        className="pe-1"
                                                        src="../Data_Mapping/img/Edit.svg"
                                                        alt=""
                                                    />
                                                    <img
                                                        className="pe-1"
                                                        src="../Data_Mapping/img/Delete_red.svg"
                                                        alt=""
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </>

                                )}

                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    );
};

export default BOQListTable;

