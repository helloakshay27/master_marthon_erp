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



const LabourMasterEdit = () => {
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
    const [deletedDocumentIds, setDeletedDocumentIds] = useState([]);


    const [labour, setLabour] = useState(null);
    const [documents, setDocuments] = useState([]);

    const [formData, setFormData] = useState({
        id: null,
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
        bank_detail_id: null,
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
            id: labour.id || null,
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
            bank_detail_id: labour.bank_detail_id,
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


    // const allDocuments = initialDocumentTypes.map((docType) => {
    //     // Find corresponding document from documents state
    //     const existingDoc = documents.find(
    //         (doc) => doc.document_type === docType.name
    //     );

    //     return {
    //         document_type: docType.name,
    //         id: null,
    //         attachments:
    //             existingDoc?.attachments?.map((attachment) => ({
    //                 filename: attachment.filename,
    //                 content_type: attachment.content_type,
    //                 content: attachment.content,
    //             })) || [], // If no attachments, pass empty array
    //     };
    // });


    const allDocuments = initialDocumentTypes.map((docType) => {
        // Match the current document type with what's in state
        const existingDoc = documents.find(
            (doc) => doc.document_type === docType.name
        );

        // Check if it’s a newly added document (i.e., has valid attachment content)
        const hasNewAttachments = existingDoc?.attachments?.some(
            (att) => att?.content && att?.filename && att?.content_type
        );

        return {
            document_type: docType.name,
            attachments: hasNewAttachments
                ? existingDoc.attachments.map((att) => ({
                    filename: att.filename,
                    content_type: att.content_type,
                    content: att.content,
                }))
                : [], // Empty array if no valid new attachments
        };
    });

    const handleDeleteDocument = (attachmentId) => {
        // Add the id to deletedDocumentIds
        setDeletedDocumentIds((prev) => [...prev, attachmentId]);

        // Remove from selectedDocument.attachments
        setSelectedDocument((prev) => {
            if (!prev) return prev;
            const updatedAttachments = prev.attachments.filter(
                (attachment) => attachment.id !== attachmentId
            );
            return {
                ...prev,
                attachments: updatedAttachments,
            };
        });

        // Remove from main documents state
        setDocuments((prevDocs) =>
            prevDocs.map((doc) => {
                if (doc.document_type === selectedDocument.document_type) {
                    return {
                        ...doc,
                        attachments: doc.attachments.filter(
                            (attachment) => attachment.id !== attachmentId
                        ),
                    };
                }
                return doc;
            })
        );
    };

    const payload = {
        labour: {
            id: formData.id, // Include labour ID for update
            labour_code: formData.labour_code,
            vendor_id: formData?.contractor_name?.value || "",
            labour_sub_type_id: formData.labour_sub_type,
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
            department_id: formData.department,
            supervisor_id: formData.supervisor,
            hire_date: formData.hire_date,
            equipment_certification: formData.certifications,
            license_info: formData.license_info,

            bank_detail_attributes: {
                id: formData.bank_detail_id, // Make sure this exists for update
                bank_name: formData.bank_account_name,
                account_number: formData.bank_account_no,
                confirm_account_number: formData.bank_account_no,
                branch_name: formData.bank_branch_name,
                ifsc_code: formData.ifsc_code,
            },

            documents: allDocuments, // Expected to be in the correct format

            avatar: labour?.avatar?.document_name
                ? {} // Already present, so don't update
                : formData.photo || {}, // Include only if new photo is added,

            deleted_documents: deletedDocumentIds || [], // Pass IDs of deleted documents if any
        },
    };

    //   console.log("photo data:",formData.photo)
    console.log("payload create:", payload)
     const [formErrors, setFormErrors] = useState({});

    const handleSubmit = async () => {

           const errors = {};
        // Validation checks
        if (!formData.contractor_name || !formData.contractor_name.value) {
            errors.contractor_name = "Contractor is required.";
        }
        // Labour Sub Type
        if (!formData.labour_sub_type) {
            errors.labour_sub_type = "Labour sub type is required";
        }
        if (!formData.first_name?.trim()) {
            errors.first_name = "First name is required.";
        }
        if (!formData.middle_name?.trim()) {
            errors.middle_name = "Middle name is required.";
        }
        if (!formData.last_name?.trim()) {
            errors.last_name = "Last name is required.";
        }
        // if (!formData.phone_number?.trim()) {
        //     errors.phone_number = "Phone number is required.";
        // }

        if (!formData.phone_number?.trim()) {
            errors.phone_number = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phone_number.trim())) {
            errors.phone_number = "Phone number must be exactly 10 digits.";
        }

        // Bank details
        if (!formData.bank_account_name?.trim()) {
            errors.bank_account_name = "Bank account name is required.";
        }
        if (!formData.bank_account_no?.trim()) {
            errors.bank_account_no = "Account number is required.";
        }
        if (!formData.bank_branch_name?.trim()) {
            errors.bank_branch_name = "Branch name is required.";
        }
        if (!formData.ifsc_code?.trim()) {
            errors.ifsc_code = "IFSC code is required.";
        }

        // If there are errors, stop and display them
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors); // You need to define this state: const [formErrors, setFormErrors] = useState({});
            return;
        }

        const payload = {
            labour: {
                id: formData.id, // Include labour ID for update
                labour_code: formData.labour_code,
                vendor_id: formData?.contractor_name?.value || "",
                labour_sub_type_id: formData.labour_sub_type,
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
                department_id: formData.department,
                supervisor_id: formData.supervisor,
                hire_date: formData.hire_date,
                equipment_certification: formData.certifications,
                license_info: formData.license_info,

                bank_detail_attributes: {
                    id: formData.bank_detail_id, // Make sure this exists for update
                    bank_name: formData.bank_account_name,
                    account_number: formData.bank_account_no,
                    confirm_account_number: formData.bank_account_no,
                    branch_name: formData.bank_branch_name,
                    ifsc_code: formData.ifsc_code,
                },

                documents: allDocuments, // Expected to be in the correct format

                avatar: labour?.avatar?.document_name
                    ? {} // Already present, so don't update
                    : formData.photo || {}, // Include only if new photo is added,

                deleted_documents: deletedDocumentIds || [], // Pass IDs of deleted documents if any
            },
        };

        console.log("payload submit:", payload)
        try {
            const response = await axios.patch(
                `${baseURL}labours/${id}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`,
                payload,
            );

            console.log('Success:', response.data);
            alert("updated .....")
            // Optionally redirect
            navigate(`/labour-master-list`);
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
                    <h5 class="mt-4">Labour Master Edit</h5>


                    {/* <pre>{JSON.stringify(formData, null, 2)}</pre> */}

                    <CollapsibleCard title="Labour Details" showCollapseButton={false}>

                        <div className="row card-body mt-0 pt-0">
                            <div className="col-md-4 mb-3">
                                <label>Labour Code </label>
                                <input type="text" name="labour_code" value={formData.labour_code} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Contractor Name <span>*</span></label>
                                {/* <input type="text" name="contractor_name" value={formData.contractor_name} onChange={handleInputChange} className="form-control" /> */}

                                <SingleSelector
                                    options={supplierOptions}
                                    value={formData.contractor_name}
                                    onChange={handleSupplierChange}
                                    placeholder="Select Contractor"
                                />
                                 {formErrors.contractor_name && (
                                    <span className="text-danger">{formErrors.contractor_name}</span>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Labour Sub Type <span>*</span></label>
                                {/* <input type="text" name="labour_sub_type" value={formData.labour_sub_type} onChange={handleInputChange} className="form-control" /> */}
                                <SingleSelector
                                    options={labourSubTypeOptions}
                                    value={
                                        labourSubTypeOptions.find(
                                            (option) => option.value === formData.labour_sub_type
                                        ) || null
                                    }
                                    onChange={(selectedOption) =>
                                        handleInputChange({
                                            target: {
                                                name: "labour_sub_type",
                                                value: selectedOption?.value || "",
                                            },
                                        })
                                    }
                                    placeholder="Select Sub Type"
                                />
                                 {formErrors.labour_sub_type && (
                                    <span className="text-danger">{formErrors.labour_sub_type}</span>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>First Name <span>*</span></label>
                                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="form-control" />
                                 {formErrors.first_name && (
                                    <span className="text-danger">{formErrors.first_name}</span>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Last Name <span>*</span></label>
                                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="form-control" />
                                  {formErrors.last_name && (
                                    <span className="text-danger">{formErrors.last_name}</span>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Middle Name <span>*</span></label>
                                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleInputChange} className="form-control" />
                                 {formErrors.middle_name && (
                                    <span className="text-danger">{formErrors.middle_name}</span>
                                )}
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Phone Number</label>
                                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="form-control" />
                                 {formErrors.phone_number && (
                                    <span className="text-danger">{formErrors.phone_number}</span>
                                )}
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Job Title/Position </label>
                                {/* <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} className="form-control" /> */}

                                <SingleSelector
                                    options={jobTitleOptions}
                                    value={jobTitleOptions.find((opt) => opt.value === formData.job_title) || null}
                                    onChange={(selectedOption) =>
                                        handleInputChange({
                                            target: {
                                                name: "job_title",
                                                value: selectedOption?.value || "",
                                            },
                                        })
                                    }
                                    placeholder="Select Job Title"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Labour Category</label>
                                <SingleSelector
                                    options={labourCategoryOptions}
                                    value={labourCategoryOptions.find(option => option.value === formData.labour_category) || null}
                                    onChange={(selectedOption) =>
                                        handleInputChange({
                                            target: { name: "labour_category", value: selectedOption?.value || "" },
                                        })
                                    }
                                    placeholder="Select Labour Category"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Work Shifts </label>
                                <input type="number" name="work_shifts" value={formData.work_shifts} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Availability </label>
                                <SingleSelector
                                    options={availabilityOptions}
                                    value={
                                        availabilityOptions.find(
                                            (option) => option.value === formData.availability
                                        ) || null
                                    }
                                    onChange={(selectedOption) =>
                                        handleInputChange({
                                            target: { name: "availability", value: selectedOption?.value || "" },
                                        })
                                    }
                                    placeholder="Select Availability"
                                />

                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Employment Status</label>
                                <SingleSelector
                                    options={employmentStatusOptions}
                                    value={
                                        employmentStatusOptions.find(
                                            (option) => option.value === formData.employment_status
                                        ) || null
                                    }
                                    onChange={(selectedOption) =>
                                        handleInputChange({
                                            target: {
                                                name: "employment_status",
                                                value: selectedOption?.value || "",
                                            },
                                        })
                                    }
                                    placeholder="Select Employment Status"
                                />

                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Union Memberships </label>
                                <input type="text" name="union_memberships" value={formData.union_memberships} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Hourly Rate/Salary </label>
                                <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Overtime Rate </label>
                                <input type="number" name="overtime_rate" value={formData.overtime_rate} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Address </label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Department</label>
                                <SingleSelector
                                    options={departmentOptions}
                                    value={
                                        departmentOptions.find(
                                            (option) => option.value === formData.department
                                        ) || null
                                    }
                                    onChange={(selectedOption) =>
                                        handleInputChange({
                                            target: {
                                                name: "department",
                                                value: selectedOption?.value || "",
                                            },
                                        })
                                    }
                                    placeholder="Select Department"
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Supervisor </label>

                                <SingleSelector
                                    options={supervisorOptions}
                                    value={
                                        supervisorOptions.find(
                                            (option) => option.value === formData.supervisor
                                        ) || null
                                    }
                                    onChange={(selectedOption) =>
                                        handleInputChange({
                                            target: {
                                                name: "supervisor",
                                                value: selectedOption?.value || "",
                                            },
                                        })
                                    }
                                    placeholder="Select Supervisor"
                                />

                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Hire Date</label>
                                <input type="date" name="hire_date" value={formData.hire_date} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Equipment Certifications </label>
                                <input type="text" name="certifications" value={formData.certifications} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Photo </label>
                                {labour?.avatar?.blob_id ? (
                                    <>

                                        <a
                                            href={
                                                // {`${baseURL}rfq/events/${eventId}/download?token=${token}&blob_id=${attachment.blob_id}`}
                                                // `${baseURL}bill_entries/${id}/download?token=${token}&blob_id=${attachment.blob_id}`
                                                labour?.avatar?.url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download={labour?.avatar?.document_name}
                                            className="me-2 ms-2"
                                        >
                                            <DownloadIcon />

                                        </a>
                                        {labour.avatar.document_name}
                                        {/* {console.log("url:", labour?.avatar?.url)} */}
                                    </>
                                ) : (
                                    "-"
                                )}
                                <input type="file" name="photo" onChange={(e) => handleFileChange2(e, "photo")} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>License/Permit Information</label>
                                <input type="text" name="license_info" value={formData.license_info} onChange={handleInputChange} className="form-control" />
                            </div>

                            {/* <div className="d-flex justify-content-between mt-5 p-0 ">
                                <h5 className=" ">Document Attachment</h5>
                                <div
                                    className="card-tools d-flex"
                                    data-bs-toggle="modal"
                                    data-bs-target="#attachModal"
                                    // onClick={openattachModal}
                                    onClick={handleAddRow}
                                >
                                    <button
                                        className="purple-btn2 mb-2 "
                                        data-bs-toggle="modal"
                                        data-bs-target="#attachModal"
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
                                        <span>Add Attachments</span>
                                    </button>
                                </div>
                            </div> */}

                            {/* <div className="tbl-container mb-4 mt-2 p-0" style={{ maxHeight: "500px" }}>
                                <table className="w-100">
                                    <thead>
                                        <tr>
                                            <th className="main2-th">File Type</th>
                                            <th>Document</th>
                                            <th className="main2-th">File Name </th>
                                            <th className="main2-th">Upload At</th>
                                            <th className="main2-th">Upload File</th>
                                            <th className="main2-th" style={{ width: 100 }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attachments.map((att, index) => (
                                            <tr key={att.id}>
                                                <td>
                                                    <input
                                                        className="form-control document_content_type"
                                                        readOnly
                                                        disabled
                                                        value={att.fileType}
                                                        placeholder="File Type"
                                                    />
                                                </td>
                                                <td >
                                                    <SingleSelector
                                                        options={documentOptions}
                                                        value={documentOptions.find((opt) => opt.value === att.document) || null}
                                                        onChange={(selected) => handleDocumentChange(att.id, selected?.value || "")}
                                                        placeholder="Select Document"
                                                    />
                                                </td>
                                                <td style={{ minWidth: "400px" }}>
                                                    <input
                                                        className="form-control file_name"
                                                        required
                                                        value={att.fileName}
                                                        onChange={(e) => handleFileNameChange(att.id, e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className="form-control created_at"
                                                        readOnly
                                                        disabled
                                                        type="datetime-local"
                                                        step="1"
                                                        value={att.uploadDate || ""}
                                                    />
                                                </td>
                                                <td style={{ minWidth: "300px" }}>
                                                    {!att.isExisting && (
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            required
                                                            onChange={(e) => handleFileChange(e, att.id)}
                                                        />
                                                    )}
                                                </td>
                                                <td className="document">
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <div className="attachment-placeholder">
                                                            {att.isExisting && (
                                                                <div className="file-box">
                                                                    <div className="image">
                                                                        <a href={att.fileUrl} target="_blank" rel="noreferrer">
                                                                            <img
                                                                                alt="preview"
                                                                                className="img-responsive"
                                                                                height={50}
                                                                                width={50}
                                                                                src={att.fileUrl}
                                                                            />
                                                                        </a>
                                                                    </div>
                                                                    <div className="file-name">
                                                                        <a href={att.fileUrl} download>
                                                                            <span className="material-symbols-outlined">file_download</span>
                                                                        </a>
                                                                        <span>{att.fileName}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-link text-danger"
                                                            onClick={() => handleRemove(att.id)}
                                                        >
                                                            <span className="material-symbols-outlined">cancel</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>


                            </div> */}




                            <div className="d-flex justify-content-between mt-5 p-0">
                                <h5 className=" ">Document Attachments</h5>
                                <div className="card-tools d-flex">
                                    <div>
                                        <button
                                            className="purple-btn2 me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#RevisionModal"
                                            onClick={openattachModal}
                                        >
                                            + Attach Document
                                        </button>
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
                                            <th className="text-start">Attach Additional Copy</th>
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
                                                <td className="text-start">
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
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>



                    </CollapsibleCard>

                    <div className="mt-5">
                        <CollapsibleCard title="Bank Details" showCollapseButton={false}>

                            <div className="row card-body mt-0 pt-0">


                                <div className="col-md-4 mb-3">
                                    <label>Bank Account Name <span>*</span></label>
                                    <input type="text" name="bank_account_name" value={formData.bank_account_name} onChange={handleInputChange} className="form-control" />
                                     {formErrors.bank_account_name && (
                                        <span className="text-danger">{formErrors.bank_account_name}</span>
                                    )}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Bank Account No <span>*</span></label>
                                    <input type="text" name="bank_account_no" value={formData.bank_account_no} onChange={handleInputChange} className="form-control" />
                                     {formErrors.bank_account_no && (
                                        <span className="text-danger">{formErrors.bank_account_no}</span>
                                    )}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Bank Branch Name <span>*</span></label>
                                    <input type="text" name="bank_branch_name" value={formData.bank_branch_name} onChange={handleInputChange} className="form-control" />
                                      {formErrors.bank_branch_name && (
                                        <span className="text-danger">{formErrors.bank_branch_name}</span>
                                    )}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Bank Branch IFSC Code <span>*</span></label>
                                    <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleInputChange} className="form-control" />
                                      {formErrors.ifsc_code && (
                                        <span className="text-danger">{formErrors.ifsc_code}</span>
                                    )}
                                </div>




                            </div>



                        </CollapsibleCard>

                    </div>




                    <div className="row mt-4 justify-content-center w-100">
                        <div className="col-md-2 mt-2">
                            <button className="purple-btn2 w-100"
                                onClick={handleSubmit}
                            >Submit</button>
                        </div>
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
                size="xl"
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
                                <button
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
                                </button>
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


                                                {attachment.id && (

                                                    <button className="btn mt-0 pt-0" onClick={() => handleDeleteDocument(attachment.id)}>
                                                        <svg
                                                            width="16"
                                                            height="20"
                                                            viewBox="0 0 16 20"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M14.7921 2.44744H10.8778C10.6485 1.0366 9.42966 0 8.00005 0C6.57044 0 5.35166 1.03658 5.12225 2.44744H1.20804C0.505736 2.48655 -0.0338884 3.08663 0.00166019 3.78893V5.26379C0.00166019 5.38914 0.0514441 5.51003 0.140345 5.59895C0.229246 5.68787 0.35015 5.73764 0.475508 5.73764H1.45253V17.2689C1.45253 18.4468 2.40731 19.4025 3.58612 19.4025H12.4139C13.5927 19.4025 14.5475 18.4468 14.5475 17.2689V5.73764H15.5245C15.6498 5.73764 15.7707 5.68785 15.8597 5.59895C15.9486 5.51005 15.9983 5.38914 15.9983 5.26379V3.78893C16.0339 3.08663 15.4944 2.48654 14.7921 2.44744ZM8.00005 0.94948C8.90595 0.94948 9.69537 1.56823 9.91317 2.44744H6.08703C6.30483 1.56821 7.09417 0.94948 8.00005 0.94948ZM13.5998 17.2688C13.5998 17.5835 13.4744 17.8849 13.2522 18.1072C13.0299 18.3294 12.7285 18.4539 12.4138 18.4539H3.58608C2.93089 18.4539 2.40017 17.9231 2.40017 17.2688V5.73762H13.5998L13.5998 17.2688ZM15.0506 4.78996H0.949274V3.78895C0.949274 3.56404 1.08707 3.39512 1.20797 3.39512H14.792C14.9129 3.39512 15.0507 3.56314 15.0507 3.78895L15.0506 4.78996ZM4.91788 16.5533V7.63931C4.91788 7.37706 5.13035 7.16548 5.3926 7.16548C5.65396 7.16548 5.86643 7.37706 5.86643 7.63931V16.5533C5.86643 16.8147 5.65396 17.0271 5.3926 17.0271C5.13035 17.0271 4.91788 16.8147 4.91788 16.5533ZM7.52531 16.5533L7.5262 7.63931C7.5262 7.37706 7.73778 7.16548 8.00003 7.16548C8.26228 7.16548 8.47386 7.37706 8.47386 7.63931V16.5533C8.47386 16.8147 8.26228 17.0271 8.00003 17.0271C7.73778 17.0271 7.5262 16.8147 7.5262 16.5533H7.52531ZM10.1327 16.5533L10.1336 7.63931C10.1336 7.37706 10.3461 7.16548 10.6075 7.16548C10.8697 7.16548 11.0822 7.37706 11.0822 7.63931V16.5533C11.0822 16.8147 10.8697 17.0271 10.6075 17.0271C10.3461 17.0271 10.1336 16.8147 10.1336 16.5533H10.1327Z"
                                                                fill="#B25657"
                                                            />
                                                        </svg>
                                                    </button>
                                                )}

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {console.log("Deleted Attachment IDs:", deletedDocumentIds)}
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

export default LabourMasterEdit;