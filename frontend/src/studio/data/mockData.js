export const studioOwner = {
  name: "Pavithra",
  role: "Business owner",
  studioName: "Shoot @ Sight",
  tagline: "WEDDINGS & FILMS • OS",
  email: "pavithra@shootatsight.com",
  phone: "+91 98450 12345",
  gstin: "29AABCU9603R1ZM",
  city: "Bengaluru, Karnataka"
};

export const overviewMetrics = {
  revenueThisMonth: "₹8,40,000",
  revenueGrowth: "+31.3%",
  confirmedBookings: 12,
  bookingsGrowth: "+3 weddings",
  outstandingPayments: "₹3,25,000",
  invoicesAwaiting: 4,
  newEnquiries: 24,
  enquiriesToFollowUp: 6,
  sixMonthTotal: "₹38,60,000",
  sixMonthGrowth: "↗ 18.6%",
  monthlyTrend: [
    { month: "Jun", revenue: 5.2, expenses: 2.1 },
    { month: "Jul", revenue: 6.8, expenses: 2.4 },
    { month: "Aug", revenue: 6.1, expenses: 2.2 },
    { month: "Sep", revenue: 7.9, expenses: 2.8 },
    { month: "Oct", revenue: 6.4, expenses: 2.5 },
    { month: "Nov", revenue: 8.4, expenses: 2.9 },
  ]
};

export const attentionTasks = [
  {
    id: 1,
    title: "Follow up with Nisha & Aditya",
    subtitle: "Quotation QT-0184 · sent 2 days ago",
    done: false,
    type: "quotation"
  },
  {
    id: 2,
    title: "Collect Karthik & Diya’s advance",
    subtitle: "₹1,26,000 · Invoice INV-0263",
    done: false,
    type: "payment"
  },
  {
    id: 3,
    title: "Confirm crew for Aarav & Meera",
    subtitle: "2 photographers · 1 cinematographer",
    done: false,
    type: "crew"
  }
];

export const clientsList = [
  {
    id: "CL-0101",
    bookingId: "BK-0261",
    couple: "Aarav & Meera",
    partnerA: "Aarav Sharma",
    partnerB: "Meera Reddy",
    phone: "+91 98860 41230",
    email: "aarav.meera@gmail.com",
    city: "Bengaluru",
    weddingDate: "21 Nov 2026",
    package: "Signature",
    value: "₹2,80,000",
    paid: "₹2,10,000",
    balance: "₹70,000",
    status: "Confirmed",
    statusType: "confirmed",
    venue: "The Leela Palace, Bengaluru",
    events: ["Mehendi & Sangeet", "Muhurtham & Reception"],
    crew: ["Vikram (Lead Candid)", "Arjun (Traditional)", "Karan (Cinema)"],
    notes: "High priority on drone entrance and same-day 60s teaser."
  },
  {
    id: "CL-0102",
    bookingId: "BK-0262",
    couple: "Rohan & Ananya",
    partnerA: "Rohan Varma",
    partnerB: "Ananya Rao",
    phone: "+91 98452 78901",
    email: "rohan.ananya@outlook.com",
    city: "Bengaluru",
    weddingDate: "24 Nov 2026",
    package: "Essential",
    value: "₹1,50,000",
    paid: "₹1,50,000",
    balance: "₹0",
    status: "Confirmed",
    statusType: "confirmed",
    venue: "Taj West End, Bengaluru",
    events: ["Engagement Ceremony"],
    crew: ["Vikram (Lead Candid)", "Siddharth (Cinematographer)"],
    notes: "Outdoor twilight cocktail shoot requested."
  },
  {
    id: "CL-0103",
    bookingId: "BK-0263",
    couple: "Karthik & Diya",
    partnerA: "Karthik Iyer",
    partnerB: "Diya Nair",
    phone: "+91 97411 23456",
    email: "karthik.diya@gmail.com",
    city: "Mysuru",
    weddingDate: "28 Nov 2026",
    package: "Heirloom",
    value: "₹4,20,000",
    paid: "₹0",
    balance: "₹4,20,000",
    status: "Advance due",
    statusType: "warning",
    venue: "Lalitha Mahal Palace, Mysuru",
    events: ["Haldi", "Sangeet Night", "Traditional Muhurtham", "Royal Reception"],
    crew: ["Vikram (Lead)", "Gautam (Candid)", "Karan (Cinema)", "Rahul (Drone)"],
    notes: "Full royal 3-day coverage. Two 40-page flush mount albums."
  },
  {
    id: "CL-0104",
    bookingId: "BK-0264",
    couple: "Sneha & Vikram",
    partnerA: "Sneha Hegde",
    partnerB: "Vikram Shenoy",
    phone: "+91 99001 88221",
    email: "sneha.v@yahoo.com",
    city: "Mangaluru",
    weddingDate: "05 Dec 2026",
    package: "Signature",
    value: "₹3,10,000",
    paid: "₹1,00,000",
    balance: "₹2,10,000",
    status: "Confirmed",
    statusType: "confirmed",
    venue: "Ocean Pearl, Mangaluru",
    events: ["Roce Ceremony", "Church Nuptials", "Grand Reception"],
    crew: ["Arjun (Lead)", "Siddharth (Cinema)"],
    notes: "Beachside couple portraits prior to reception."
  },
  {
    id: "CL-0105",
    bookingId: "BK-0265",
    couple: "Nisha & Aditya",
    partnerA: "Nisha Gupta",
    partnerB: "Aditya Singhal",
    phone: "+91 98200 55431",
    email: "nisha.aditya@gmail.com",
    city: "Bengaluru",
    weddingDate: "14 Dec 2026",
    package: "Heirloom",
    value: "₹4,50,000",
    paid: "₹0",
    balance: "₹4,50,000",
    status: "Quotation sent",
    statusType: "pending",
    venue: "Palace Grounds (Sheesh Mahal), Bengaluru",
    events: ["Mehendi", "Sangeet", "Wedding", "Reception"],
    crew: ["Unassigned"],
    notes: "QT-0184 sent on 16 Nov. Follow-up scheduled for today."
  }
];

