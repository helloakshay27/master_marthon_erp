// Column Definitions for estimaton list 
export const estimationListColumns = [
  { label: "Sr.No.", key: "srNo" },
  { label: "Certifying Company", key: "certifyingCompany" },
  { label: "Project", key: "project" },
  { label: "Sub-Project", key: "subProject" },
  { label: "Wing", key: "wing" },
  { label: "Location", key: "location" },
  
];

// Data Rows
export const  estimationListData = [
  {
    srNo: 1,
    certifyingCompany:"Marathon Next-Gen Realty Limited",
    project: "King Project (Approved)",
    subProject:"Marathon Emrace (Pending)",
    wing:'Embrace A (Draft)',
    location:"Mulund",
   
  },
  
  {
    srNo: "",
    certifyingCompany:"",
    project: "",
    subProject:"Maxima",
    wing:'wing A1(Draft)',
    location:"Mulund",
   
  },
  {
    srNo: "",
    certifyingCompany:"",
    project: "",
    subProject:"",
    wing:'wing A2(Draft)',
    location:"Mulund",
   
  },
  {
    srNo: "",
    certifyingCompany:"",
    project: "King Project2 (Approved)",
    subProject:"Marathon Emrace2 (Pending)",
    wing:'Embrace A1(Draft)2',
    location:"Mulund2",
   
  },
  {
    srNo: "",
    certifyingCompany:"",
    project: "",
    subProject:"",
    wing:'Embrace A2(Draft)2',
    location:"Mulund2",
   
  },
  {
    srNo: "",
    certifyingCompany:"",
    project: "",
    subProject:"Emblem (Pending)",
    wing:'wing A (Draft)1',
    location:"Mulund2",
   
  },
  {
    srNo: "",
    certifyingCompany:"",
    project: "",
    subProject:"",
    wing:'wing B (Draft)2',
    location:"Mulund2",
   
  },
  {
    srNo: "2",
    certifyingCompany:"MNRL",
    project: "panvel phase2 (Approved)",
    subProject:"Marathon Emrace2 (Pending)",
    wing:'Embrace A (Draft)2',
    location:"Mulund2",
   
  },
  // More data rows can be added here
]

export const companyOptions = [
  { value: "MNRL", label: "MNRL" },
  { value: "Alaska", label: "Alaska" },
  { value: "California", label: "California" },
  { value: "Delaware", label: "Delaware" },
  { value: "Tennessee", label: "Tennessee" },
  { value: "Texas", label: "Texas" },
  { value: "Washington", label: "Washington" },
];

export const activities = [
  {
    text: "Asmita Salvi has extended the bidding time by 1 day.",
    time: "05 Apr 2024 at 03:56 pm",
    orderEnding: "15:29 → 15:55",
  },
  {
    text: "You edited the configurations.",
    time: "05 Apr 2024 at 11:29 am",
    change: "Show Best Price to Participants: Yes → No",
  },
  {
    text: "Asmita Salvi has extended the bidding time by 1 hour.",
    time: "05 Apr 2024 at 11:51 am",
    orderEnding: "14:55 → 15:55",
  },
  {
    text: "Asmita Salvi has extended the bidding time by 1 day 23 hours.",
    time: "04 Apr 2024 at 03:51 pm",
    orderEnding: "15:28 → 15:55",
  },
  {
    text: "Asmita Salvi has extended the bidding time by 3 hours.",
    time: "04 Apr 2024 at 10:56 am",
    orderEnding: "09:00 → 12:02",
  },
  {
    text: "LUCKY PLY AND LAMINATES has placed the bid.",
    time: "02 Apr 2024 at 09:08 pm",
  },
];

export const evaluationOptions = [
  { label: "10 Minutes", value: "10 Minutes" },
  { label: "30 Minutes", value: "30 Minutes" },
  { label: "60 Minutes", value: "60 Minutes" },
  { label: "Custom", value: "Custom" },
  // { label: "Fixed Time", value: "Fixed Time" },
];

export const chartOptions = {
  chart: {
    type: "scatter",
    zoomType: "xy",
  },
  title: {
    text: "",
  },
  xAxis: {
    type: "datetime",
    title: {
      text: null,
    },
    labels: {
      format: "{value:%m/%d %H:%M %p}",
    },
  },
  yAxis: {
    title: {
      text: null,
    },
    labels: {
      format: "₹{value}",
    },
  },
  legend: {
    enabled: true,
  },
  series: [
    {
      name: "LUCKY PLY AND LAMINATES",
      data: [
        [Date.UTC(2024, 3, 2, 22, 23), 13000],
        [Date.UTC(2024, 3, 2, 16, 11), 10000],
      ],
    },
    {
      name: "OMFURN INDIA LIMITED",
      data: [
        [Date.UTC(2024, 3, 2, 19, 48), 14200],
        [Date.UTC(2024, 3, 2, 15, 36), 10800],
      ],
    },
  ],
};

