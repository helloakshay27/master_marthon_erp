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
  { label: "7 Days", value: "7 Days" },
  { label: "Custom", value: "Custom" },
  { label: "Fixed Time", value: "Fixed Time" },
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
  { label: 'Company', key: 'company' },
  { label: 'Project', key: 'project' },
  { label: 'Sub-Project', key: 'subProject' },
  { label: 'MOR No.', key: 'morNo' },
  { label: 'Material Sub-Type', key: 'materialSubType' },
  { label: 'Material', key: 'material' },
  { label: 'Material Description', key: 'materialDescription' },
  { label: 'Material Specifications', key: 'materialSpecifications' },
  { label: 'UOM', key: 'uom' },
  { label: 'Order Qty', key: 'orderQty' },
  { label: 'Min Qty', key: 'minQty' },
  { label: 'Tick Size', key: 'tickSize' },
  { label: 'Price Cap', key: 'priceCap' },
  { label: 'Price', key: 'price' },
  { label: 'Discount %', key: 'discount' },
  { label: 'Discounted Rate', key: 'discountedRate' },
  { label: 'Qty Available', key: 'qtyAvailable' },
  { label: 'Participant Attachment', key: 'participantAttachment' },
  { label: 'CGST', key: 'cgst' },
  { label: 'SGST', key: 'sgst' },
  { label: 'IGST', key: 'igst' },
  { label: 'Total Amount', key: 'totalAmount' },
  { label: 'Vendor Remarks', key: 'vendorRemarks' },
];

export const orderSummaryData = [
  {
    company: 'MNRL',
    project: 'NeoValley',
    subProject: 'Neo Valley- Building',
    morNo: 'MOR/MAR/MAX/ 101/02/2024',
    materialSubType: 'Tiles',
    material: 'Plain white Tiles',
    materialDescription: 'Plain White Sperenza Tiles',
    materialSpecifications: '300 x 300 mm',
    uom: 'Nos',
    orderQty: 10000,
    minQty: '',
    tickSize: '',
    priceCap: '',
    price: '',
    discount: '',
    discountedRate: '',
    qtyAvailable: '',
    participantAttachment: '',
    cgst: '',
    sgst: '',
    igst: '',
    totalAmount: '',
    vendorRemarks: '',
  },
  {
    company: 'MNRL',
    project: 'NeoValley',
    subProject: 'Neo Valley- Building',
    morNo: 'MOR/MAR/MAX/ 101/02/2024',
    materialSubType: 'Tiles',
    material: 'Plain white Tiles',
    materialDescription: 'Plain White Sperenza Tiles',
    materialSpecifications: '300 x 300 mm',
    uom: 'Nos',
    orderQty: 10000,
    minQty: '',
    tickSize: '',
    priceCap: '',
    price: '',
    discount: '',
    discountedRate: '',
    qtyAvailable: '',
    participantAttachment: '',
    cgst: '',
    sgst: '',
    igst: '',
    totalAmount: '',
    vendorRemarks: '',
  },
];


export const auditLogColumns = [
  { label: 'Sr.No.', key: 'srno' },
  { label: 'User', key: 'user' },
  { label: 'Date', key: 'date' },
  { label: 'Status', key: 'status' },
  { label: 'Remark', key: 'remark' },
];

export const auditLogData = [
  {
    srno: 1,
    user: 'Pratham Shastri',
    date: '15-02-2024',
    status: 'Verified',
    remark: 'Verified & Processed',
  },
  {
    srno: 2,
    user: 'Ananya Roy',
    date: '16-02-2024',
    status: 'Pending',
    remark: 'Awaiting Review',
  },
];


export const participantsTabColumns = [
  { label: 'Name', key: 'name' },
  { label: 'Bids Closed', key: 'bidsClosed' },
  { label: '', key: 'blank' },
];