export const quotationsList = [
  {
    id: "QT-0184",
    client: "Nisha & Aditya",
    date: "16 Nov 2026",
    validUntil: "30 Nov 2026",
    amount: "₹4,50,000",
    status: "Sent",
    statusType: "pending",
    events: "3 Days · 4 Ceremonies",
    venue: "Sheesh Mahal, Palace Grounds, Bengaluru",
    deliverables: [
      "2 Senior Candid Photographers",
      "2 Traditional Photographers (4K)",
      "2 Cinematographers (Sony FX3 Rig)",
      "1 Licensed Drone Cinematographer",
      "1 Ultra-HD 3-5 Min Wedding Teaser",
      "1 Full Feature Wedding Documentary Film (35-50 Min)",
      "2 Premium 40-Page Leather Flush Mount Albums (12x18)",
      "Complete Color-Graded High-Res Deliverables via Private Cloud Gallery"
    ]
  },
  {
    id: "QT-0183",
    client: "Aarav & Meera",
    date: "04 Oct 2026",
    validUntil: "18 Oct 2026",
    amount: "₹2,80,000",
    status: "Accepted",
    statusType: "confirmed",
    events: "2 Days · Signature Wedding Package",
    venue: "The Leela Palace, Bengaluru",
    deliverables: [
      "1 Lead Candid Photographer",
      "1 Traditional Photographer",
      "2 Cinematographers",
      "1 Wedding Highlights Film (4 Min)",
      "1 40-Page Luxury Linen Album"
    ]
  },
  {
    id: "QT-0182",
    client: "Karthik & Diya",
    date: "28 Sep 2026",
    validUntil: "12 Oct 2026",
    amount: "₹4,20,000",
    status: "Accepted",
    statusType: "confirmed",
    events: "3 Days · Mysuru Royal Package",
    venue: "Lalitha Mahal Palace, Mysuru",
    deliverables: [
      "Complete Royal Wedding Suite",
      "Pre-Wedding Concept Film in Coorg",
      "Traditional + Candid Complete Coverage",
      "Two Heirloom Albums"
    ]
  }
];

export const invoicesList = [
  {
    id: "INV-0261-A",
    bookingId: "BK-0261",
    client: "Aarav & Meera",
    issueDate: "10 Oct 2026",
    dueDate: "20 Oct 2026",
    amount: "₹1,40,000",
    type: "50% Booking Advance",
    status: "Paid",
    statusType: "confirmed",
    method: "NEFT / Bank Transfer"
  },
  {
    id: "INV-0261-B",
    bookingId: "BK-0261",
    client: "Aarav & Meera",
    issueDate: "15 Nov 2026",
    dueDate: "21 Nov 2026",
    amount: "₹70,000",
    type: "25% Wedding Week Payment",
    status: "Paid",
    statusType: "confirmed",
    method: "UPI"
  },
  {
    id: "INV-0262",
    bookingId: "BK-0262",
    client: "Rohan & Ananya",
    issueDate: "01 Nov 2026",
    dueDate: "10 Nov 2026",
    amount: "₹1,50,000",
    type: "Full Payment",
    status: "Paid",
    statusType: "confirmed",
    method: "Bank Transfer"
  },
  {
    id: "INV-0263",
    bookingId: "BK-0263",
    client: "Karthik & Diya",
    issueDate: "05 Nov 2026",
    dueDate: "15 Nov 2026",
    amount: "₹1,26,000",
    type: "30% Initial Advance",
    status: "Overdue",
    statusType: "danger",
    method: "Pending"
  }
];

export const calendarEvents = [
  {
    date: "2026-11-21",
    day: 21,
    title: "Aarav & Meera · Wedding & Reception",
    type: "Wedding",
    venue: "The Leela Palace, Bengaluru",
    color: "#C5A46D",
    crew: "Vikram, Arjun, Karan"
  },
  {
    date: "2026-11-24",
    day: 24,
    title: "Rohan & Ananya · Engagement",
    type: "Engagement",
    venue: "Taj West End, Bengaluru",
    color: "#EBDCD7",
    crew: "Vikram, Siddharth"
  },
  {
    date: "2026-11-28",
    day: 28,
    title: "Karthik & Diya · Muhurtham",
    type: "Wedding",
    venue: "Lalitha Mahal Palace, Mysuru",
    color: "#C5A46D",
    crew: "Full 4-member Crew"
  },
  {
    date: "2026-11-16",
    day: 16,
    title: "Follow-up QT-0184 · Nisha & Aditya",
    type: "Task",
    venue: "Studio Call",
    color: "#D99B52",
    crew: "Pavithra"
  }
];