export const orderSummaryColumns = [
  { label: "Company", key: "company" },
  { label: "Project", key: "project" },
  { label: "Sub-Project", key: "subProject" },
  { label: "MOR No.", key: "morNo" },
  { label: "Material Sub-Type", key: "materialSubType" },
  { label: "Material", key: "material" },
  { label: "Material Description", key: "materialDescription" },
  { label: "Material Specifications", key: "materialSpecifications" },
  { label: "UOM", key: "uom" },
  { label: "Order Qty", key: "orderQty" },
  { label: "Min Qty", key: "minQty" },
  { label: "Tick Size", key: "tickSize" },
  { label: "Price Cap", key: "priceCap" },
  { label: "Price", key: "price" },
  { label: "Discount %", key: "discount" },
  { label: "Discounted Rate", key: "discountedRate" },
  { label: "Qty Available", key: "qtyAvailable" },
  { label: "Participant Attachment", key: "participantAttachment" },
  { label: "CGST", key: "cgst" },
  { label: "SGST", key: "sgst" },
  { label: "IGST", key: "igst" },
  { label: "Total Amount", key: "totalAmount" },
  { label: "Vendor Remarks", key: "vendorRemarks" },
];

export const orderSummaryData = [
  {
    company: "MNRL",
    project: "NeoValley",
    subProject: "Neo Valley- Building",
    morNo: "MOR/MAR/MAX/ 101/02/2024",
    materialSubType: "Tiles",
    material: "Plain white Tiles",
    materialDescription: "Plain White Sperenza Tiles",
    materialSpecifications: "300 x 300 mm",
    uom: "Nos",
    orderQty: 10000,
    minQty: "",
    tickSize: "",
    priceCap: "",
    price: "",
    discount: "",
    discountedRate: "",
    qtyAvailable: "",
    participantAttachment: "",
    cgst: "",
    sgst: "",
    igst: "",
    totalAmount: "",
    vendorRemarks: "",
  },
  {
    company: "MNRL",
    project: "NeoValley",
    subProject: "Neo Valley- Building",
    morNo: "MOR/MAR/MAX/ 101/02/2024",
    materialSubType: "Tiles",
    material: "Plain white Tiles",
    materialDescription: "Plain White Sperenza Tiles",
    materialSpecifications: "300 x 300 mm",
    uom: "Nos",
    orderQty: 10000,
    minQty: "",
    tickSize: "",
    priceCap: "",
    price: "",
    discount: "",
    discountedRate: "",
    qtyAvailable: "",
    participantAttachment: "",
    cgst: "",
    sgst: "",
    igst: "",
    totalAmount: "",
    vendorRemarks: "",
  },
];

export const auditLogColumns = [
  { label: "Sr.No.", key: "srno" },
  { label: "User", key: "user" },
  { label: "Date", key: "date" },
  { label: "Status", key: "status" },
  { label: "Remark", key: "remark" },
];

export const auditLogData = [
  {
    srno: 1,
    user: "Pratham Shastri",
    date: "15-02-2024",
    status: "Verified",
    remark: "Verified & Processed",
  },
  {
    srno: 2,
    user: "Ananya Roy",
    date: "16-02-2024",
    status: "Pending",
    remark: "Awaiting Review",
  },
];

export const participantsTabColumns = [
  { label: "Sr No", key: "srNo" }, 
  { label: "Name", key: "name" },
  { label: "Phone", key: "phone" },
  { label: "Email", key: "email" },
];
export const contractColumns = [
  { label: "Sr No", key: "srNo" }, 
  { label: "Vendor Name", key: "vendorName" },
  { label: "Event Name", key: "eventName" },
  { label: "Event No", key: "eventNo" }, 
  { label: "Status", key: "status" },
];

