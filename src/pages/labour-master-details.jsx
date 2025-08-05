import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/mor.css";
import CollapsibleCard from "../components/base/Card/CollapsibleCards";
import SingleSelector from "../components/base/Select/SingleSelector";
import { Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../confi/apiDomain";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import { DownloadIcon } from "../components";



const LabourMasterDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    // const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    // const handleFileChange = (e) => setFile(e.target.files[0]);
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessages, setResultMessages] = useState([]);
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [labourSubTypeOptions, setLabourSubTypeOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [supervisorOptions, setSupervisorOptions] = useState([]);


    const [labour, setLabour] = useState(null);
    const [documents, setDocuments] = useState([]);

    const [formData, setFormData] = useState({
        labour_code: "",
        contractor_name: null,
        labour_sub_type: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        dob: "",
        phone_number: "",
        job_title: "",
        labour_category: "",
        work_shifts: "",
        availability: "",
        employment_status: "",
        bank_account_name: "",
        bank_account_no: "",
        bank_branch_name: "",
        ifsc_code: "",
        union_memberships: "",
        hourly_rate: "",
        overtime_rate: "",
        address: "",
        department: "",
        supervisor: "",
        hire_date: "",
        certifications: "",
        license_info: "",
        photo: null      // for file input
    });



    useEffect(() => {
        axios
            .get(
                `${baseURL}labours/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`
            )
            .then((response) => {
                console.log("responce:", response)
                setLabour(response?.data); // assuming response has a `labour` key
            })
            .catch((error) => {
                console.error("Error fetching labour details:", error);
            });
    }, [id]);


    console.log("labour:", labour)
    useEffect(() => {
        if (!labour) return;

        setFormData({
            labour_code: labour.labour_code || "",
            contractor_name: labour.vendor_id
                ? { value: labour.vendor_id, label: labour.vendor_name }
                : null,
            labour_sub_type: labour.labour_sub_type_id || "",
            first_name: labour.firstname || "",
            middle_name: labour.middlename || "",
            last_name: labour.lastname || "",
            dob: labour.date_of_birth || "",
            phone_number: labour.phone_no || "",
            job_title: labour.job_title || "",
            labour_category: labour.labour_category || "",
            work_shifts: labour.work_shift || "",
            availability: labour.availability || "",
            employment_status: labour.employment_status || "",
            bank_account_name: labour.bank_name || "",
            bank_account_no: labour.account_number || "",
            bank_branch_name: labour.branch_name || "",
            ifsc_code: labour.ifsc_code || "",
            union_memberships: labour.union_membership || "",
            hourly_rate: labour.hourly_rate || "",
            overtime_rate: labour.overtime_rate || "",
            address: labour.address || "",
            department: labour.department_id || "",
            supervisor: labour.supervisor_id || "",
            hire_date: labour.hire_date || "",
            certifications: labour.equipment_certification || "",
            license_info: labour.license_info || "",
            photo: labour.avatar?.document_name
                ? {
                    fileName: labour.avatar.document_name,
                    content_type: labour.avatar.content_type,
                }
                : null,
        });

        //    setDocuments(data?.documents || []);

        const apiDocuments = labour?.documents || [];

        const mergedDocuments = initialDocumentTypes.map((doc) => {
            const matchingDoc = apiDocuments.find(
                (d) => d.document_type === doc.name
            );

            return {
                document_type: doc.name,
                attachments: matchingDoc?.attachments || [],
                isDefault: true,
            };
        });

        setDocuments(mergedDocuments);

    }, [labour]);


    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const token = "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414";
                const response = await axios.get(
                    `${baseURL}labours/supplier_list.json?token=${token}`
                );
                const formattedOptions = response.data.suppliers.map((s) => ({
                    value: s.id,
                    label: s.full_name,
                }));
                setSupplierOptions(formattedOptions);
                const formattedSubTypes = response.data.labour_sub_types.map((t) => ({
                    value: t.id,
                    label: t.labour_sub_type,
                }));
                setLabourSubTypeOptions(formattedSubTypes); // ⬅️ new state
                const formattedDepartments = response.data.departments.map((d) => ({
                    value: d.id,
                    label: d.name,
                }));
                setDepartmentOptions(formattedDepartments);

                // Supervisors
                const formattedSupervisors = response.data.supervisors.map((s) => ({
                    value: s.id,
                    label: s.full_name,
                }));
                setSupervisorOptions(formattedSupervisors);
            } catch (error) {
                console.error("Failed to fetch suppliers:", error);
            }
        };

        fetchSuppliers();
    }, []);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // const handleFileChange = (e, fieldName) => {
    //   const file = e.target.files[0];
    //   if (file) {
    //     setFormData((prev) => ({
    //       ...prev,
    //       [fieldName]: file,
    //     }));
    //   }
    // };

    const handleFileChange2 = (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const contentType = file.type;
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Content = reader.result.split(",")[1]; // Remove data:<type>;base64, prefix

            setFormData((prev) => ({
                ...prev,
                [fieldName]: {
                    document_file_name: file.name,
                    fileName: file.name,
                    content_type: contentType,
                    content: base64Content,
                },
            }));
        };

        reader.readAsDataURL(file);
    };
    const handleSupplierChange = (selected) => {
        setFormData((prev) => ({
            ...prev,
            contractor_name: selected, // entire object: { value, label }
        }));
    };


    const labourCategoryOptions = [
        // { value: "Skilled", label: "Skilled" },
        // { value: "Unskilled", label: "Unskilled" },
        // { value: "Semi-skilled", label: "Semi-skilled" },
        // { value: "Supervisor", label: "Supervisor" },
        // { value: "Technician", label: "Technician" },
        // { value: "Engineer", label: "Engineer" },
        // { value: "Foreman", label: "Foreman" },
        // { value: "Operator", label: "Operator" },
        // { value: "Helper", label: "Helper" },
        // { value: "Electrician", label: "Electrician" },
        { value: "Skilled", label: "Skilled Labor" },
        { value: "Unskilled", label: "Unskilled Labor" },
        { value: "Managerial", label: "Managerial" },
    ];
    const availabilityOptions = [
        // { value: "available", label: "Available" },
        // { value: "not_available", label: "Not Available" },
        // { value: "on_leave", label: "On Leave" },
        // { value: "in_training", label: "In Training" },
        // { value: "on_duty", label: "On Duty" },
        { value: "Full-time", label: "Full-time" },
        { value: "Part-time", label: "Part-time" },
        { value: "On-call", label: "On-call" },
    ];
    const employmentStatusOptions = [
        { value: "Permanent", label: "Permanent" },
        { value: "Temporary", label: "Temporary" },
        { value: "Contract", label: "Contract" },
        // { value: "probation", label: "Probation" },
        // { value: "intern", label: "Intern" },
        // { value: "terminated", label: "Terminated" },

    ];

    const documentOptions = [
        { value: "aadhar", label: "Aadhar Card" },
        { value: "pan", label: "PAN Card" },
        // { value: "dl", label: "Driving License" },
        { value: "training_cert", label: "Training Certificate" },
    ];
    const jobTitleOptions = [
        { value: "Electrician", label: "Electrician" },
        { value: "Plumber", label: "Plumber" },
        { value: "Carpenter", label: "Carpenter" },
        { value: "Project Manager", label: "Project Manager" },
    ];

    // attachment like mor start******
    const [attachments, setAttachments] = useState([

    ]);

    const getLocalDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset(); // in minutes
        const localDate = new Date(now.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 19); // "YYYY-MM-DDTHH:MM"

    };

    const handleAddRow = () => {
        setAttachments((prev) => [
            ...prev,
            {
                id: Date.now(),
                fileType: "",
                fileName: "",
                uploadDate: getLocalDateTime(),
                fileUrl: "",
                file: null,
                isExisting: false,
                document: "", // add this
            },
        ]);
    };

    const handleRemove = (id) => {
        setAttachments((prev) => prev.filter((att) => att.id !== id));
    };

    const handleFileChange = (e, id) => {
        const file = e.target.files[0];
        if (!file) return;

        const contentType = file.type;

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Content = reader.result.split(",")[1]; // Remove data:<type>;base64, prefix

            setAttachments((prev) =>
                prev.map((att) =>
                    att.id === id
                        ? {
                            ...att,
                            file,
                            fileType: contentType,
                            fileName: file.name,
                            isExisting: false,
                            document_file_name: att.document_file_name || file.name,
                            uploadDate: getLocalDateTime(),
                            attachments: [
                                {
                                    filename: file.name,
                                    content: base64Content,
                                    content_type: contentType,
                                    document_file_name: att.document_file_name || file.name,
                                },
                            ],
                        }
                        : att
                )
            );
        };

        reader.readAsDataURL(file);
    };

    const handleFileNameChange = (id, newFileName) => {
        setAttachments((prev) =>
            prev.map((att) =>
                att.id === id
                    ? {
                        ...att,
                        fileName: newFileName,
                        attachments: att.attachments?.length
                            ? [
                                {
                                    ...att.attachments[0],
                                    filename: newFileName,
                                },
                            ]
                            : [],
                    }
                    : att
            )
        );
    };

    const handleDocumentChange = (id, selectedValue) => {
        setAttachments((prev) =>
            prev.map((att) =>
                att.id === id ? { ...att, document: selectedValue } : att
            )
        );
    };

    const attachmentsPayload = attachments
        .flatMap((att) => att.attachments || []);

    // console.log("attachments:", attachmentsPayload)

    // attachment like mor end******


    const [attachModal, setattachModal] = useState(false);
    const [viewDocumentModal, setviewDocumentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const openattachModal = () => setattachModal(true);
    const closeattachModal = () => setattachModal(false);
    const [newDocument, setNewDocument] = useState({
        document_type: "",
        attachments: [],
    });

    const initialDocumentTypes = [
        { id: 1, name: "Aadhar Card", count: 0 },
        {
            id: 2,
            name: "PAN Card",
            count: 0,
        },
        { id: 3, name: "Training Certificate", count: 0 },

        // { id: 4, name: "Lorry receipt", count: 0 },
        // { id: 5, name: "E Way bill", count: 0 },
        // { id: 6, name: "E Invoice", count: 0 },
        // { id: 7, name: "Warranty", count: 0 },
        // { id: 8, name: "MTC", count: 0 },
    ];


    // const [documents, setDocuments] = useState(
    //     initialDocumentTypes.map((doc) => ({
    //         document_type: doc.name,
    //         attachments: [],
    //         isDefault: true, // Add flag to identify default documents
    //     }))
    // );

    // Add this at the top of your component

    const handleAttachDocument = () => {
        if (newDocument.document_type && newDocument.attachments.length > 0) {
            setDocuments((prevDocs) => {
                // Check if document type already exists
                const existingDoc = prevDocs.find(
                    (doc) =>
                        doc.document_type.toLowerCase() ===
                        newDocument.document_type.toLowerCase()
                );

                if (existingDoc) {
                    // Update existing document
                    return prevDocs.map((doc) => {
                        if (
                            doc.document_type.toLowerCase() ===
                            newDocument.document_type.toLowerCase()
                        ) {
                            return {
                                ...doc,
                                attachments: [...doc.attachments, ...newDocument.attachments],
                            };
                        }
                        return doc;
                    });
                } else {
                    // Add new document type
                    return [
                        ...prevDocs,
                        {
                            document_type: newDocument.document_type,
                            attachments: [...newDocument.attachments],
                            isDefault: false,
                        },
                    ];
                }
            });

            setNewDocument({
                document_type: "",
                attachments: [],
            });
            closeattachModal();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            setNewDocument((prev) => ({
                ...prev,
                attachments: [
                    {
                        filename: file.name,
                        content_type: file.type,
                        content: event.target.result,
                    },
                ],
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleDocumentCountClick = (documentType) => {
        const doc = documents.find((d) => d.document_type === documentType);
        if (doc) {
            setSelectedDocument(doc);
            setviewDocumentModal(true);
        }
    };


    const allDocuments = initialDocumentTypes.map((docType) => {
        // Find corresponding document from documents state
        const existingDoc = documents.find(
            (doc) => doc.document_type === docType.name
        );

        return {
            document_type: docType.name,
            id: null,
            attachments:
                existingDoc?.attachments?.map((attachment) => ({
                    filename: attachment.filename,
                    content_type: attachment.content_type,
                    content: attachment.content,
                })) || [], // If no attachments, pass empty array
        };
    });

    const payload = {
        labour: {
            labour_code: formData.labour_code,
            // supplier:formData.contractor_name.value,
            vendor_id: formData?.contractor_name?.value, // You can replace it if needed
            labour_sub_type_id: 25,
            firstname: formData.first_name,
            lastname: formData.last_name,
            middlename: formData.middle_name,
            date_of_birth: formData.dob,
            phone_no: formData.phone_number,
            job_title: formData.job_title,
            labour_category: formData.labour_category,
            work_shift: formData.work_shifts,
            availability: formData.availability,
            employment_status: formData.employment_status,
            union_membership: formData.union_memberships,
            hourly_rate: formData.hourly_rate,
            overtime_rate: formData.overtime_rate,
            address: formData.address,
            department_id: 45,
            supervisor_id: 22,
            hire_date: formData.hire_date,
            equipment_certification: formData.certifications,
            license_info: formData.license_info,

            bank_detail_attributes: {
                bank_name: formData.bank_account_name,
                account_number: formData.bank_account_no,
                confirm_account_number: formData.bank_account_no,
                branch_name: formData.bank_branch_name,
                ifsc_code: formData.ifsc_code,
            },

            documents: allDocuments,

            avatar: formData.photo || {},
        },
    }

    //   console.log("photo data:",formData.photo)
    console.log("payload create:", payload)

    const handleSubmit = async () => {

        const payload = {
            labour: {
                labour_code: formData.labour_code,
                vendor_id: formData.contractor_name.value, // You can replace it if needed
                // supplier:formData.contractor_name,
                labour_sub_type_id: 25,
                firstname: formData.first_name,
                lastname: formData.last_name,
                middlename: formData.middle_name,
                date_of_birth: formData.dob,
                phone_no: formData.phone_number,
                job_title: formData.job_title,
                labour_category: formData.labour_category,
                work_shift: formData.work_shifts,
                availability: formData.availability,
                employment_status: formData.employment_status,
                union_membership: formData.union_memberships,
                hourly_rate: formData.hourly_rate,
                overtime_rate: formData.overtime_rate,
                address: formData.address,
                department_id: 45,
                supervisor_id: 22,
                hire_date: formData.hire_date,
                equipment_certification: formData.certifications,
                license_info: formData.license_info,

                bank_detail_attributes: {
                    bank_name: formData.bank_account_name,
                    account_number: formData.bank_account_no,
                    confirm_account_number: formData.bank_account_no,
                    branch_name: formData.bank_branch_name,
                    ifsc_code: formData.ifsc_code,
                },

                documents: allDocuments,

                avatar: formData.photo || {},
            },
        }

        console.log("payload submit:", payload)
        try {
            const response = await axios.post(
                `${baseURL}labours.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
                payload,
            );

            console.log('Success:', response.data);
            alert("created .....")
            // Optionally redirect
            //   navigate(`/credit-note-list?token=${token}`);
        } catch (error) {
            console.error('Error submitting data:', error);
            // Optionally show error message to user
        }
    };








    // console.log("Token value inside render:", token);
    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4 pb-5">
                    <a href="">
                        <a href="#">Setup &gt; Purchase Setup &gt; Labour Master</a>
                    </a>
                    <h5 class="mt-4">Labour Master Details</h5>


                    {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}
                    <div className="card p-3">
                        <div className="details_page">
                            <div className="row px-3 ">
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Labour Code</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.labour_code || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Contractor Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.vendor_name || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Labour Sub Type</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.labour_sub_type || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>First Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.firstname || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Last Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.lastname || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Middle Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.middlename || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Date of Birth</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>

                                            {labour?.date_of_birth
                                                ? new Date(labour.date_of_birth)
                                                    .toLocaleDateString("en-GB")
                                                    .split("/")
                                                    .join("-")
                                                : "-"}
                                        </label>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Phone Number</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.phone_no || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Job Title/Position</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.job_title || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Labour Category</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.labour_category || "-"}
                                        </label>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Work Shifts</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.work_shift || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Availability </label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.availability || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Employment Status</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.employment_status || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Union Memberships</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.union_membership || "-"}
                                        </label>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Hourly Rate/Salary</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.hourly_rate || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Overtime Rate</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.overtime_rate || "-"}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Address</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.address || "-"}
                                        </label>
                                    </div>
                                </div>


                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Supervisor</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.supervisor || "-"}
                                        </label>
                                    </div>
                                </div>



                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Department</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.department || "-"}
                                        </label>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Hire Date</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>

                                            {labour?.hire_date
                                                ? new Date(labour.hire_date)
                                                    .toLocaleDateString("en-GB")
                                                    .split("/")
                                                    .join("-")
                                                : "-"}
                                        </label>
                                    </div>
                                </div>



                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Equipment Certifications </label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.equipment_certification || "-"}
                                        </label>
                                    </div>
                                </div>



                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Photo </label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {/* {labour?.department || "-"} */}

                                            {labour?.avatar?.blob_id ? (
                                                <>
                                                    {/* <a
                                                        href={`${baseURL}labours/${id}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${labour.avatar.blob_id}`}
                                                        rel="noopener noreferrer"
                                                        target="_blank"
                                                        className="me-2"
                                                    >
                                                        <DownloadIcon />

                                                    </a>
                                                    {labour.avatar.document_name} */}

                                                    <a
                                                        href={
                                                            // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                                            // `${baseURL}bill_entries/${id}/download?token=${token}&blob_id=${attachment.blob_id}`
                                                            labour?.avatar?.url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download={labour?.avatar?.document_name}
                                                        className="me-2"
                                                    >
                                                        <DownloadIcon />

                                                    </a>
                                                    {labour.avatar.document_name}
                                                    {/* {console.log("url:", labour?.avatar?.url)} */}
                                                </>
                                            ) : (
                                                "-"
                                            )}
                                        </label>
                                    </div>
                                </div>



                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>License/Permit Information </label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.license_info || "-"}
                                        </label>
                                    </div>
                                </div>


                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Bank Account Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.bank_name || "-"}
                                        </label>
                                    </div>
                                </div>


                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Bank Account No</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.account_number || "-"}
                                        </label>
                                    </div>
                                </div>


                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Bank Branch Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.branch_name || "-"}
                                        </label>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                                    <div className="col-6 ">
                                        <label>Bank Branch IFSC Code</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:</span>
                                            {labour?.ifsc_code || "-"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="d-flex justify-content-between mt-5 p-0">
                        <h5 className=" ">Document Attachments</h5>
                        <div className="card-tools d-flex">
                            <div>
                                {/* <button
                                            className="purple-btn2 me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#RevisionModal"
                                            onClick={openattachModal}
                                        >
                                            + Attach Document
                                        </button> */}
                            </div>
                        </div>
                    </div>
                    <div
                        className="tbl-container mt-3 p-0"
                        style={{ maxHeight: "400px" }}
                    >
                        <table className="w-100">
                            <thead>
                                <tr>
                                    <th className="text-start">Sr. No.</th>
                                    <th className="text-start">Document Name</th>
                                    <th className="text-start">No. of Documents</th>
                                    {/* <th className="text-start">Attach Additional Copy</th> */}
                                </tr>
                            </thead>
                            {/* // Replace your existing table body with this */}
                            <tbody>
                                {documents.map((doc, index) => (
                                    <tr key={index}>
                                        <td className="text-start">{index + 1}</td>
                                        <td className="text-start">{doc.document_type}</td>
                                        <td
                                            className="text-start"
                                            style={{
                                                color: "#8b0203",
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                handleDocumentCountClick(doc.document_type)
                                            }
                                        >
                                            {doc.attachments.length}
                                        </td>
                                        {/* <td className="text-start">
                                            <button
                                                className="text-decoration-underline border-0 bg-transparent"
                                                style={{
                                                    color: "#8b0203",
                                                    textDecoration: "underline",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    setNewDocument((prev) => ({
                                                        ...prev,
                                                        document_type: doc.document_type,
                                                    }));
                                                    openattachModal();
                                                }}
                                            >
                                                + Attach
                                            </button>
                                        </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>







                    <div className="row mt-4 justify-content-center w-100">
                        {/* <div className="col-md-2 mt-2">
                            <button className="purple-btn2 w-100"
                                onClick={handleSubmit}
                            >Submit</button>
                        </div> */}
                        <div className="col-md-2">
                            <button className="purple-btn1 w-100"
                                onClick={() => navigate(`/labour-master-list`)}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* {loading && (
                <div className="loader-container">
                    <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p>Loading...</p>
                </div>
            )} */}


            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />


            <Modal
                centered
                size="lg"
                show={viewDocumentModal}
                onHide={() => {
                    setviewDocumentModal(false);
                    setSelectedDocument(null);
                }}
                backdrop="true"
                keyboard={true}
                className="modal-centered-custom"
            >
                <Modal.Header closeButton>
                    <h5>Document Attachment</h5>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="d-flex justify-content-between mt-3 me-2">
                            <h5>Latest Documents</h5>
                            <div className="card-tools d-flex">
                                {/* <button
                                    className="purple-btn2 rounded-3"
                                    onClick={() => {
                                        setviewDocumentModal(false);
                                        setNewDocument((prev) => ({
                                            ...prev,
                                            document_type: selectedDocument?.document_type,
                                        }));
                                        openattachModal();
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={20}
                                        fill="currentColor"
                                        className="bi bi-plus"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                    </svg>
                                    <span>Attach</span>
                                </button> */}
                            </div>
                        </div>
                        <div className="tbl-container px-0">
                            <table className="w-100">
                                <thead>
                                    <tr>
                                        <th>Sr.No.</th>
                                        <th>Document Name</th>
                                        <th>Attachment Name</th>
                                        <th>Upload Date</th>
                                        <th>Uploaded By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedDocument?.attachments.map((attachment, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{selectedDocument.document_type}</td>
                                            <td>{attachment.document_name}</td>
                                            <td>{
                                                (() => {
                                                    const date = new Date();
                                                    const day = date.getDate().toString().padStart(2, "0");
                                                    const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                                    const year = date.getFullYear();
                                                    return `${day}-${month}-${year}`;
                                                })()
                                            }</td>
                                            <td>{attachment.created_by}</td>
                                            <td>
                                                {/* <a
                                                    href={
                                                        // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                                        `${baseURL}labours/${id}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`

                                                    }
                                                    //   target="_blank"
                                                    rel="noopener noreferrer"
                                                //   download={attachment.filename}
                                                > <DownloadIcon />
                                                </a> */}

                                                <a
                                                    href={
                                                        // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                                        // `${baseURL}bill_entries/${id}/download?token=${token}&blob_id=${attachment.blob_id}`
                                                        attachment.url
                                                    }
                                                    target="_blank"
                                                    // rel="noopener noreferrer"
                                                    download={attachment.filename}
                                                >
                                                    <DownloadIcon />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 me-2">
                            <h5>Document Attachment History</h5>
                        </div>
                        <div className="tbl-container px-0">
                            <table className="w-100">
                                <thead>
                                    <tr>
                                        <th>Sr.No.</th>
                                        <th>Document Name</th>
                                        <th>Attachment Name</th>
                                        <th>Upload Date</th>
                                        <th>Uploaded By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedDocument?.attachments.map((attachment, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{selectedDocument.document_type}</td>
                                            <td>{attachment.document_name}</td>
                                            {/* <td>{new Date().toLocaleDateString()}</td> */}
                                            <td>{
                                                (() => {
                                                    const date = new Date();
                                                    const day = date.getDate().toString().padStart(2, "0");
                                                    const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                                    const year = date.getFullYear();
                                                    return `${day}-${month}-${year}`;
                                                })()
                                            }</td>
                                            <td>{attachment.created_by}</td>
                                            <td>
                                                {/* <a
                                                    href={
                                                        // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                                        `${baseURL}labours/${id}/download?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414&blob_id=${attachment.blob_id}`

                                                    }
                                                    //   target="_blank"
                                                    rel="noopener noreferrer"
                                                //   download={attachment.filename}
                                                > <DownloadIcon />
                                                </a> */}


                                                <a
                                                    href={
                                                        // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                                        // `${baseURL}bill_entries/${id}/download?token=${token}&blob_id=${attachment.blob_id}`
                                                        attachment.url
                                                    }
                                                    target="_blank"
                                                    // rel="noopener noreferrer"
                                                    download={attachment.filename}
                                                >
                                                    <DownloadIcon />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row mt-2 justify-content-center">
                        <div className="col-md-3">
                            <button
                                className="purple-btn1 w-100"
                                onClick={() => {
                                    setviewDocumentModal(false);
                                    setSelectedDocument(null);
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>


            <Modal
                centered
                size="l"
                show={attachModal}
                onHide={closeattachModal}
                backdrop="true"
                keyboard={true}
                className="modal-centered-custom"
            >
                <Modal.Header closeButton>
                    <h5>Attach Document</h5>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>Name of the Document</label>
                                {newDocument.document_type &&
                                    documents.find(
                                        (doc) =>
                                            doc.isDefault &&
                                            doc.document_type === newDocument.document_type
                                    ) ? (
                                    // For default document types - show as disabled input
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newDocument.document_type}
                                        disabled
                                    />
                                ) : (
                                    // For new document types - allow input
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newDocument.document_type}
                                        onChange={(e) =>
                                            setNewDocument((prev) => ({
                                                ...prev,
                                                document_type: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter document name"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="col-md-12 mt-2">
                            <div className="form-group">
                                <label>Upload File</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                            </div>
                        </div>
                        {/* Add this new section for file name editing */}
                        {newDocument.attachments.length > 0 && (
                            <div className="col-md-12 mt-2">
                                <div className="form-group">
                                    <label>File Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newDocument.attachments[0].filename}
                                        onChange={(e) => {
                                            setNewDocument((prev) => ({
                                                ...prev,
                                                attachments: [
                                                    {
                                                        ...prev.attachments[0],
                                                        filename: e.target.value,
                                                    },
                                                ],
                                            }));
                                        }}
                                        placeholder="Enter file name"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="row mt-2 justify-content-center">
                        <div className="col-md-4 mt-2">
                            <button
                                className="purple-btn2 w-100"
                                onClick={handleAttachDocument}
                                disabled={
                                    !newDocument.document_type ||
                                    newDocument.attachments.length === 0
                                }
                            >
                                Attach
                            </button>
                        </div>
                        <div className="col-md-4">
                            <button className="purple-btn1 w-100" onClick={closeattachModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default LabourMasterDetails;