# Nature Tek Solar Pvt. Ltd.
## Formal Dataset Request & Data Schema Specification
### Customer Grievance Management System — Industry Project (VIT Pune)

---

> **Submitted to:** Company Coordinator, Nature Tek Solar Pvt. Ltd.  
> **Submitted by:** Industry Project Team, VIT Pune — CSE-AI Div E, Batch 3  
> **Document Type:** Formal Data Request  
> **Version:** 1.0  
> **Date:** May 2026  
> **Reference PRD:** Nature_Tek_Solar_Grievance_PRD.md v2.0  

---

## Purpose of This Document

This document is a formal request submitted to the Nature Tek Solar company coordinator by the student project team at VIT Pune. We are building a **Customer Grievance Management System (CGMS)** as part of our industry project and require specific operational data and configuration inputs from the company to:

1. Seed the system with real-world master data (employees, products, categories)
2. Validate our database schema against actual business operations
3. Build realistic sample datasets for testing and academic evaluation
4. Ensure the system matches Nature Tek Solar's actual complaint patterns and workflows

**All data shared will be used solely for the academic project. Customer PII will be anonymized before use in any test environment. No real customer data will be published or submitted in academic reports.**

---

## Table of Contents

1. [Data Privacy & Compliance Commitment](#1-data-privacy--compliance-commitment)
2. [Dataset A — Employee Master Data](#2-dataset-a--employee-master-data)
3. [Dataset B — Product & Service Catalogue](#3-dataset-b--product--service-catalogue)
4. [Dataset C — Complaint Categories & SLA Config](#4-dataset-c--complaint-categories--sla-config)
5. [Dataset D — Historical Complaint Records](#5-dataset-d--historical-complaint-records)
6. [Dataset E — Customer Installation Records](#6-dataset-e--customer-installation-records)
7. [Dataset F — Branding & System Configuration](#7-dataset-f--branding--system-configuration)
8. [Sample Datasets (Pre-built by Team)](#8-sample-datasets-pre-built-by-team)
9. [Data Submission Instructions](#9-data-submission-instructions)
10. [Data Request Summary Checklist](#10-data-request-summary-checklist)

---

## 1. Data Privacy & Compliance Commitment

The project team commits to the following data handling practices:

| Commitment | Detail |
|---|---|
| **Anonymization** | All real customer names, phone numbers, and addresses will be replaced with fictional data before use in any test/demo environment |
| **No Public Disclosure** | Real company data will not appear in any academic report, presentation, or GitHub repository |
| **Access Control** | Shared data will be accessible only to the 5 project team members |
| **Deletion on Request** | All received data will be permanently deleted upon project completion or on client request |
| **Legal Compliance** | Data handling follows IT Act 2000 and DPDP Act 2023 guidelines |
| **Storage** | Data stored only on password-protected team drives; not on public cloud without encryption |

> Please sign and return the **sign-off section** at the end of this document to authorize data sharing.

---

## 2. Dataset A — Employee Master Data

### Why We Need This
To pre-populate the system's user accounts for admin and employee roles. This allows tickets to be assigned to real team members and dashboards to reflect actual organizational structure.

### What We Need

**File name:** `employees.csv`  
**Format:** CSV or Excel (.xlsx)  
**Minimum records needed:** All active employees who will use the system (at least 3–5 for testing)

### Schema

| Column Name | Data Type | Required | Max Length | Allowed Values | Example |
|---|---|---|---|---|---|
| `employee_name` | String | ✅ Yes | 100 chars | Any | Rajan Patil |
| `employee_code` | String | ❌ No | 20 chars | Alphanumeric | NTS-EMP-007 |
| `email` | Email | ✅ Yes | 150 chars | Valid email format | rajan@natureteksolar.com |
| `mobile` | String | ✅ Yes | 10 digits | Indian mobile number | 9876543210 |
| `department` | String | ✅ Yes | 50 chars | Installation, Sales, Service, Admin, Other | Installation |
| `role_in_system` | Enum | ✅ Yes | — | `employee` or `admin` | employee |
| `reporting_manager` | String | ❌ No | 100 chars | Name of supervisor | Amit Shah |
| `service_region` | String | ❌ No | 100 chars | City/area covered | Nashik, Pune |
| `is_active` | Boolean | ✅ Yes | — | TRUE / FALSE | TRUE |
| `join_date` | Date | ❌ No | — | DD-MM-YYYY | 01-03-2024 |

### Sample Row (Fictional)

```csv
employee_name,employee_code,email,mobile,department,role_in_system,reporting_manager,service_region,is_active,join_date
Rajan Patil,NTS-EMP-001,rajan.patil@natureteksolar.com,9876543210,Installation,employee,Amit Shah,"Nashik, Igatpuri",TRUE,01-03-2024
Sunita Mane,NTS-EMP-002,sunita.mane@natureteksolar.com,9765432100,Service,employee,Amit Shah,Nashik,TRUE,15-06-2023
Amit Shah,NTS-ADM-001,amit.shah@natureteksolar.com,9654321009,Admin,admin,,All Regions,TRUE,10-01-2022
```

### Notes for Coordinator
- If employees do not have company email IDs, personal Gmail IDs are acceptable for the project
- The `role_in_system` field controls what the employee can see — `admin` gets full access, `employee` only sees assigned tickets
- Minimum 1 admin account required; ideally 1 admin + 3–4 employees

---

## 3. Dataset B — Product & Service Catalogue

### Why We Need This
When a customer raises a complaint, they select the product involved. This dropdown must be populated with actual Nature Tek Solar products. Linking complaints to specific products also enables defect pattern analytics.

### What We Need

**File name:** `products.csv`  
**Format:** CSV or Excel (.xlsx)  
**Minimum records needed:** All currently sold/installed products and service types

### Schema

| Column Name | Data Type | Required | Max Length | Example |
|---|---|---|---|---|
| `product_name` | String | ✅ Yes | 150 chars | Fujiyama 540W Mono PERC Solar Panel |
| `product_code` | String | ❌ No | 30 chars | FUJ-540-MONO |
| `product_category` | Enum | ✅ Yes | — | Solar Panel / Inverter / Battery / Service / Accessory |
| `brand` | String | ❌ No | 100 chars | Fujiyama |
| `model_number` | String | ❌ No | 50 chars | FUJ-540M-BF |
| `warranty_months` | Number | ✅ Yes | — | 60 |
| `typical_capacity` | String | ❌ No | 50 chars | 540W, 3kW, 10kWh |
| `installation_type` | String | ❌ No | 50 chars | On-Grid / Off-Grid / Hybrid |
| `common_complaints` | String | ❌ No | 300 chars | Low output, cracked frame, connection fault |
| `service_region` | String | ❌ No | 150 chars | Nashik, Pune, Aurangabad |
| `is_active` | Boolean | ✅ Yes | — | TRUE |

### Sample Rows (Based on Public Website Data)

```csv
product_name,product_code,product_category,brand,warranty_months,typical_capacity,installation_type,common_complaints,is_active
Fujiyama 540W Mono PERC Panel,FUJ-540-MONO,Solar Panel,Fujiyama,60,540W,On-Grid / Hybrid,"Low output, cracked frame, shading issue",TRUE
Fujiyama 3kW On-Grid Inverter,FUJ-3K-OG,Inverter,Fujiyama,24,3kW,On-Grid,"Red fault light, no display, grid disconnect error",TRUE
Fujiyama 5kW Hybrid Inverter,FUJ-5K-HYB,Inverter,Fujiyama,24,5kW,Hybrid,"Battery not charging, overload fault, shutdown",TRUE
Lithium Battery Pack 10kWh,LIT-10K-PACK,Battery,NTS,24,10kWh,Hybrid / Off-Grid,"Not charging, BMS fault, swelling",TRUE
Solar Installation Service,SVC-INSTALL,Service,,0,,,"Delay, incomplete work, poor mounting",TRUE
Annual Maintenance Contract,SVC-AMC,Service,,0,,,"Missed visit, not responding, incomplete checkup",TRUE
Net Metering Assistance,SVC-NETMTR,Service,,0,,,"Subsidy delayed, application rejected, meter not installed",TRUE
```

### Notes for Coordinator
- Please add any products not listed above (we only have website-visible data)
- `warranty_months: 0` for services is correct — services don't carry product warranty
- `common_complaints` is optional but extremely helpful for auto-categorization in the Telegram bot

---

## 4. Dataset C — Complaint Categories & SLA Configuration

### Why We Need This
The SLA (Service Level Agreement) engine computes a resolution deadline for every ticket based on its category. We need the company to confirm or adjust the categories and resolution time targets.

### What We Need

**File name:** `categories_sla.csv`  
**Format:** CSV, Excel, or just fill in the table below and return it

### Proposed Categories — Please Confirm / Modify

| Category Name | Sub-Categories | Proposed SLA (hours) | Your Confirmed SLA | Priority Default |
|---|---|---|---|---|
| Installation Issue | Wiring fault, Panel alignment, Inverter setup, Cable routing | 48 | _______ | Medium |
| Product Defect | Panel cracked, Inverter failure, Battery fault, Connector issue | 72 | _______ | High |
| Billing / Payment | Invoice mismatch, Overcharge, Refund request | 24 | _______ | Medium |
| Subsidy / Net Metering | Application pending, Meter not installed, MSEDCL rejection | 48 | _______ | Medium |
| Service Delay | Delayed installation, Missed AMC visit, No-show technician | 24 | _______ | High |
| Warranty Claim | Under-warranty replacement, Repair request | 96 | _______ | Medium |
| Technical Query | How-to question, Manual request, App/monitoring help | 12 | _______ | Low |
| General Inquiry | Documentation, Compliance certificate, Other | 12 | _______ | Low |
| Other | Does not fit above categories | 48 | _______ | Low |

> **Instructions for Coordinator:** Please fill in the "Your Confirmed SLA" column with the target resolution time in hours. If you want to add new categories or rename existing ones, please do so. This table will be directly imported into the system's configuration.

### Priority Multipliers (Optional)

The system applies a multiplier to SLA deadlines based on complaint priority. Default multipliers are:

| Priority | Multiplier | Effect on 48hr SLA |
|---|---|---|
| Low | 1.5× | 72 hours |
| Medium | 1.0× | 48 hours |
| High | 0.75× | 36 hours |
| Critical | 0.5× | 24 hours |

> Please confirm if these multipliers are acceptable or suggest changes.

---

## 5. Dataset D — Historical Complaint Records

### Why We Need This
Historical data is the most valuable input for our project. It allows us to:
- Validate the complaint form fields against real-world submissions
- Identify actual complaint frequency and category distribution
- Build realistic test scenarios for UAT
- Demonstrate meaningful analytics in the admin dashboard during evaluation

### What We Need

**File name:** `historical_complaints.csv`  
**Format:** CSV, Excel, WhatsApp export, or any format you have  
**Minimum records needed:** 20–50 past complaints (even rough data is acceptable)  
**Time range:** Last 12–24 months preferred

### Ideal Schema (We Will Map Your Format to This)

| Column Name | Data Type | Required | Example |
|---|---|---|---|
| `date_raised` | Date | ✅ Yes | 15-01-2025 |
| `customer_name` | String | ✅ Yes | Will be anonymized |
| `customer_phone` | String | ✅ Yes | Will be anonymized |
| `customer_area` | String | ❌ No | Satpur, Nashik |
| `product_involved` | String | ✅ Yes | Fujiyama 3kW Inverter |
| `complaint_summary` | String | ✅ Yes | Inverter showing red light, no output |
| `category` | String | ❌ No | Product Defect |
| `handled_by` | String | ❌ No | Rajan Patil |
| `status` | String | ✅ Yes | Resolved / Unresolved / Pending |
| `resolution_summary` | String | ❌ No | Replaced faulty IGBT module |
| `resolution_date` | Date | ❌ No | 18-01-2025 |
| `days_to_resolve` | Number | ❌ No | 3 |

### If You Only Have WhatsApp Records

That is perfectly acceptable. Please export the relevant WhatsApp chat thread(s) as a `.txt` file:

```
WhatsApp → Chat → ⋮ Menu → More → Export Chat → Without Media
```

We will parse and structure the data ourselves.

### Anonymization Process

Before any historical data enters our test system or academic documents:

```
Real Data                    →    Anonymized Replacement
─────────────────────────────────────────────────────────
Customer Name: Suresh Jadhav →    Customer_0047
Phone: 9876543210            →    98XXXXX210
Address: Plot 12, Satpur     →    Area: Satpur (no plot number)
Email: suresh@gmail.com      →    customer_0047@test.com
```

---

## 6. Dataset E — Customer Installation Records

### Why We Need This
Linking complaints to specific installations gives the system full context — which panel/inverter is installed at the customer's location, installation date, warranty status, and whether the complaint is likely warranty-eligible.

### What We Need

**File name:** `installations.csv`  
**Format:** CSV or Excel  
**Minimum records needed:** 30–50 records (anonymized is fine)

### Schema

| Column Name | Data Type | Required | Example |
|---|---|---|---|
| `installation_id` | String | ✅ Yes | NTS-INST-2024-0045 |
| `customer_name` | String | ✅ Yes | Will be anonymized |
| `customer_phone` | String | ✅ Yes | Will be anonymized |
| `customer_area` | String | ✅ Yes | Satpur, Nashik |
| `installation_date` | Date | ✅ Yes | 20-03-2024 |
| `system_type` | Enum | ✅ Yes | On-Grid / Off-Grid / Hybrid |
| `system_capacity_kw` | Number | ✅ Yes | 5 |
| `panels_installed` | String | ❌ No | Fujiyama 540W × 9 |
| `inverter_model` | String | ❌ No | Fujiyama 5kW Hybrid |
| `battery_model` | String | ❌ No | Lithium 10kWh |
| `warranty_expiry` | Date | ❌ No | 20-03-2029 |
| `amc_active` | Boolean | ❌ No | TRUE |
| `last_service_date` | Date | ❌ No | 15-01-2025 |
| `assigned_engineer` | String | ❌ No | Rajan Patil |

### Notes for Coordinator
- This dataset is optional but highly recommended — it enables the system to auto-detect warranty status when a customer raises a complaint and flag it as a warranty claim
- If this data exists in any format (Tally, Excel, paper register), even partial data is useful
- All customer identifiers will be anonymized before use

---

## 7. Dataset F — Branding & System Configuration

### Why We Need This
These inputs configure the visual identity and communication settings of the portal to match Nature Tek Solar's brand.

### Required Inputs

Please fill in the table below and return:

| Configuration Item | Required | Your Input | Notes |
|---|---|---|---|
| **Company Logo (PNG/SVG)** | ✅ Yes | Already received ✅ | High-res preferred |
| **Primary Brand Color** | ✅ Yes | `#______` | Main color (hex code) |
| **Secondary Brand Color** | ❌ No | `#______` | Accent color |
| **Notification Email Address** | ✅ Yes | | e.g., `support@natureteksolar.com` |
| **Email Display Name** | ✅ Yes | | e.g., "Nature Tek Solar Support" |
| **Telegram Bot Display Name** | ✅ Yes | | e.g., "NatureTek Support" |
| **Telegram Bot Username** | ✅ Yes | | e.g., `@NatureTekSupportBot` |
| **Portal Title** | ✅ Yes | | e.g., "Nature Tek Solar — Support Portal" |
| **Preferred Language(s)** | ✅ Yes | | English / Marathi / Hindi |
| **Office Hours for SLA** | ❌ No | | e.g., Mon–Sat, 9 AM – 6 PM |
| **Holiday List (2026)** | ❌ No | | For SLA pause on public holidays |
| **Privacy Policy URL/Text** | ❌ No | | Displayed on complaint form footer |
| **T&C Text** | ❌ No | | Displayed on complaint form footer |
| **SMS Sender ID** | ❌ No | | e.g., NTSOL (Phase 2) |

---

## 8. Sample Datasets (Pre-Built by Team)

To unblock development while awaiting real data from the client, the project team has prepared the following synthetic datasets. These use realistic but entirely fictional data modeled on Nature Tek Solar's product line and operating region.

---

### Sample: `employees_sample.json`

```json
[
  {
    "employee_code": "NTS-EMP-001",
    "name": "Rajan Patil",
    "email": "rajan.patil@natureteksolar.com",
    "mobile": "9876543210",
    "department": "Installation",
    "role": "employee",
    "reporting_manager": "Amit Shah",
    "service_region": ["Nashik", "Igatpuri"],
    "is_active": true
  },
  {
    "employee_code": "NTS-EMP-002",
    "name": "Sunita Mane",
    "email": "sunita.mane@natureteksolar.com",
    "mobile": "9765432100",
    "department": "Service",
    "role": "employee",
    "reporting_manager": "Amit Shah",
    "service_region": ["Nashik"],
    "is_active": true
  },
  {
    "employee_code": "NTS-EMP-003",
    "name": "Prakash Kale",
    "email": "prakash.kale@natureteksolar.com",
    "mobile": "9654321009",
    "department": "Service",
    "role": "employee",
    "reporting_manager": "Amit Shah",
    "service_region": ["Nashik", "Sinnar", "Yeola"],
    "is_active": true
  },
  {
    "employee_code": "NTS-ADM-001",
    "name": "Amit Shah",
    "email": "amit.shah@natureteksolar.com",
    "mobile": "9543210098",
    "department": "Admin",
    "role": "admin",
    "reporting_manager": null,
    "service_region": ["All"],
    "is_active": true
  }
]
```

---

### Sample: `complaints_sample.json`

```json
[
  {
    "ticket_id": "NTS-2026-00001",
    "customer_name": "Customer_0001",
    "customer_phone": "98XXXXX101",
    "customer_email": "customer_0001@test.com",
    "invoice_no": "NTS-INV-2024-0213",
    "product_type": "Inverter",
    "category": "Product Defect",
    "subject": "Inverter showing red fault light continuously",
    "description": "My Fujiyama 5kW hybrid inverter has been showing a red fault light since yesterday evening. The system is not generating any power. Installed 8 months ago.",
    "status": "Resolved",
    "priority": "High",
    "source": "web",
    "customer_rating": 4,
    "customer_feedback": "Issue resolved in 2 days, technician was helpful.",
    "created_at": "2026-02-10T09:23:00Z",
    "resolved_at": "2026-02-12T14:45:00Z",
    "closed_at": "2026-02-13T10:00:00Z"
  },
  {
    "ticket_id": "NTS-2026-00002",
    "customer_name": "Customer_0002",
    "customer_phone": "98XXXXX202",
    "customer_email": "customer_0002@test.com",
    "invoice_no": null,
    "product_type": "Solar Panel",
    "category": "Installation Issue",
    "subject": "Panel output very low after recent rain",
    "description": "After last week's heavy rain, my 9-panel array output has dropped from 4.2kW to 1.1kW. Panels look fine visually but monitoring app shows low voltage from 3 panels.",
    "status": "In-Progress",
    "priority": "Medium",
    "source": "telegram",
    "created_at": "2026-03-01T11:05:00Z"
  },
  {
    "ticket_id": "NTS-2026-00003",
    "customer_name": "Customer_0003",
    "customer_phone": "98XXXXX303",
    "customer_email": "customer_0003@test.com",
    "invoice_no": "NTS-INV-2025-0089",
    "product_type": "Service",
    "category": "Subsidy / Net Metering",
    "subject": "MSEDCL net metering application pending for 4 months",
    "description": "We submitted the net metering application in November 2025. It has been 4 months and MSEDCL has not responded. We are not getting any credit for power exported to grid.",
    "status": "Escalated",
    "priority": "High",
    "source": "web",
    "created_at": "2026-03-15T08:30:00Z"
  },
  {
    "ticket_id": "NTS-2026-00004",
    "customer_name": "Customer_0004",
    "customer_phone": "98XXXXX404",
    "customer_email": "customer_0004@test.com",
    "invoice_no": "NTS-INV-2024-0301",
    "product_type": "Battery",
    "category": "Product Defect",
    "subject": "Lithium battery not charging after power cut",
    "description": "After a 6-hour power cut two days ago, the lithium battery pack stopped accepting charge. BMS indicator shows fault code E-03. System is in off-grid mode and battery is at 12%.",
    "status": "Pending",
    "priority": "Critical",
    "source": "telegram",
    "created_at": "2026-04-02T19:15:00Z"
  },
  {
    "ticket_id": "NTS-2026-00005",
    "customer_name": "Customer_0005",
    "customer_phone": "98XXXXX505",
    "customer_email": "customer_0005@test.com",
    "invoice_no": "NTS-INV-2025-0144",
    "product_type": "Service",
    "category": "Service Delay",
    "subject": "AMC visit not done for 3 months despite reminders",
    "description": "Our annual maintenance contract was supposed to include quarterly visits. The last visit was in December 2024. Despite calling multiple times in March and April, no technician has visited.",
    "status": "In-Progress",
    "priority": "Medium",
    "source": "web",
    "created_at": "2026-04-10T10:00:00Z"
  }
]
```

---

### Sample: `categories_sla_sample.json`

```json
[
  { "category": "Installation Issue",    "resolution_hours": 48, "priority_default": "Medium" },
  { "category": "Product Defect",        "resolution_hours": 72, "priority_default": "High"   },
  { "category": "Billing / Payment",     "resolution_hours": 24, "priority_default": "Medium" },
  { "category": "Subsidy / Net Metering","resolution_hours": 48, "priority_default": "Medium" },
  { "category": "Service Delay",         "resolution_hours": 24, "priority_default": "High"   },
  { "category": "Warranty Claim",        "resolution_hours": 96, "priority_default": "Medium" },
  { "category": "Technical Query",       "resolution_hours": 12, "priority_default": "Low"    },
  { "category": "General Inquiry",       "resolution_hours": 12, "priority_default": "Low"    },
  { "category": "Other",                 "resolution_hours": 48, "priority_default": "Low"    }
]
```

---

## 9. Data Submission Instructions

### How to Share Data

Please use **any one** of the following methods:

| Method | Details |
|---|---|
| **Google Drive** | Share folder with team email IDs (will be provided separately) |
| **Email** | Send to project team lead email (will be provided separately) |
| **WhatsApp** | Send files directly to project team WhatsApp group |
| **In-person** | Hand over USB drive / printout at scheduled meeting |

### File Naming Convention

Please name files as follows to avoid confusion:

```
NTS_Employees_v1.csv
NTS_Products_v1.csv
NTS_Categories_SLA_v1.csv
NTS_Historical_Complaints_v1.csv      ← anonymize before sending if possible
NTS_Installations_v1.csv             ← anonymize before sending if possible
NTS_Branding_Config_v1.xlsx
```

### Requested Submission Deadline

**By end of Week 2** (from PRD approval date) to avoid blocking Sprint 2 and 3 development.

If complete data is not available, **partial data is better than no data**. Please send whatever is ready and we will follow up for the rest.

---

## 10. Data Request Summary Checklist

Please use this checklist to track what has been shared:

| Dataset | File Name | Priority | Shared? | Date Shared |
|---|---|---|---|---|
| Employee Master Data | `NTS_Employees_v1.csv` | 🔴 High | ☐ | |
| Product Catalogue | `NTS_Products_v1.csv` | 🔴 High | ☐ | |
| Categories & SLA Config | `NTS_Categories_SLA_v1.csv` | 🔴 High | ☐ | |
| Historical Complaints | `NTS_Historical_Complaints_v1.csv` | 🟡 Medium | ☐ | |
| Installation Records | `NTS_Installations_v1.csv` | 🟡 Medium | ☐ | |
| Branding & Config | `NTS_Branding_Config_v1.xlsx` | 🔴 High | ☐ | |

---

## Authorization & Sign-Off

By signing below, the company coordinator authorizes the sharing of the above datasets with the VIT Pune project team for academic use, subject to the data privacy commitments stated in Section 1.

| | |
|---|---|
| **Authorized by (Company):** | _________________________ |
| **Name & Designation:** | _________________________ |
| **Date:** | _________________________ |
| **Signature:** | _________________________ |

---

| | |
|---|---|
| **Received by (Project Team):** | _________________________ |
| **Team Lead Name:** | _________________________ |
| **VIT Pune Roll No.:** | _________________________ |
| **Date:** | _________________________ |

---

> **Document prepared by:** VIT Pune — CSE-AI Division E, Batch 3  
> **Industry Project:** Nature Tek Solar Pvt. Ltd., Customer Grievance Management System  
> **Version:** 1.0 | **Date:** May 2026  
> *This document is to be submitted to the company coordinator alongside the PRD.*