export const contractData = [
  {
    srNo: 1,
    vendorName: "AXIS ELECTRICAL COMPONENTS INDIA PRIVATE LIMITED",
    eventName: "Electrical Supplies Procurement",
    eventNo: "EVT001",
    status: "Completed",
  },
  {
    srNo: 2,
    vendorName: "AJAY ELECTRICALS",
    eventName: "Power Distribution Network Setup",
    eventNo: "EVT002",
    status: "Pending",
  },
  {
    srNo: 3,
    vendorName: "Ampere Electrical Services",
    eventName: "Transformer Maintenance",
    eventNo: "EVT003",
    status: "In Progress",
  },
  {
    srNo: 4,
    vendorName: "A.R. ENTERPRISE",
    eventName: "Substation Installation",
    eventNo: "EVT004",
    status: "Completed",
  },
  {
    srNo: 5,
    vendorName: "BRAHMARI POWERTECH PRIVATE LIMITED",
    eventName: "Electrical Wiring Project",
    eventNo: "EVT005",
    status: "Pending",
  },
  {
    srNo: 6,
    vendorName: "CAPE ELECTRIC PRIVATE LIMITED",
    eventName: "Lighting Solutions Deployment",
    eventNo: "EVT006",
    status: "In Progress",
  },
  {
    srNo: 7,
    vendorName: "ELECTRICAL SOLUTIONS",
    eventName: "Panel Board Assembly",
    eventNo: "EVT007",
    status: "Completed",
  },
  {
    srNo: 8,
    vendorName: "IQRA ENTERPRISES",
    eventName: "Cable Network Upgrade",
    eventNo: "EVT008",
    status: "In Progress",
  },
  {
    srNo: 9,
    vendorName: "MAC ELECTRICALS",
    eventName: "Generator Installation",
    eventNo: "EVT009",
    status: "Pending",
  },
  {
    srNo: 10,
    vendorName: "Moksh Infra",
    eventName: "Power Backup Solutions",
    eventNo: "EVT010",
    status: "Completed",
  },
];


export const participantsTabData = [
  {
    name: "AXIS ELECTRICAL COMPONENTS INDIA PRIVATE LIMITED",
    phone: "9876543210",
    email: "contact@axis-electrical.com",
  },
  {
    name: "AJAY ELECTRICALS",
    phone: "9876543211",
    email: "ajay@ajayelectricals.com",
  },
  {
    name: "Ampere Electrical Services",
    phone: "9876543212",
    email: "info@ampere-electrical.com",
  },
  {
    name: "A.R. ENTERPRISE",
    phone: "9876543213",
    email: "sales@arenterprise.com",
  },
  {
    name: "BRAHMARI POWERTECH PRIVATE LIMITED",
    phone: "9876543214",
    email: "support@brahmaripowertech.com",
  },
  {
    name: "CAPE ELECTRIC PRIVATE LIMITED",
    phone: "9876543215",
    email: "info@capeelectric.com",
  },
  {
    name: "ELECTRICAL SOLUTIONS",
    phone: "9876543216",
    email: "contact@electricalsolutions.com",
  },
  {
    name: "IQRA ENTERPRISES",
    phone: "9876543217",
    email: "info@iqraenterprises.com",
  },
  {
    name: "MAC ELECTRICALS",
    phone: "9876543218",
    email: "contact@macelectricals.com",
  },
  {
    name: "Moksh Infra",
    phone: "9876543219",
    email: "sales@mokshinfra.com",
  },
];

export const eventProjectColumns = [
  { label: "Sr.No.", key: "srNo" },
  { label: "Event Title", key: "event_title" },
  { label: "Event No", key: "event_no" },
  { label: "Created At", key: "created_at" },
  { label: "Created By", key: "created_by" },

  { label: "Event Type", key: "event_type" },
  { label: "Event Configuration", key: "event_configuration" },
  { label: "Status", key: "status" },
];

export const eventProjectData = [
  {
    srno: 1,
    company: "Marathon",
    project: "Neo Valley",
    subProject: "Neo Valley Building",
    morNo: "MOR947",
    date: "date",
    priority: "Very Urgent",
    subType: "Flooring Tiles",
    assignedTo: "Sumeet",
    leadTime: "",
    ageing: "",
    material: "Plain IVORY Tiles 300 x 300 mm",
    uom: "Box",
    pendingQty: 1000,
    status: "MOR Assigned",
  },
  {
    srno: 1,
    company: "Marathon",
    project: "Neo Valley",
    subProject: "Neo Valley Building",
    morNo: "MOR947",
    date: "date",
    priority: "Very Urgent",
    subType: "Flooring Tiles",
    assignedTo: "Sumeet",
    leadTime: "",
    ageing: "",
    material: "Plain IVORY Tiles 300 x 300 mm",
    uom: "Box",
    pendingQty: 1000,
    status: "MOR Assigned",
  },
];

// Column Definitions
export const rfqEventColumns = [
  { label: "Sr.No.", key: "srNo" },
  { label: "Company / Project / Sub-Project", key: "companyProject" },
  { label: "Event No.", key: "eventNo" },
  { label: "Event Type", key: "eventType" },
  { label: "Material Type", key: "materialType" },
  { label: "MOR No.", key: "morNo" },
  { label: "Total Products", key: "totalProducts" },
  { label: "Created by", key: "createdBy" },
  { label: "Created On", key: "createdOn" },
  { label: "Live On", key: "liveOn" },
  { label: "Finish On", key: "finishOn" },
];