export const participantsTabData = [
  {
    name: 'AXIS ELECTRICAL COMPONENTS INDIA PRIVATE LIMITED',
    bidsClosed: 'View Price Cap',
    blank: '',
  },
  {
    name: 'AJAY ELECTRICALS',
    bidsClosed: '',
    blank: '',
  },
  {
    name: 'Ampere Electrical Services',
    bidsClosed: 'View Price Cap',
    blank: '',
  },
  {
    name: 'A.R. ENTERPRISE',
    bidsClosed: '',
    blank: '',
  },
  {
    name: 'BRAHMARI POWERTECH PRIVATE LIMITED',
    bidsClosed: '',
    blank: '',
  },
  {
    name: 'CAPE ELECTRIC PRIVATE LIMITED',
    bidsClosed: 'View Price Cap',
    blank: '',
  },
  {
    name: 'ELECTRICAL SOLUTIONS',
    bidsClosed: '',
    blank: '',
  },
  {
    name: 'IQRA ENTERPRISES',
    bidsClosed: '',
    blank: '',
  },
  {
    name: 'MAC ELECTRICALS',
    bidsClosed: '',
    blank: '',
  },
  {
    name: 'Moksh Infra',
    bidsClosed: '',
    blank: '',
  },
];


export const eventProjectColumns = [
  { label: 'Sr.No.', key: 'srno' },
  { label: 'Company', key: 'company' },
  { label: 'Project', key: 'project' },
  { label: 'Sub-Project', key: 'subProject' },
  { label: 'MOR No.', key: 'morNo' },
  { label: 'Approved Date', key: 'approvedDate' },
  { label: 'Priority', key: 'priority' },
  { label: 'Sub-Type', key: 'subType' },
  { label: 'Assigned to', key: 'assignedTo' },
  { label: 'Lead Time', key: 'leadTime' },
  { label: 'Ageing', key: 'ageing' },
  { label: 'Material', key: 'material' },
  { label: 'UOM', key: 'uom' },
  { label: 'Pending Qty', key: 'pendingQty' },
  { label: 'Status', key: 'status' },
];

export const eventProjectData = [
  {
    srno: 1,
    company: 'Marathon',
    project: 'Neo Valley',
    subProject: 'Neo Valley Building',
    morNo: 'MOR947',
    date: 'date', 
    priority: 'Very Urgent',
    subType: 'Flooring Tiles',
    assignedTo: 'Sumeet',
    leadTime: '',
    ageing: '',
    material: 'Plain IVORY Tiles 300 x 300 mm',
    uom: 'Box',
    pendingQty: 1000,
    status: 'MOR Assigned',
  },
  {
    srno: 1,
    company: 'Marathon',
    project: 'Neo Valley',
    subProject: 'Neo Valley Building',
    morNo: 'MOR947',
    date: 'date', 
    priority: 'Very Urgent',
    subType: 'Flooring Tiles',
    assignedTo: 'Sumeet',
    leadTime: '',
    ageing: '',
    material: 'Plain IVORY Tiles 300 x 300 mm',
    uom: 'Box',
    pendingQty: 1000,
    status: 'MOR Assigned',
  }
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
  { label: 'Sr. No.', key: 'srno' },
  { label: 'Document Name', key: 'documentname' },
  { label: 'File Name', key: 'filename' },
  { label: 'File Type', key: 'filetype' },
  { label: 'Upload Date', key: 'uploaddate' },
];

export const documentData = [
  {
    srno: 1,
    documentname: 'MTO Copy',
    filename: 'MTO Copy.pdf',
    filetype: 'PDF',
    uploaddate: '03-03-2024',
  },
  {
    srno: 2,
    documentname: 'Invoice',
    filename: 'Invoice123.pdf',
    filetype: 'PDF',
    uploaddate: '04-03-2024',
  },
];

export const deliveryColumns = [
  { label: 'PO Delivery Date', key: 'poDeliveryDate' },
  { label: 'Sch. Delivery Qty', key: 'scheduleDeliveryQty' },
  { label: 'Supplier Delivery Date', key: 'supplierDeliveryDate' },
  { label: 'Supplier Delivery Qty', key: 'supplierDeliveryQty' },
];

export const deliveryData = [
  {
    poDeliveryDate: '10-04-2024',
    scheduleDeliveryQty: '40',
    supplierDeliveryDate: '10-04-2024',
    supplierDeliveryQty: '40',
  },
  {
    poDeliveryDate: '10-04-2024',
    scheduleDeliveryQty: '40',
    supplierDeliveryDate: '10-04-2024',
    supplierDeliveryQty: '40',
  },
  {
    poDeliveryDate: '10-04-2024',
    scheduleDeliveryQty: '40',
    supplierDeliveryDate: '10-04-2024',
    supplierDeliveryQty: '40',
  },
  {
    poDeliveryDate: '10-04-2024',
    scheduleDeliveryQty: '40',
    supplierDeliveryDate: '10-04-2024',
    supplierDeliveryQty: '40',
  },
];
