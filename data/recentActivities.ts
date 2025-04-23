

export const recentActivities = [
    {
      "id": "act_001",
      "type": "company_approved",
      "description": "Company 'Skyline Realty' was approved by Admin John Doe.",
      "actor": {
        "id": "admin_001",
        "name": "John Doe",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "company",
        "id": "comp_101",
        "name": "Skyline Realty"
      },
      "date": "2025-04-22T10:30:00Z"
    },
    {
      "id": "act_002",
      "type": "document_submitted",
      "description": "Company 'Greenwood Estates' submitted business registration documents for verification.",
      "actor": {
        "id": "comp_102",
        "name": "Greenwood Estates",
        "role": "company"
      },
      "relatedEntity": {
        "type": "company",
        "id": "comp_102",
        "name": "Greenwood Estates"
      },
      "date": "2025-04-22T09:15:00Z"
    },
    {
      "id": "act_003",
      "type": "company_rejected",
      "description": "Company 'Urban Homes' application was rejected by Admin Sarah Lee due to incomplete tax ID.",
      "actor": {
        "id": "admin_002",
        "name": "Sarah Lee",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "company",
        "id": "comp_103",
        "name": "Urban Homes"
      },
      "date": "2025-04-21T14:45:00Z"
    },
    {
      "id": "act_004",
      "type": "content_report_resolved",
      "description": "Content report #RPT-056 on property listing '123 Maple St' was resolved by Admin John Doe (content removed).",
      "actor": {
        "id": "admin_001",
        "name": "John Doe",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "content_report",
        "id": "rpt_056",
        "propertyId": "prop_789"
      },
      "date": "2025-04-21T11:20:00Z"
    },
    {
      "id": "act_005",
      "type": "issue_response",
      "description": "Admin Sarah Lee responded to issue #ISS-012 regarding payment disputes for company 'Blue Horizon Realty'.",
      "actor": {
        "id": "admin_002",
        "name": "Sarah Lee",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "issue",
        "id": "iss_012",
        "companyId": "comp_104"
      },
      "date": "2025-04-20T16:10:00Z"
    },
    {
      "id": "act_006",
      "type": "sub_account_created",
      "description": "Sub-account for Manager 'Emily Chen' was created by Admin John Doe.",
      "actor": {
        "id": "admin_001",
        "name": "John Doe",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "sub_account",
        "id": "sub_301",
        "name": "Emily Chen"
      },
      "date": "2025-04-20T13:00:00Z"
    },
    {
      "id": "act_007",
      "type": "policy_updated",
      "description": "Platform policy 'Content Guidelines' was updated by Admin Sarah Lee.",
      "actor": {
        "id": "admin_002",
        "name": "Sarah Lee",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "policy",
        "id": "pol_201",
        "title": "Content Guidelines"
      },
      "date": "2025-04-19T09:50:00Z"
    },
    {
      "id": "act_008",
      "type": "company_suspended",
      "description": "Company 'Cityscape Properties' was suspended by Admin John Doe for policy violation.",
      "actor": {
        "id": "admin_001",
        "name": "John Doe",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "company",
        "id": "comp_105",
        "name": "Cityscape Properties"
      },
      "date": "2025-04-19T08:30:00Z"
    },
    {
      "id": "act_009",
      "type": "content_report_dismissed",
      "description": "Content report #RPT-057 on property listing '456 Oak Ave' was dismissed by Admin Sarah Lee.",
      "actor": {
        "id": "admin_002",
        "name": "Sarah Lee",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "content_report",
        "id": "rpt_057",
        "propertyId": "prop_790"
      },
      "date": "2025-04-18T15:25:00Z"
    },
    {
      "id": "act_010",
      "type": "sub_account_deactivated",
      "description": "Sub-account for Manager 'Michael Brown' was deactivated by Admin John Doe.",
      "actor": {
        "id": "admin_001",
        "name": "John Doe",
        "role": "admin"
      },
      "relatedEntity": {
        "type": "sub_account",
        "id": "sub_302",
        "name": "Michael Brown"
      },
      "date": "2025-04-18T10:00:00Z"
    }
];