// Data Rows
export const rfqEventData = [
  {
    srNo: 1,
    companyProject: [
      "Marathon Nextgen Realty Limited - Nexgen Infra - Building 1",
      "Marathon Realty Private Limited - Future X - Building 1, Building 2",
    ],
    eventNo: "RFQ1476217",
    eventType: "RFQ",
    materialType: "Plumbing",
    morNo: "",
    totalProducts: 2,
    createdBy: "Abhinav Mishra",
    createdOn: "2024-11-25",
    liveOn: "2024-11-25",
    finishOn: "24 H: 05 M: 18 S",
  },
  // More data rows can be added here
];

export const documentColumns = [
  { label: "Sr. No.", key: "srno" },
  { label: "Document Name", key: "documentname" },
  { label: "File Name", key: "filename" },
  { label: "File Type", key: "filetype" },
  { label: "Upload Date", key: "uploaddate" },
];

export const documentData = [
  {
    srno: 1,
    documentname: "MTO Copy",
    filename: "MTO Copy.pdf",
    filetype: "PDF",
    uploaddate: "03-03-2024",
  },
  {
    srno: 2,
    documentname: "Invoice",
    filename: "Invoice123.pdf",
    filetype: "PDF",
    uploaddate: "04-03-2024",
  },
];

export const deliveryColumns = [
  { label: "PO Delivery Date", key: "poDeliveryDate" },
  { label: "Sch. Delivery Qty", key: "scheduleDeliveryQty" },
  { label: "Supplier Delivery Date", key: "supplierDeliveryDate" },
  { label: "Supplier Delivery Qty", key: "supplierDeliveryQty" },
];

export const deliveryData = [
  {
    poDeliveryDate: "10-04-2024",
    scheduleDeliveryQty: "40",
    supplierDeliveryDate: "10-04-2024",
    supplierDeliveryQty: "40",
  },
  {
    poDeliveryDate: "10-04-2024",
    scheduleDeliveryQty: "40",
    supplierDeliveryDate: "10-04-2024",
    supplierDeliveryQty: "40",
  },
  {
    poDeliveryDate: "10-04-2024",
    scheduleDeliveryQty: "40",
    supplierDeliveryDate: "10-04-2024",
    supplierDeliveryQty: "40",
  },
  {
    poDeliveryDate: "10-04-2024",
    scheduleDeliveryQty: "40",
    supplierDeliveryDate: "10-04-2024",
    supplierDeliveryQty: "40",
  },
];

export const vendorsColumns = [
  { label: "Select", key: "select" },
  { label: "Supplier Type", key: "supplierType" },
  { label: "Vendor Name", key: "vendorName" },
  { label: "Status", key: "status" },
];

export const vendorsData = [
  {
    supplierType: "Cement, Waterproofing",
    vendorName: "Sharda Chemical Pvt Ltd",
    status: "Delivery Pending",
  },
  {
    supplierType: "Tiles, Granites, Cement, Sand",
    vendorName: "Ashirvad Ceramics",
    status: "Not submitted Bid / Quotation",
  },
];

export const resposneVendorColumns = [
  { label: "S no.", key: "sNo" },
  { label: "Best Price", key: "bestPrice" },
  { label: "Product", key: "product" },
  { label: "Best Total Amount", key: "bestTotalAmount" },
  { label: "Product Variant", key: "productVariant" },
  { label: "Quantity Requested", key: "quantityRequested" },
  { label: "Delivery Location", key: "deliveryLocation" },
];

export const resposneVendorData = [
  {
    sNo: "1",
    bestPrice: "₹ 2,690 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 1,58,074.69",
    productVariant: "PVC PIPE SCH 80 4\" X 10'",
    quantityRequested: "101 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "2",
    bestPrice: "₹ 492 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 24,726.44",
    productVariant: "uPVC SOLVENT CEMENT 473 ML",
    quantityRequested: "69 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "3",
    bestPrice: "₹ 218 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 14,365.03",
    productVariant: 'uPVC COUPLER 4"',
    quantityRequested: "101 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "4",
    bestPrice: "₹ 1,717 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 31,454.58",
    productVariant: 'UPVC ELBOW 6"',
    quantityRequested: "45 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "5",
    bestPrice: "₹ 2,050 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 1,780.25",
    productVariant: 'uPVC TEE 6"',
    quantityRequested: "2 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "6",
    bestPrice: "₹ 830 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 36,141.93",
    productVariant: 'UPVC COUPLER 6"',
    quantityRequested: "101 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "7",
    bestPrice: "₹ 5,160 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 2,68,198.7",
    productVariant: "PVC PIPE SCH 80 6\" X 10'",
    quantityRequested: "86 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "8",
    bestPrice: "₹ 834 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 3,128.97",
    productVariant: 'uPVC Flange 6"',
    quantityRequested: "6 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "9",
    bestPrice: "₹ 291 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 18,971.75",
    productVariant: "uPVC PRIMER 237 ML",
    quantityRequested: "85 Nos",
    deliveryLocation: "Panvel",
  },
  {
    sNo: "10",
    bestPrice: "₹ 598 /Nos",
    product: "Plumbing Material",
    bestTotalAmount: "₹ 5,645.12",
    productVariant: 'UPVC BEND 6" 45 DEGREE',
    quantityRequested: "8 Nos",
    deliveryLocation: "Panvel",
  },
];

