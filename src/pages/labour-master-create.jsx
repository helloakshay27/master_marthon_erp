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



const LabourMasterCreate = () => {
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    // const handleFileChange = (e) => setFile(e.target.files[0]);
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessages, setResultMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target.result.split(",")[1];

            try {
                const response = await axios.post(
                    `${baseURL}rate_details/import.json?token=${token}`,
                    { file: base64String },
                    { headers: { "Content-Type": "application/json" } }
                );
                if (response.status === 200) {
                    console.log("Upload response:", response.data);
                    // toast.success(response.data.message);
                    // If response.data.message is an array, show modal with all messages
                    if (Array.isArray(response.data.message)) {
                        setResultMessages(response.data.message);
                        setShowResultModal(true);
                    } else {
                        toast.success(response.data.message);
                    }
                    // alert("File uploaded successfully!");
                }
                setShowModal(false);
                setFile(null);
            } catch (error) {

                if (error.response && error.response.status === 422) {
                    console.log("422 response:", error.response.data);
                    if (Array.isArray(error.response.data.errors)) {
                        error.response.data.errors.forEach(errObj => {
                            const rowInfo = errObj.row ? `Row ${errObj.row}: ` : "";
                            toast.error(`${rowInfo}${errObj.error}`);
                            setShowModal(false);
                        });
                    } else if (typeof error.response.data.errors === "string") {
                        toast.error(error.response.data.errors);
                        setShowModal(false);
                    } else if (error.response && error.response.status === 500) {
                        toast.error("Server error occurred. Please try again later.");
                        setShowModal(false);
                    }
                } else {
                    console.error(error);
                    toast.error("Failed to upload. Please try again.");
                    setShowModal(false);
                }
                //   alert("File upload failed!");
                console.error(error);
            }
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `${baseURL}rate_details.json?q[id_eq]=&q[projects_id_eq]=&q[pms_sites_id_eq]=&q[pms_wings_id_eq]=&token=${token}`
            )
            // .then((response) => setData(response.data))
            // .catch((error) => console.error("Error fetching data:", error));
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleClick = () => {
        // Optionally, show the modal here if needed before navigating
        // setShowModal(true);
        navigate(`/create-rate?token=${token}`); // This will navigate to /create-rate
    };

    // States to store data company, project ,subproject ,wing
    const [companies, setCompanies] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [selectedWing, setSelectedWing] = useState(null);
    const [siteOptions, setSiteOptions] = useState([]);
    const [wingsOptions, setWingsOptions] = useState([]);

    // Fetch company data on component mount
    useEffect(() => {
        axios.get(`${baseURL}pms/company_setups.json?token=${token}`)
            .then(response => {
                setCompanies(response.data.companies);

            })
            .catch(error => {
                console.error('Error fetching company data:', error);

            });
    }, []);

    // Handle company selection
    const handleCompanyChange = (selectedOption) => {
        setSelectedCompany(selectedOption);  // Set selected company
        setSelectedProject(null); // Reset project selection
        setSelectedSite(null); // Reset site selection
        setSelectedWing(null); // Reset wing selection
        setProjects([]); // Reset projects
        setSiteOptions([]); // Reset site options
        setWingsOptions([]); // Reset wings options

        if (selectedOption) {
            // Find the selected company from the list
            const selectedCompanyData = companies.find(company => company.id === selectedOption.value);
            setProjects(
                selectedCompanyData?.projects.map(prj => ({
                    value: prj.id,
                    label: prj.name
                }))
            );
        }
    };

    // Handle project selection
    const handleProjectChange = (selectedOption) => {
        setSelectedProject(selectedOption);
        setSelectedSite(null); // Reset site selection
        setSelectedWing(null); // Reset wing selection
        setSiteOptions([]); // Reset site options
        setWingsOptions([]); // Reset wings options

        if (selectedOption) {
            // Find the selected project from the list of projects of the selected company
            const selectedCompanyData = companies.find(company => company.id === selectedCompany.value);
            const selectedProjectData = selectedCompanyData?.projects.find(project => project.id === selectedOption.value);

            // Set site options based on selected project
            setSiteOptions(
                selectedProjectData?.pms_sites.map(site => ({
                    value: site.id,
                    label: site.name
                })) || []
            );
        }
    };


    // Handle site selection
    const handleSiteChange = (selectedOption) => {
        setSelectedSite(selectedOption);
        setSelectedWing(null); // Reset wing selection
        setWingsOptions([]); // Reset wings options

        if (selectedOption) {
            // Find the selected project and site data
            const selectedCompanyData = companies.find(company => company.id === selectedCompany.value);
            const selectedProjectData = selectedCompanyData.projects.find(project => project.id === selectedProject.value);
            const selectedSiteData = selectedProjectData?.pms_sites.find(site => site.id === selectedOption.value);

            // Set wings options based on selected site
            setWingsOptions(
                selectedSiteData?.pms_wings.map(wing => ({
                    value: wing.id,
                    label: wing.name
                })) || []
            );
        }
    };

    // Handle wing selection
    const handleWingChange = (selectedOption) => {
        setSelectedWing(selectedOption);
    };

    // Map companies to options for the dropdown
    const companyOptions = companies.map(company => ({
        value: company.id,
        label: company.company_name
    }));


    const fetchFilteredData = async () => {
        const companyId = selectedCompany?.value || "";
        const projectId = selectedProject?.value || "";
        const siteId = selectedSite?.value || "";
        const wingId = selectedWing?.value || ""
        try {
            const response = await axios.get(
                `${baseURL}rate_details.json?q[id_eq]=${companyId}&q[projects_id_eq]=${projectId}&q[pms_sites_id_eq]=${siteId}&q[pms_wings_id_eq]=${wingId}&token=${token}`
            );
            setData(response.data);
        } catch (error) {
            console.error("Error fetching filtered data:", error);
        }
    };


    const handleReset = async () => {
        setSelectedCompany(null);
        setSelectedProject(null);
        setSelectedSite(null);
        setSelectedWing(null)
        try {
            const response = await axios.get(
                `${baseURL}rate_details.json?token=${token}`
            );
            setData(response.data); // or setData(response.data) as per your structure
            // Optionally, reset filter states here as well
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };


    const [formData, setFormData] = useState({
        labour_code: "",
        contractor_name: "",
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
        documents: "",
        document_upload: null,  // assuming dropdown value
        photo: null      // for file input
    });



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
                    fileName: file.name,
                    content_type: contentType,
                    content: base64Content,
                },
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleCreate = () => {
        const newEntry = {
            ...formData,
            id: Date.now(), // Ensure unique ID
        };

        setLabourList((prev) => [...prev, newEntry]);

        // Optional: Reset form
        setFormData({
            labour_code: "",
            contractor_name: "",
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
            documents: "",
            document_upload: null,
            photo: null,
        });

        // Optional: Close modal or provide feedback
        setShowModal(false);
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
    ];
    const availabilityOptions = [
        // { value: "available", label: "Available" },
        // { value: "not_available", label: "Not Available" },
        // { value: "on_leave", label: "On Leave" },
        // { value: "in_training", label: "In Training" },
        // { value: "on_duty", label: "On Duty" },
        { value: "full_time", label: "Full-time" },
        { value: "part_time", label: "Part-time" },
        { value: "on_call", label: "On-call" },
    ];
    const employmentStatusOptions = [
        { value: "permanent", label: "Permanent" },
        { value: "temporary", label: "Temporary" },
        { value: "contract", label: "Contract" },
        // { value: "probation", label: "Probation" },
        // { value: "intern", label: "Intern" },
        // { value: "terminated", label: "Terminated" },

    ];
    const departmentOptions = [
        // { value: "hr", label: "Human Resources" },
        // { value: "finance", label: "Finance" },
        // { value: "engineering", label: "Engineering" },
        // { value: "sales", label: "Sales" },
        // { value: "marketing", label: "Marketing" },
        // { value: "operations", label: "Operations" },
        // { value: "it", label: "IT Support" }
    ];
    const supervisorOptions = [
        // { value: "john_doe", label: "John Doe" },
        // { value: "jane_smith", label: "Jane Smith" },
        // { value: "amit_patel", label: "Amit Patel" },
        // { value: "sunita_kumar", label: "Sunita Kumar" },
        // { value: "rahul_sharma", label: "Rahul Sharma" }
    ];
    const documentOptions = [
        { value: "aadhar", label: "Aadhar Card" },
        { value: "pan", label: "PAN Card" },
        // { value: "dl", label: "Driving License" },
        { value: "training_cert", label: "Training Certificate" },
    ];
    const jobTitleOptions = [
        { value: "electrician", label: "Electrician" },
        { value: "plumber", label: "Plumber" },
        { value: "carpenter", label: "Carpenter" },
        { value: "project_manager", label: "Project Manager" },
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

    console.log("attachments:", attachmentsPayload)

    // attachment like mor end******
    // console.log("Token value inside render:", token);
    return (
        <>
            <div className="website-content overflow-auto">
                <div className="module-data-section p-4 pb-5">
                    <a href="">
                        <a href="#">Setup &gt; Purchase Setup &gt; Labour Master</a>
                    </a>
                    <h5 class="mt-4">Labour Master Create</h5>


                    <CollapsibleCard title="Labour Details" showCollapseButton={false}>

                        <div className="row card-body mt-0 pt-0">
                            <div className="col-md-4 mb-3">
                                <label>Labour Code <span>*</span></label>
                                <input type="text" name="labour_code" value={formData.labour_code} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Contractor Name <span>*</span></label>
                                <input type="text" name="contractor_name" value={formData.contractor_name} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Labour Sub Type <span>*</span></label>
                                <input type="text" name="labour_sub_type" value={formData.labour_sub_type} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>First Name <span>*</span></label>
                                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Last Name <span>*</span></label>
                                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Middle Name <span>*</span></label>
                                <input type="text" name="middle_name" value={formData.middle_name} onChange={handleInputChange} className="form-control" />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Phone Number</label>
                                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Job Title/Position <span>*</span></label>
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
                                <label>Labour Category <span>*</span></label>
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
                                <label>Work Shifts <span>*</span></label>
                                <input type="text" name="work_shifts" value={formData.work_shifts} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Availability <span>*</span></label>
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
                                <label>Employment Status <span>*</span></label>
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
                                <label>Union Memberships <span>*</span></label>
                                <input type="text" name="union_memberships" value={formData.union_memberships} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Hourly Rate/Salary <span>*</span></label>
                                <input type="number" name="hourly_rate" value={formData.hourly_rate} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Overtime Rate <span>*</span></label>
                                <input type="number" name="overtime_rate" value={formData.overtime_rate} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Address <span>*</span></label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Department <span>*</span></label>
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
                                <label>Supervisor <span>*</span></label>
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
                                <label>Hire Date <span>*</span></label>
                                <input type="date" name="hire_date" value={formData.hire_date} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Equipment Certifications  <span>*</span></label>
                                <input type="text" name="certifications" value={formData.certifications} onChange={handleInputChange} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>Photo  <span>*</span></label>
                                <input type="file" name="photo" onChange={(e) => handleFileChange2(e, "photo")} className="form-control" />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>License/Permit Information <span>*</span></label>
                                <input type="text" name="license_info" value={formData.license_info} onChange={handleInputChange} className="form-control" />
                            </div>

                            <div className="d-flex justify-content-between mt-5 p-0 ">
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
                            </div>

                            <div className="tbl-container mb-4 mt-2 p-0" style={{ maxHeight: "500px" }}>
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


                            </div>
                        </div>



                    </CollapsibleCard>

                    <div className="mt-5">
                        <CollapsibleCard title="Bank Details" showCollapseButton={false}>

                            <div className="row card-body mt-0 pt-0">


                                <div className="col-md-4 mb-3">
                                    <label>Bank Account Name <span>*</span></label>
                                    <input type="text" name="bank_account_name" value={formData.bank_account_name} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Bank Account No <span>*</span></label>
                                    <input type="text" name="bank_account_no" value={formData.bank_account_no} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Bank Branch Name <span>*</span></label>
                                    <input type="text" name="bank_branch_name" value={formData.bank_branch_name} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Bank Branch IFSC Code <span>*</span></label>
                                    <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleInputChange} className="form-control" />
                                </div>




                            </div>



                        </CollapsibleCard>

                    </div>




                    <div className="row mt-4 justify-content-center w-100">
                        <div className="col-md-2 mt-2">
                            <button className="purple-btn2 w-100"
                            // onClick={handleSubmit}
                            >Submit</button>
                        </div>
                        <div className="col-md-2">
                            <button className="purple-btn1 w-100"
                            // onClick={() => navigate(`/credit-note-list?token=${token}`)}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
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
            )}


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



        </>
    )
}

export default LabourMasterCreate;