export const freightData = [
  { label: "Freight Charge", value: "₹4,000" },
  { label: "GST on Freight", value: "18%" },
  { label: "Realised Freight", value: "₹4,720" },
  { label: "Warranty Clause", value: "mtc" },
  { label: "Payment Terms", value: "advance" },
  { label: "Loading / Unloading", value: "under buyer" },
];
export  const productTableColumns = [
  { label: "S no.*", key: "Sno" },
  { label: "Material*", key: "product" },
  { label: "Quantity Requested*", key: "quantityRequested" },
  { label: "Quantity Available", key: "quantityAvailable" },
  { label: "Price*", key: "price" },
  { label: "Delivery location*", key: "deliveryLocation" },
  { label: "Creator Attachment", key: "creatorAttachment" },
  { label: "Discount", key: "discount" },
  { label: "Realised Discount*", key: "realisedDiscount" },
  { label: "GST*", key: "gst" },
  { label: "Realised GST", key: "realisedGst" },
  { label: "Participant Attachment", key: "participantAttachment" },
  { label: "Vendor Remark*", key: "vendorRemark" },
  { label: "Landed Amount*", key: "landedAmount" },
  { label: "Total Amount*", key: "totalAmount" },
];

export const biddingData = [
  {
    description: "SITC of Electrical w...(As per Tec... - 1 Lumpsum)",
    vendors: [
      {
        vendorName: "ELECTRIC PRIVATE LIM...",
        priceQuoted: "₹ 52,12,409.83/Lumpsum",
      },
      {
        vendorName: "AXIS ELECTRICAL COMPONENT...",
        priceQuoted: "Ampere Electrical Services",
      },
    ],
  },
  {
    description: "SITC of Electrical w...(As per Tec... - 1 Lumpsum)",
    vendors: [
      {
        vendorName: "ELECTRIC PRIVATE LIM...",
        priceQuoted: "₹ 52,12,409.83/Lumpsum",
      },
      {
        vendorName: "AXIS ELECTRICAL COMPONENT...",
        priceQuoted: "Ampere Electrical Services",
      },
    ],
  },
  {
    description: "SITC of Electrical w...(As per Tec... - 1 Lumpsum)",
    vendors: [
      {
        vendorName: "ELECTRIC PRIVATE LIM...",
        priceQuoted: "₹ 52,12,409.83/Lumpsum",
      },
      {
        vendorName: "AXIS ELECTRICAL COMPONENT...",
        priceQuoted: "Ampere Electrical Services",
      },
    ],
  },
  {
    description: "SITC of Electrical w...(As per Tec... - 1 Lumpsum)",
    vendors: [
      {
        vendorName: "ELECTRIC PRIVATE LIM...",
        priceQuoted: "₹ 52,12,409.83/Lumpsum",
      },
      {
        vendorName: "AXIS ELECTRICAL COMPONENT...",
        priceQuoted: "Ampere Electrical Services",
      },
    ],
  },
  {
    description: "SITC of Electrical w...(As per Tec... - 1 Lumpsum)",
    vendors: [
      {
        vendorName: "ELECTRIC PRIVATE LIM...",
        priceQuoted: "₹ 52,12,409.83/Lumpsum",
      },
      {
        vendorName: "AXIS ELECTRICAL COMPONENT...",
        priceQuoted: "Ampere Electrical Services",
      },
    ],
  },
];

export const participantsData = [
  {
    label: "Total Participants",
    id: "total-participants",
    value: 7,
  },
  {
    label: "Active participants",
    id: "active-participants",
    value: 2,
  },
  {
    label: "Total Bids",
    id: "total-bids",
    value: 3,
  },
  {
    label: "Revised bids",
    id: "revised-bids",
    value: 1,
  },
  {
    label: "Rejected bids",
    id: "rejected-bids",
    value: 0,
  },
  {
    label: "Counter offers",
    id: "counter-offers",
    value: 0,
  },
  {
    label: "Accepted Counter Offers",
    id: "accepted-counter-offers",
    value: 0,
  },
  {
    label: "Dynamic time extended",
    id: "dynamic-time-extended",
    value: "0 min",
  },
];

export const eventData = [
  {
    timeRemaining: "20H:52M:29S",
    endsIn: true,
    name: "Pratik Bhosale",
    description:
      "[IN/BEBS3A/Bebscheme3Bwing/84] Electrical - Marathon NextGen Realty Ltd",
    location: "(BE-B-Scheme-3A)",
    // deliveryLocation: "Marathon NextGen Realty Ltd",
    status: "RFQ",
    productsCount: "700 Nos",
  },
  {
    timeRemaining: "12H:15M:45S",
    endsIn: false,
    name: "Aman Sharma",
    description:
      "[IN/NXTPH2/ICD001/76] Plumbing Supplies - NexGen Build Pvt Ltd",
    location: "(Phase-2, Sector-7)",
    deliveryLocation: "NexGen Build Pvt Ltd",
    status: "RFQ",
    productsCount: "450 Nos",
  },
  {
    timeRemaining: "8H:30M:12S",
    endsIn: true,
    name: "Rohit Verma",
    description: "[IN/BLDG4/BWR301/09] Cement Bags - Urban Builders LLP",
    location: "(Building 4, Wing-B)",
    deliveryLocation: "Urban Builders LLP",
    status: "RFQ",
    productsCount: "1200 Nos",
  },
  {
    timeRemaining: "16H:45M:50S",
    endsIn: true,
    name: "Kavita Iyer",
    description:
      "[IN/LGCHM/CRT02/21] Tiles & Marble - Landmark Constructions Ltd",
    location: "(Landmark Grand Heights)",
    deliveryLocation: "Landmark Constructions Ltd",
    status: "RFQ",
    productsCount: "300 Nos",
  },
  {
    timeRemaining: "5H:20M:10S",
    endsIn: false,
    name: "Siddharth Joshi",
    description:
      "[IN/BSTTWR/FLR15/99] Electrical Wiring - BuildSmart Solutions Pvt Ltd",
    location: "(Tower-15, Block-A)",
    deliveryLocation: "BuildSmart Solutions Pvt Ltd",
    status: "RFQ",
    productsCount: "180 Nos",
  },
  {
    timeRemaining: "24H:00M:00S",
    endsIn: true,
    name: "Meena Patel",
    description:
      "[IN/COMMPLX/SH06/88] Lighting Solutions - Bright Future Lighting Co",
    location: "(Commercial Complex, Shop-6)",
    deliveryLocation: "Bright Future Lighting Co",
    status: "RFQ",
    productsCount: "500 Nos",
  },
  {
    timeRemaining: "7H:45M:30S",
    endsIn: true,
    name: "Vikram Singh",
    description: "[IN/HRTWNG/BW110/54] Roofing Sheets - Horizon Build Corp",
    location: "(Harmony Wing, Building 110)",
    deliveryLocation: "Horizon Build Corp",
    status: "RFQ",
    productsCount: "750 Nos",
  },
  {
    timeRemaining: "3H:10M:05S",
    endsIn: true,
    name: "Nidhi Kapoor",
    description: "[IN/BLGDS/GRND01/34] Paint Supplies - Elegant Builders Ltd",
    location: "(Grand Sky Tower, Floor 1)",
    deliveryLocation: "Elegant Builders Ltd",
    status: "RFQ",
    productsCount: "900 Nos",
  },
  {
    timeRemaining: "10H:25M:15S",
    endsIn: false,
    name: "Rajat Khurana",
    description: "[IN/NXTINB/PH1/08] Steel Beams - Superior Structures Pvt Ltd",
    location: "(Next Innova, Phase-1)",
    deliveryLocation: "Superior Structures Pvt Ltd",
    status: "RFQ",
    productsCount: "650 Nos",
  },
  {
    timeRemaining: "15H:05M:40S",
    endsIn: false,
    name: "Aarti Desai",
    description:
      "[IN/BLSHP/BLD001/72] Woodwork Supplies - Crafty Solutions Ltd",
    location: "(Blossom Shops, Block-1)",
    deliveryLocation: "Crafty Solutions Ltd",
    status: "RFQ",
    productsCount: "300 Nos",
  },
];

export const eventHistoryData = [
  {
    date: "2nd December",
    entries: [
      {
        name: "Pratik Bhosale",
        description:
          "[IN/SAH01/sslcce/149] Electrical - Marathon NextGen Realty Ltd",
        deliveryLocation: "Marathon NextGen Realty Ltd (BE-B-Scheme-3A)",
        status: "RFQ",
        productsCount: "231 Nos",
      },
      {
        name: "Pratik Bhosale",
        description:
          "[IN/SAH01/SSRCE/200] Hardware - Marathon NextGen Realty Ltd",
        deliveryLocation: "Marathon NextGen Realty Ltd (BE-B-Scheme-3A)",
        status: "RFQ",
        productsCount: "200 Nos",
        bids: "2 bids",
      },
    ],
  },
  {
    date: "30th November",
    entries: [
      {
        name: "Pratik Bhosale",
        description:
          "[IN/SevH001/SevHSale/778] ELECTRICAL products - NEXZONE ENERGY UTILITIES LLP (SEVEN HILL) - BHANDUP",
        deliveryLocation: "NEXZONE ENERGY UTILITIES LLP (SEVEN HILL)",
        status: "RFQ",
        productsCount: "2 products",
        bids: "3 bids",
      },
    ],
  },
  {
    date: "1st December",
    entries: [
      {
        name: "Pratik Bhosale",
        description: "[IN/ABCD01/Test/100] Plumbing - Super Builders Pvt Ltd",
        deliveryLocation: "Super Builders Pvt Ltd (Project-A)",
        status: "RFQ",
        productsCount: "150 Nos",
      },
      {
        name: "Pratik Bhosale",
        status: "RFQ",
        productsCount: "300 Sqft",
        bids: "5 bids",
      },
    ],
  },
  {
    date: "28th November",
    entries: [
      {
        name: "Pratik Bhosale",
        description:
          "[IN/PQRS03/Example/400] Paint Supplies - Urban Developers Ltd",
        deliveryLocation: "Urban Developers Ltd (Block-B)",
        status: "RFQ",
        productsCount: "500 Ltr",
      },
      {
        name: "Pratik Bhosale",
        description: "[IN/WXYZ04/Check/500] Tiles - Skyline Realty Ltd",
        deliveryLocation: "Skyline Realty Ltd (Phase-2)",
        status: "RFQ",
        productsCount: "200 Boxes",
        bids: "4 bids",
      },
    ],
  },
  {
    date: "25th November",
    entries: [
      {
        name: "Pratik Bhosale",
        description:
          "[IN/LMNO05/Sample/600] Electrical Cables - Greenfield Pvt Ltd",
        deliveryLocation: "Greenfield Pvt Ltd (Sector-D)",
        status: "RFQ",
        productsCount: "1000 Mtr",
      },
      {
        name: "Pratik Bhosale",
        description:
          "[IN/QRST06/Mock/700] Doors & Frames - Oceanic Builders Ltd",
        deliveryLocation: "Oceanic Builders Ltd (Floor-4)",
        status: "RFQ",
        productsCount: "50 Sets",
        bids: "2 bids",
      },
    ],
  },
];

export const reportType = [
  { value: "Event Detailed Report", label: "Event Detailed Report" },
  { value: "Live Event Report", label: "Live Event Report" },
  { value: "Event Summary Report", label: "Event Summary Report" },
  {
    value: "Transactional Summary Report",
    label: "Transactional Summary Report",
  },
  { value: "Negotiation Report", label: "Negotiation Report" },
];

export const bidsType = [
  { value: "Select Top bids", label: "Select Top bids" },
  { value: "Top 2 bids", label: "Top 2 bids" },
  { value: "Top 3 bids", label: "Top 3 bids" },
  { value: "Top 4 bids", label: "Top 4 bids" },
  { value: "Top 5 bids", label: "Top 5 bids" },
  { value: "Top 6 bids", label: "Top 6 bids" },
  { value: "Top 7 bids", label: "Top 7 bids" },
];

export const citiesList = [
  { value: "Select Cities", label: "Select Cities" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Chennai", label: "Chennai" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Pune", label: "Pune" },
  { value: "Jaipur", label: "Jaipur" },
  { value: "Lucknow", label: "Lucknow" },
  { value: "Kanpur", label: "Kanpur" },
  { value: "Nagpur", label: "Nagpur" },
  { value: "Indore", label: "Indore" },
  { value: "Thane", label: "Thane" },
  { value: "Bhopal", label: "Bhopal" },
  { value: "Visakhapatnam", label: "Visakhapatnam" },
  { value: "Pimpri-Chinchwad", label: "Pimpri-Chinchwad" },
  { value: "Patna", label: "Patna" },
  { value: "Vadodara", label: "Vadodara" },
  { value: "Ghaziabad", label: "Ghaziabad" },
];

export const options = [
  { value: "Rajnish Patil", label: "Rajnish Patil" },
  { value: "Lockated Demo", label: "Lockated Demo" },
  { value: "Abdul G", label: "Abdul G" },
  { value: "Kiran Sharma", label: "Kiran Sharma" },
  { value: "Dinesh Shinde", label: "Dinesh Shinde" },
  { value: "PSIPL 1", label: "PSIPL 1" },
  { value: "Jayesh P", label: "Jayesh P" },
  { value: "Rabi Narayan", label: "Rabi Narayan" },
  { value: "Zs Demo", label: "Zs Demo" },
  { value: "Suyash Jagdale", label: "Suyash Jagdale" },
];

export const mumbaiLocations = [
  { value: "Select Location", label: "Select Location" },
  { value: "Andheri East", label: "Andheri East" },
  { value: "Andheri West", label: "Andheri West" },
  { value: "Bandra East", label: "Bandra East" },
  { value: "Bandra West", label: "Bandra West" },
  { value: "Borivali East", label: "Borivali East" },
  { value: "Borivali West", label: "Borivali West" },
  { value: "Goregaon East", label: "Goregaon East" },
  { value: "Goregaon West", label: "Goregaon West" },
  { value: "Kandivali East", label: "Kandivali East" },
  { value: "Kandivali West", label: "Kandivali West" },
  { value: "Malad East", label: "Malad East" },
  { value: "Malad West", label: "Malad West" },
  { value: "Dadar East", label: "Dadar East" },
  { value: "Dadar West", label: "Dadar West" },
  { value: "Lower Parel", label: "Lower Parel" },
  { value: "Worli", label: "Worli" },
  { value: "Kurla", label: "Kurla" },
  { value: "Mulund East", label: "Mulund East" },
  { value: "Mulund West", label: "Mulund West" },
  { value: "Powai", label: "Powai" },
  { value: "Vikhroli East", label: "Vikhroli East" },
  { value: "Vikhroli West", label: "Vikhroli West" },
  { value: "Thane", label: "Thane" },
  { value: "Chembur", label: "Chembur" },
  { value: "Ghatkopar East", label: "Ghatkopar East" },
  { value: "Ghatkopar West", label: "Ghatkopar West" },
  { value: "Byculla", label: "Byculla" },
  { value: "Colaba", label: "Colaba" },
  { value: "Fort", label: "Fort" },
  { value: "Marine Lines", label: "Marine Lines" },
  { value: "Churchgate", label: "Churchgate" },
  { value: "Chandivali", label: "Chandivali" },
];

export const unitMeasure = [
  { value: "Select Unit", label: "Select Unit" },
  { value: "KG", label: "KG" },
  { value: "Litre", label: "Litre" },
  { value: "Unit", label: "Unit" },
  { value: "Piece", label: "Piece" },
  { value: "Metre", label: "Metre" },
  { value: "Square Metre", label: "Square Metre" },
];

export const product = [
  { value: "Cement", label: "Cement" },
  { value: "Bricks", label: "Bricks" },
  { value: "Sand", label: "Sand" },
  { value: "Concrete", label: "Concrete" },
  { value: "Steel Rods", label: "Steel Rods" },
  { value: "Paints", label: "Paints" },
  { value: "Tiles", label: "Tiles" },
  { value: "Plywood", label: "Plywood" },
  { value: "Plumbing Pipes", label: "Plumbing Pipes" },
  { value: "Electrical Wires", label: "Electrical Wires" },
  { value: "Glass Panels", label: "Glass Panels" },
  { value: "Roofing Sheets", label: "Roofing Sheets" },
  { value: "Flooring Adhesives", label: "Flooring Adhesives" },
  { value: "Door Frames", label: "Door Frames" },
  { value: "Windows", label: "Windows" },
  { value: "Ladders", label: "Ladders" },
  { value: "Drills", label: "Drills" },
  { value: "Grinders", label: "Grinders" },
  { value: "Measuring Tape", label: "Measuring Tape" },
  { value: "Safety Helmets", label: "Safety Helmets" },
];

export const productCategories = [
  { value: "Construction Materials", label: "Construction Materials" },
  { value: "Plumbing Supplies", label: "Plumbing Supplies" },
  { value: "Electrical Components", label: "Electrical Components" },
  { value: "Flooring and Tiling", label: "Flooring and Tiling" },
  { value: "Paints and Coatings", label: "Paints and Coatings" },
  { value: "Roofing Materials", label: "Roofing Materials" },
  { value: "Wood and Carpentry", label: "Wood and Carpentry" },
  { value: "Safety Equipment", label: "Safety Equipment" },
  { value: "Windows and Doors", label: "Windows and Doors" },
  { value: "Masonry Tools", label: "Masonry Tools" },
  { value: "Adhesives and Sealants", label: "Adhesives and Sealants" },
  { value: "Heavy Machinery", label: "Heavy Machinery" },
  { value: "Hand Tools", label: "Hand Tools" },
  { value: "Power Tools", label: "Power Tools" },
  { value: "Metal and Steel Supplies", label: "Metal and Steel Supplies" },
  { value: "Glass and Glazing", label: "Glass and Glazing" },
  { value: "Scaffolding and Ladders", label: "Scaffolding and Ladders" },
  { value: "HVAC Systems", label: "HVAC Systems" },
  { value: "Insulation Materials", label: "Insulation Materials" },
  { value: "Concrete and Cement", label: "Concrete and Cement" },
];

