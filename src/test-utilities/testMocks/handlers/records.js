import { rest } from "msw";

export const getRecords = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/workflow-instances`,
  (req, res, ctx) => {
    const sort = req.url.searchParams.get("sort[app]");

    let records = [
      {
        status: "completed",
        createdAt: "2025-03-04T14:42:56.215Z",
        variables: [],
        active: true,
        _id: "67c71170d58213001afa7d47",
        app: {
          active: true,
          deleted: false,
          _id: "67c59aea686c986eef407974",
          account: {
            customisations: {
              logo: {
                imageSource: "UPLOAD",
                imageUrl:
                  "https://storage.googleapis.com/test-plug-files/NNPC.png",
                altText: "custom_logo",
              },
              defaultEmailSender: {
                usePlugDefault: true,
                integrationId: null,
              },
              theme: {
                usePlugDefault: false,
                primaryColor: "#3DDB03",
              },
              organizationEmail: {
                isEnabled: true,
              },
              externalPage: {
                logo: {
                  imageSource: "NONE",
                },
                isEnabled: true,
                showCompanyLogo: true,
                showShortBio: true,
                showAboutUs: true,
                showPartnerLogo: true,
                showBlog: true,
                showNewsletter: true,
                showContactUs: true,
                showLinkProduct: true,
                showSocialMediaHandles: true,
                showCustomUrls: true,
              },
              internalPage: {
                logo: {
                  imageSource: "NONE",
                },
                theme: {
                  usePlugDefault: false,
                  primaryColor: "#FF0000",
                },
                isEnabled: true,
                organizationDetails: [
                  {
                    contentType: "External link",
                    _id: "679b3fe760c2b1fbe76313fa",
                    title: "Policy document",
                    linkText: "this is an external link",
                    linkUrl: "www.google.com",
                  },
                  {
                    contentType: "Documents",
                    _id: "67a386ddebbee86981e0282d",
                    title: "HMO document",
                    documentType: "Some iusers",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/a4.pdf",
                  },
                  {
                    contentType: "Documents",
                    _id: "67aeeb00a60c450a0b4a6155",
                    title: "Departmental Document",
                    documentType: "Office of HR",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/DSN_Voice_Data_Collection_Sample_Prompts_(3).pdf",
                  },
                  {
                    contentType: "Documents",
                    _id: "67aeeb21a60c450a0b4a6177",
                    title: "Organizational Document",
                    documentType: "Organisation Document",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/01_Adepoju_Samuel.pdf",
                  },
                ],
                personalDetails: [
                  {
                    contentType: "User details",
                    _id: "67aeec88a60c450a0b4a62a6",
                    title: "Fullname",
                    informationType: "Name",
                    userInformation: "Employee fullname",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeec5fa60c450a0b4a6266",
                    title: "Email",
                    informationType: "Email",
                    userInformation: "this is the user email",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeec49a60c450a0b4a6253",
                    title: "Role ",
                    informationType: "Role",
                    userInformation: "The role of the employee",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeeabfa60c450a0b4a6141",
                    title: "User ID",
                    informationType: "Employee ID",
                    userInformation: "Employee ID",
                  },
                ],
              },
              quickAccessApps: [
                {
                  _id: "675b0865c3fdac3b5dfef670",
                  name: "Som app a",
                  description: "something",
                  slug: "som-app-a",
                },
                {
                  _id: "67a9b46e8e271990553a1d46",
                  name: "Loopy",
                  description: "scas",
                  slug: "loopy",
                },
                {
                  _id: "6793919d93e2f2a59f77b546",
                  name: "What-if Analysis",
                  description: "this is for a what if analysis implementation",
                  slug: "what-if-analysis",
                },
                {
                  _id: "678d4112c3ade34703e15195",
                  name: "Revamp ap",
                  description: "hey this is excel",
                  slug: "revamp-ap",
                },
                {
                  _id: "678f69fbcfa3b768a82d8ca6",
                  name: "Flexible Execution Time",
                  description: "jnbjg",
                  slug: "flexible-execution-time",
                },
              ],
              menuItems: [
                {
                  contentType: "User details",
                  _id: "67ac5d8fac0ff6e45502e6f1",
                  title: "why o why nau",
                  informationType: "david.ike-njoku@descasio.io",
                  userInformation: "pick the user email let me know",
                },
                {
                  contentType: "User details",
                  _id: "67ac5dd8ac0ff6e45502e71a",
                  title: "which kind wahala be this",
                  informationType: "2348038686694",
                  userInformation: "phone number reflecting and seeing it ",
                },
              ],
            },
            twoFactorAuthEnabled: false,
            enableCustomPortal: true,
            ssoEnabled: true,
            webhookEnabled: true,
            active: true,
            _id: "615ae60a3b0d9011ce1aecc9",
            user: "615ae60a3b0d9011ce1aecc8",
            __v: 0,
            createdAt: "2021-10-04T11:31:22.784Z",
            updatedAt: "2025-03-04T15:04:35.575Z",
            country: "NG",
            email: "busayo100@gmail.com",
            industry: "IT",
            name: "Descasio Inc",
            noOfEmployee: "51 - 100",
            slug: "descasio-inc-2",
            apiKeyDate: "2024-03-20T08:41:02.413Z",
            apiKey: "d231aaca-a40d-49d3-b658-e7d6ddc67621",
            id: "615ae60a3b0d9011ce1aecc9",
          },
          name: "test reuse",
          category: {
            _id: "64b65db8771c6bb33ee86fe1",
            name: "General",
            id: "64b65db8771c6bb33ee86fe1",
          },
          slug: "test-reuse",
          id: "67c59aea686c986eef407974",
        },
        workflow: "67c59aea686c986eef407976",
        account: "615ae60a3b0d9011ce1aecc9",
        user: {
          _id: "640b7e02c9b936457885113e",
          firstName: "David",
          lastName: "Ike-Njoku",
          id: "640b7e02c9b936457885113e",
        },
        task: {
          type: "EndTask",
          _id: "67c59b75686c986eef407a9c",
          id: "67c59b75686c986eef407a9c",
        },
        statusHistory: [
          {
            _id: "67c71170d58213001afa7d48",
            user: "640b7e02c9b936457885113e",
            status: "in-progress",
            date: "2025-03-04T14:42:56.214Z",
          },
          {
            _id: "67c71171d58213001afa7d52",
            user: null,
            status: "pending",
            date: "2025-03-04T14:42:57.000Z",
          },
          {
            _id: "67c71172d58213001afa7d5a",
            user: null,
            status: "in-progress",
            date: "2025-03-04T14:46:14.000Z",
          },
          {
            _id: "67c7124fcae3f1001aba881d",
            user: "640b7e02c9b936457885113e",
            status: "pending",
            date: "2025-03-04T14:46:39.000Z",
          },
          {
            _id: "67c71250cae3f1001aba882a",
            user: "640b7e02c9b936457885113e",
            status: "in-progress",
            date: "2025-03-04T14:46:40.000Z",
          },
          {
            _id: "67c71283cae3f1001aba8844",
            user: null,
            status: "in-progress",
            date: "2025-03-04T14:47:31.000Z",
          },
          {
            _id: "67c7128ccae3f1001aba8863",
            user: "640b7e02c9b936457885113e",
            status: "pending",
            date: "2025-03-04T14:47:40.000Z",
          },
          {
            _id: "67c7128ecae3f1001aba8873",
            user: "640b7e02c9b936457885113e",
            status: "in-progress",
            date: "2025-03-04T14:47:42.000Z",
          },
          {
            _id: "67c71298cae3f1001aba8890",
            user: null,
            status: "in-progress",
            date: "2025-03-04T14:47:52.000Z",
          },
          {
            _id: "67c7129fcae3f1001aba88b4",
            user: "640b7e02c9b936457885113e",
            status: "pending",
            date: "2025-03-04T14:47:59.000Z",
          },
          {
            _id: "67c712a0cae3f1001aba88c2",
            user: "640b7e02c9b936457885113e",
            status: "completed",
            date: "2025-03-04T14:48:00.000Z",
          },
        ],
        metadata: {
          "e05225d5-8c43-436d-8b0b-5f84d9d20b5d": "David Ike-Njoku",
          "fd724592-e278-4ade-b583-e2dfbd9f8219": "david.ike-njoku@descasio.io",
          "5dd45350-14b3-4e8c-883a-97db2901e48e": "des-001",
          "02ec0820-5cd5-4de0-b0c0-a1dc4926bc49": "SWE",
          "5232ea1b-dd4a-409f-b63b-305fa5f86fda": "2025-03-02",
          "4c2a0db1-4cea-4c3f-8127-1a6e086a6d44": "2025-03-14",
          "0f3b12ba-01e7-4522-8b4e-417e0f6e6ffe": "2025-03-02",
          "84aaaf28-7f35-4582-acf2-27c6805b220c": "2025-03-14",
          "be4a0a36-5852-4a28-bf8b-e4ce4c7289b0": "2025-03-02",
          "94f0a4fe-0493-4540-906b-f6b5ff27297e": "2025-03-14",
        },
        screenReuse: {
          "67c59aeb686c986eef40797a": {
            reuseOrder: [
              {
                id: "67c5ab1a686c986eef407ed8",
                taskId: "e78102bd-7a8e-479f-8972-049070aa48fd",
              },
              {
                id: "67c59b81686c986eef407ab2",
                taskId: "b5903b88-53df-4648-85f5-e5f3907f6093",
              },
              {
                id: "67c59b7e686c986eef407aa7",
                taskId: "5e3041d3-09ef-4170-a73e-5aab9980e222",
              },
            ],
          },
        },
        reusableFields: {
          "f7453692-87f9-454c-93ad-60311d998573": {
            name: "dateTime-1741003508377 >> Start",
            attribute: "readonly",
            value: "2025-03-02",
          },
          "a27063d5-dfdf-4ade-8fce-ef9b8b062606": {
            name: "dateTime-1741003508377 >> End",
            attribute: "readonly",
            value: "2025-03-14",
          },
          "ff191f8a-4ef0-42b4-b8ab-a4152647b5ad": {
            name: "dateTime-1741003508377 >> Duration",
            attribute: "readonly",
            value: null,
          },
          "67c70ff2bfc74f001a18e598": {
            name: "inputText-1741098993221",
            attribute: "readonly",
            value: null,
          },
        },
        approvalHistory: [],
        id: "67c71170d58213001afa7d47",
      },
      {
        status: "in-progress",
        createdAt: "2025-03-04T14:40:29.223Z",
        variables: [],
        active: true,
        _id: "67c710ddd58213001afa7cba",
        app: {
          active: true,
          deleted: false,
          _id: "67c59aea686c986eef407974",
          account: {
            customisations: {
              logo: {
                imageSource: "UPLOAD",
                imageUrl:
                  "https://storage.googleapis.com/test-plug-files/NNPC.png",
                altText: "custom_logo",
              },
              defaultEmailSender: {
                usePlugDefault: true,
                integrationId: null,
              },
              theme: {
                usePlugDefault: false,
                primaryColor: "#3DDB03",
              },
              organizationEmail: {
                isEnabled: true,
              },
              externalPage: {
                logo: {
                  imageSource: "NONE",
                },
                isEnabled: true,
                showCompanyLogo: true,
                showShortBio: true,
                showAboutUs: true,
                showPartnerLogo: true,
                showBlog: true,
                showNewsletter: true,
                showContactUs: true,
                showLinkProduct: true,
                showSocialMediaHandles: true,
                showCustomUrls: true,
              },
              internalPage: {
                logo: {
                  imageSource: "NONE",
                },
                theme: {
                  usePlugDefault: false,
                  primaryColor: "#FF0000",
                },
                isEnabled: true,
                organizationDetails: [
                  {
                    contentType: "External link",
                    _id: "679b3fe760c2b1fbe76313fa",
                    title: "Policy document",
                    linkText: "this is an external link",
                    linkUrl: "www.google.com",
                  },
                  {
                    contentType: "Documents",
                    _id: "67a386ddebbee86981e0282d",
                    title: "HMO document",
                    documentType: "Some iusers",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/a4.pdf",
                  },
                  {
                    contentType: "Documents",
                    _id: "67aeeb00a60c450a0b4a6155",
                    title: "Departmental Document",
                    documentType: "Office of HR",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/DSN_Voice_Data_Collection_Sample_Prompts_(3).pdf",
                  },
                  {
                    contentType: "Documents",
                    _id: "67aeeb21a60c450a0b4a6177",
                    title: "Organizational Document",
                    documentType: "Organisation Document",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/01_Adepoju_Samuel.pdf",
                  },
                ],
                personalDetails: [
                  {
                    contentType: "User details",
                    _id: "67aeec88a60c450a0b4a62a6",
                    title: "Fullname",
                    informationType: "Name",
                    userInformation: "Employee fullname",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeec5fa60c450a0b4a6266",
                    title: "Email",
                    informationType: "Email",
                    userInformation: "this is the user email",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeec49a60c450a0b4a6253",
                    title: "Role ",
                    informationType: "Role",
                    userInformation: "The role of the employee",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeeabfa60c450a0b4a6141",
                    title: "User ID",
                    informationType: "Employee ID",
                    userInformation: "Employee ID",
                  },
                ],
              },
              quickAccessApps: [
                {
                  _id: "675b0865c3fdac3b5dfef670",
                  name: "Som app a",
                  description: "something",
                  slug: "som-app-a",
                },
                {
                  _id: "67a9b46e8e271990553a1d46",
                  name: "Loopy",
                  description: "scas",
                  slug: "loopy",
                },
                {
                  _id: "6793919d93e2f2a59f77b546",
                  name: "What-if Analysis",
                  description: "this is for a what if analysis implementation",
                  slug: "what-if-analysis",
                },
                {
                  _id: "678d4112c3ade34703e15195",
                  name: "Revamp ap",
                  description: "hey this is excel",
                  slug: "revamp-ap",
                },
                {
                  _id: "678f69fbcfa3b768a82d8ca6",
                  name: "Flexible Execution Time",
                  description: "jnbjg",
                  slug: "flexible-execution-time",
                },
              ],
              menuItems: [
                {
                  contentType: "User details",
                  _id: "67ac5d8fac0ff6e45502e6f1",
                  title: "why o why nau",
                  informationType: "david.ike-njoku@descasio.io",
                  userInformation: "pick the user email let me know",
                },
                {
                  contentType: "User details",
                  _id: "67ac5dd8ac0ff6e45502e71a",
                  title: "which kind wahala be this",
                  informationType: "2348038686694",
                  userInformation: "phone number reflecting and seeing it ",
                },
              ],
            },
            twoFactorAuthEnabled: false,
            enableCustomPortal: true,
            ssoEnabled: true,
            webhookEnabled: true,
            active: true,
            _id: "615ae60a3b0d9011ce1aecc9",
            user: "615ae60a3b0d9011ce1aecc8",
            __v: 0,
            createdAt: "2021-10-04T11:31:22.784Z",
            updatedAt: "2025-03-04T15:04:35.575Z",
            country: "NG",
            email: "busayo100@gmail.com",
            industry: "IT",
            name: "Descasio Inc",
            noOfEmployee: "51 - 100",
            slug: "descasio-inc-2",
            apiKeyDate: "2024-03-20T08:41:02.413Z",
            apiKey: "d231aaca-a40d-49d3-b658-e7d6ddc67621",
            id: "615ae60a3b0d9011ce1aecc9",
          },
          name: "test reuse",
          category: {
            _id: "64b65db8771c6bb33ee86fe1",
            name: "General",
            id: "64b65db8771c6bb33ee86fe1",
          },
          slug: "test-reuse",
          id: "67c59aea686c986eef407974",
        },
        workflow: "67c59aea686c986eef407976",
        account: "615ae60a3b0d9011ce1aecc9",
        user: {
          _id: "640b7e02c9b936457885113e",
          firstName: "David",
          lastName: "Ike-Njoku",
          id: "640b7e02c9b936457885113e",
        },
        task: {
          properties: {
            screen: {
              type: "app",
              _id: "67c59aeb686c986eef40797a",
              name: "Screen 1",
              slug: "screen-1-445",
              id: "67c59aeb686c986eef40797a",
            },
          },
          type: "ScreenTask",
          _id: "67c59b81686c986eef407ab2",
          name: "screen twof",
          id: "67c59b81686c986eef407ab2",
        },
        statusHistory: [
          {
            _id: "67c710ddd58213001afa7cbb",
            user: "640b7e02c9b936457885113e",
            status: "in-progress",
            date: "2025-03-04T14:40:29.221Z",
          },
          {
            _id: "67c710ded58213001afa7cc5",
            user: null,
            status: "pending",
            date: "2025-03-04T14:40:30.000Z",
          },
          {
            _id: "67c710dfd58213001afa7ccd",
            user: null,
            status: "in-progress",
            date: "2025-03-04T14:41:40.000Z",
          },
          {
            _id: "67c71139d58213001afa7d04",
            user: "640b7e02c9b936457885113e",
            status: "pending",
            date: "2025-03-04T14:42:01.000Z",
          },
          {
            _id: "67c7113ad58213001afa7d28",
            user: "640b7e02c9b936457885113e",
            status: "in-progress",
            date: "2025-03-04T14:42:02.000Z",
          },
        ],
        metadata: {
          "e05225d5-8c43-436d-8b0b-5f84d9d20b5d": "David Ike-Njoku",
          "fd724592-e278-4ade-b583-e2dfbd9f8219": "david.ike-njoku@descasio.io",
          "5dd45350-14b3-4e8c-883a-97db2901e48e": "des-001",
          "02ec0820-5cd5-4de0-b0c0-a1dc4926bc49": "SWE",
          "5232ea1b-dd4a-409f-b63b-305fa5f86fda": "2025-03-02",
          "4c2a0db1-4cea-4c3f-8127-1a6e086a6d44": "2025-03-13",
        },
        screenReuse: {
          "67c59aeb686c986eef40797a": {
            reuseOrder: [
              {
                id: "67c59b7e686c986eef407aa7",
                taskId: "5e3041d3-09ef-4170-a73e-5aab9980e222",
              },
            ],
          },
        },
        reusableFields: {
          "f7453692-87f9-454c-93ad-60311d998573": {
            name: "dateTime-1741003508377 >> Start",
            attribute: "readonly",
            value: "2025-03-02",
          },
          "a27063d5-dfdf-4ade-8fce-ef9b8b062606": {
            name: "dateTime-1741003508377 >> End",
            attribute: "readonly",
            value: "2025-03-13",
          },
          "ff191f8a-4ef0-42b4-b8ab-a4152647b5ad": {
            name: "dateTime-1741003508377 >> Duration",
            attribute: "readonly",
            value: null,
          },
          "67c70ff2bfc74f001a18e598": {
            name: "inputText-1741098993221",
            attribute: "readonly",
            value: null,
          },
        },
        approvalHistory: [],
        id: "67c710ddd58213001afa7cba",
      },
      {
        status: "pending",
        createdAt: "2025-03-04T10:17:35.548Z",
        variables: [],
        active: true,
        _id: "67c6d33f1c0888001366f251",
        app: {
          active: true,
          deleted: false,
          _id: "67c057d5d03a46275b371192",
          account: {
            customisations: {
              logo: {
                imageSource: "UPLOAD",
                imageUrl:
                  "https://storage.googleapis.com/test-plug-files/NNPC.png",
                altText: "custom_logo",
              },
              defaultEmailSender: {
                usePlugDefault: true,
                integrationId: null,
              },
              theme: {
                usePlugDefault: false,
                primaryColor: "#3DDB03",
              },
              organizationEmail: {
                isEnabled: true,
              },
              externalPage: {
                logo: {
                  imageSource: "NONE",
                },
                isEnabled: true,
                showCompanyLogo: true,
                showShortBio: true,
                showAboutUs: true,
                showPartnerLogo: true,
                showBlog: true,
                showNewsletter: true,
                showContactUs: true,
                showLinkProduct: true,
                showSocialMediaHandles: true,
                showCustomUrls: true,
              },
              internalPage: {
                logo: {
                  imageSource: "NONE",
                },
                theme: {
                  usePlugDefault: false,
                  primaryColor: "#FF0000",
                },
                isEnabled: true,
                organizationDetails: [
                  {
                    contentType: "External link",
                    _id: "679b3fe760c2b1fbe76313fa",
                    title: "Policy document",
                    linkText: "this is an external link",
                    linkUrl: "www.google.com",
                  },
                  {
                    contentType: "Documents",
                    _id: "67a386ddebbee86981e0282d",
                    title: "HMO document",
                    documentType: "Some iusers",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/a4.pdf",
                  },
                  {
                    contentType: "Documents",
                    _id: "67aeeb00a60c450a0b4a6155",
                    title: "Departmental Document",
                    documentType: "Office of HR",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/DSN_Voice_Data_Collection_Sample_Prompts_(3).pdf",
                  },
                  {
                    contentType: "Documents",
                    _id: "67aeeb21a60c450a0b4a6177",
                    title: "Organizational Document",
                    documentType: "Organisation Document",
                    fileType: "pdf",
                    file: "https://storage.googleapis.com/test-plug-files/01_Adepoju_Samuel.pdf",
                  },
                ],
                personalDetails: [
                  {
                    contentType: "User details",
                    _id: "67aeec88a60c450a0b4a62a6",
                    title: "Fullname",
                    informationType: "Name",
                    userInformation: "Employee fullname",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeec5fa60c450a0b4a6266",
                    title: "Email",
                    informationType: "Email",
                    userInformation: "this is the user email",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeec49a60c450a0b4a6253",
                    title: "Role ",
                    informationType: "Role",
                    userInformation: "The role of the employee",
                  },
                  {
                    contentType: "User details",
                    _id: "67aeeabfa60c450a0b4a6141",
                    title: "User ID",
                    informationType: "Employee ID",
                    userInformation: "Employee ID",
                  },
                ],
              },
              quickAccessApps: [
                {
                  _id: "675b0865c3fdac3b5dfef670",
                  name: "Som app a",
                  description: "something",
                  slug: "som-app-a",
                },
                {
                  _id: "67a9b46e8e271990553a1d46",
                  name: "Loopy",
                  description: "scas",
                  slug: "loopy",
                },
                {
                  _id: "6793919d93e2f2a59f77b546",
                  name: "What-if Analysis",
                  description: "this is for a what if analysis implementation",
                  slug: "what-if-analysis",
                },
                {
                  _id: "678d4112c3ade34703e15195",
                  name: "Revamp ap",
                  description: "hey this is excel",
                  slug: "revamp-ap",
                },
                {
                  _id: "678f69fbcfa3b768a82d8ca6",
                  name: "Flexible Execution Time",
                  description: "jnbjg",
                  slug: "flexible-execution-time",
                },
              ],
              menuItems: [
                {
                  contentType: "User details",
                  _id: "67ac5d8fac0ff6e45502e6f1",
                  title: "why o why nau",
                  informationType: "david.ike-njoku@descasio.io",
                  userInformation: "pick the user email let me know",
                },
                {
                  contentType: "User details",
                  _id: "67ac5dd8ac0ff6e45502e71a",
                  title: "which kind wahala be this",
                  informationType: "2348038686694",
                  userInformation: "phone number reflecting and seeing it ",
                },
              ],
            },
            twoFactorAuthEnabled: false,
            enableCustomPortal: true,
            ssoEnabled: true,
            webhookEnabled: true,
            active: true,
            _id: "615ae60a3b0d9011ce1aecc9",
            user: "615ae60a3b0d9011ce1aecc8",
            __v: 0,
            createdAt: "2021-10-04T11:31:22.784Z",
            updatedAt: "2025-03-04T15:04:35.575Z",
            country: "NG",
            email: "busayo100@gmail.com",
            industry: "IT",
            name: "Descasio Inc",
            noOfEmployee: "51 - 100",
            slug: "descasio-inc-2",
            apiKeyDate: "2024-03-20T08:41:02.413Z",
            apiKey: "d231aaca-a40d-49d3-b658-e7d6ddc67621",
            id: "615ae60a3b0d9011ce1aecc9",
          },
          name: "My Docapp",
          category: {
            _id: "64b65db8771c6bb33ee86fe1",
            name: "General",
            id: "64b65db8771c6bb33ee86fe1",
          },
          slug: "my-docapp",
          id: "67c057d5d03a46275b371192",
        },
        workflow: "67c057d6d03a46275b371194",
        account: "615ae60a3b0d9011ce1aecc9",
        user: {
          _id: "615ae60a3b0d9011ce1aecc8",
          firstName: "Kala",
          lastName: "Pata",
          id: "615ae60a3b0d9011ce1aecc8",
        },
        task: {
          properties: {
            screen: {
              type: "document",
              _id: "67c058c4d03a46275b3711ca",
              name: "Document 1",
              slug: "document-1-35",
              id: "67c058c4d03a46275b3711ca",
            },
          },
          type: "ScreenTask",
          _id: "67c058dcd03a46275b3711f3",
          name: "DOC1",
          id: "67c058dcd03a46275b3711f3",
        },
        statusHistory: [
          {
            _id: "67c6d33f1c0888001366f252",
            user: "615ae60a3b0d9011ce1aecc8",
            status: "in-progress",
            date: "2025-03-04T10:17:35.547Z",
          },
          {
            _id: "67c6d3401c0888001366f25c",
            user: null,
            status: "pending",
            date: "2025-03-04T10:17:36.000Z",
          },
          {
            _id: "67c6d3411c0888001366f264",
            user: null,
            status: "in-progress",
            date: "2025-03-04T10:17:37.000Z",
          },
          {
            _id: "67c6d34a1c0888001366f282",
            user: "615ae60a3b0d9011ce1aecc8",
            status: "pending",
            date: "2025-03-04T10:17:47.000Z",
          },
          {
            _id: "67c6d3a91c0888001366f2b1",
            user: null,
            status: "pending",
            date: "2025-03-04T12:30:05.000Z",
          },
        ],
        metadata: {
          "e3cf116e-47da-4edf-8a0f-1bd8ea463a76": "Kala Pata",
          "b3605f71-6228-4c39-918b-033ed82aa711": "kallkenny@email.com",
          "86bd431e-3845-42ee-82f0-eca8bb860f59": "CTO",
        },
        approvalHistory: [],
        id: "67c6d33f1c0888001366f251",
      },
    ];

    if (sort) {
      if (sort === "asc" || sort === "desc") {
        records.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sort === "asc" ? dateA - dateB : dateB - dateA;
        });
      }
    }

    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
          pagination: {
            total_count: 728,
            per_page: 10,
            current: 0,
            current_page: `${process.env.REACT_APP_ENDPOINT}/workflow-instances/?population=%5B%7B%22path%22%3A%22approvalHistory%22%2C%22populate%22%3A%22task%22%7D%2C%7B%22path%22%3A%22app%22%2C%22populate%22%3A%7B%22path%22%3A%22category%22%2C%22select%22%3A%22name%22%7D%2C%22select%22%3A%22name%22%7D%2C%7B%22path%22%3A%22user%22%2C%22select%22%3A%22firstName+lastName%22%7D%2C%7B%22path%22%3A%22task%22%2C%22select%22%3A%22name+type%22%7D%5D&page=0&per_page=10`,
            next: 1,
            next_page: `${process.env.REACT_APP_ENDPOINT}/workflow-instances/?population=%5B%7B%22path%22%3A%22approvalHistory%22%2C%22populate%22%3A%22task%22%7D%2C%7B%22path%22%3A%22app%22%2C%22populate%22%3A%7B%22path%22%3A%22category%22%2C%22select%22%3A%22name%22%7D%2C%22select%22%3A%22name%22%7D%2C%7B%22path%22%3A%22user%22%2C%22select%22%3A%22firstName+lastName%22%7D%2C%7B%22path%22%3A%22task%22%2C%22select%22%3A%22name+type%22%7D%5D&page=1&per_page=10`,
          },
        },
        data: records,
      })
    );
  }
);

export const getSingleRecords = rest.get(
  `${process.env.REACT_APP_ENDPOINT}/workflow-instances/:id`,
  (req, res, ctx) => {
    const workflowInstanceId = req.params.id;
    return res(
      ctx.status(200),
      ctx.json({
        _meta: {
          status_code: 200,
          success: true,
        },
        data: {
          status: "pending",
          variables: [],
          active: true,
          _id: workflowInstanceId,
          app: {
            _id: "675b0865c3fdac3b5dfef670",
            name: "Som app a",
            description: "something",
            category: {
              _id: "66f29cdad7dfacc3d563f95e",
              name: "Software engineering",
              id: "66f29cdad7dfacc3d563f95e",
            },
            id: "675b0865c3fdac3b5dfef670",
          },
          workflow: {
            _id: "675b0865c3fdac3b5dfef672",
            tasks: [
              {
                data: {
                  label: "input node",
                },
                position: {
                  x: 468,
                  y: 186,
                },
                id: "f8e807a0-8911-421e-a81f-e9cc9adf6ea2",
                type: "StartTask",
              },
              {
                data: {
                  label: "output node",
                },
                position: {
                  x: 464,
                  y: 761,
                },
                id: "937ce611-2efa-4fc0-a5f2-b0a7bf379b3d",
                type: "EndTask",
              },
              {
                data: {
                  label: "[Not configured]",
                },
                position: {
                  x: 417,
                  y: 290,
                },
                type: "ScreenTask",
                id: "2787518a-20a8-4546-a9e1-122efe6f8a1d",
                name: "Leave REq screen",
                configured: true,
                screenType: "app",
              },
              {
                data: {
                  label: "[Not configured]",
                },
                position: {
                  x: 444,
                  y: 423,
                },
                type: "ApprovalTask",
                id: "9de6d23f-223d-4489-9172-43a6eeac97d8",
                name: "HR Approval",
                configured: true,
              },
              {
                style: {
                  strokeWidth: 2,
                  stroke: "#7d868b",
                },
                source: "f8e807a0-8911-421e-a81f-e9cc9adf6ea2",
                sourceHandle: null,
                target: "2787518a-20a8-4546-a9e1-122efe6f8a1d",
                targetHandle: null,
                animated: true,
                nodeId:
                  "reactflow__edge-f8e807a0-8911-421e-a81f-e9cc9adf6ea2null-2787518a-20a8-4546-a9e1-122efe6f8a1dnull",
                id: "reactflow__edge-f8e807a0-8911-421e-a81f-e9cc9adf6ea2null-2787518a-20a8-4546-a9e1-122efe6f8a1dnull",
              },
              {
                style: {
                  strokeWidth: 2,
                  stroke: "#7d868b",
                },
                source: "5df61cd6-c6f3-4748-aa1f-cf7714fe0d0c",
                sourceHandle: null,
                target: "9de6d23f-223d-4489-9172-43a6eeac97d8",
                targetHandle: "a",
                animated: true,
                nodeId:
                  "reactflow__edge-5df61cd6-c6f3-4748-aa1f-cf7714fe0d0cnull-9de6d23f-223d-4489-9172-43a6eeac97d8a",
                id: "reactflow__edge-5df61cd6-c6f3-4748-aa1f-cf7714fe0d0cnull-9de6d23f-223d-4489-9172-43a6eeac97d8a",
              },
              {
                data: {
                  label: "[Not configured]",
                },
                position: {
                  x: 172.4793576206501,
                  y: 576.9894495988237,
                },
                type: "MailTask",
                id: "9116c4a9-538d-42dc-b3da-3e2c01aae778",
                name: "Acceptance",
                configured: true,
              },
              {
                style: {
                  strokeWidth: 2,
                  stroke: "#7d868b",
                },
                source: "9de6d23f-223d-4489-9172-43a6eeac97d8",
                sourceHandle: "b",
                target: "9116c4a9-538d-42dc-b3da-3e2c01aae778",
                targetHandle: null,
                animated: true,
                label: null,
                nodeId:
                  "reactflow__edge-9de6d23f-223d-4489-9172-43a6eeac97d8b-9116c4a9-538d-42dc-b3da-3e2c01aae778null",
                id: "reactflow__edge-9de6d23f-223d-4489-9172-43a6eeac97d8b-9116c4a9-538d-42dc-b3da-3e2c01aae778null",
              },
              {
                data: {
                  label: "[Not configured]",
                },
                position: {
                  x: 770.4830276735175,
                  y: 614.7133028073845,
                },
                type: "MailTask",
                id: "d33bbaf6-5283-466f-88b4-8080bd5524e0",
                name: "refusal mail",
                configured: true,
              },
              {
                style: {
                  strokeWidth: 2,
                  stroke: "#7d868b",
                },
                source: "9de6d23f-223d-4489-9172-43a6eeac97d8",
                sourceHandle: "c",
                target: "d33bbaf6-5283-466f-88b4-8080bd5524e0",
                targetHandle: null,
                animated: true,
                label: null,
                nodeId:
                  "reactflow__edge-9de6d23f-223d-4489-9172-43a6eeac97d8c-d33bbaf6-5283-466f-88b4-8080bd5524e0null",
                id: "reactflow__edge-9de6d23f-223d-4489-9172-43a6eeac97d8c-d33bbaf6-5283-466f-88b4-8080bd5524e0null",
              },
              {
                style: {
                  strokeWidth: 2,
                  stroke: "#7d868b",
                },
                source: "d33bbaf6-5283-466f-88b4-8080bd5524e0",
                sourceHandle: null,
                target: "937ce611-2efa-4fc0-a5f2-b0a7bf379b3d",
                targetHandle: null,
                animated: true,
                nodeId:
                  "reactflow__edge-d33bbaf6-5283-466f-88b4-8080bd5524e0null-937ce611-2efa-4fc0-a5f2-b0a7bf379b3dnull",
                id: "reactflow__edge-d33bbaf6-5283-466f-88b4-8080bd5524e0null-937ce611-2efa-4fc0-a5f2-b0a7bf379b3dnull",
              },
              {
                style: {
                  strokeWidth: 2,
                  stroke: "#7d868b",
                },
                source: "9116c4a9-538d-42dc-b3da-3e2c01aae778",
                sourceHandle: null,
                target: "937ce611-2efa-4fc0-a5f2-b0a7bf379b3d",
                targetHandle: null,
                animated: true,
                nodeId:
                  "reactflow__edge-9116c4a9-538d-42dc-b3da-3e2c01aae778null-937ce611-2efa-4fc0-a5f2-b0a7bf379b3dnull",
                id: "reactflow__edge-9116c4a9-538d-42dc-b3da-3e2c01aae778null-937ce611-2efa-4fc0-a5f2-b0a7bf379b3dnull",
              },
              {
                style: {
                  strokeWidth: 2,
                  stroke: "#7d868b",
                },
                source: "2787518a-20a8-4546-a9e1-122efe6f8a1d",
                sourceHandle: null,
                target: "9de6d23f-223d-4489-9172-43a6eeac97d8",
                targetHandle: "a",
                animated: true,
                nodeId:
                  "reactflow__edge-2787518a-20a8-4546-a9e1-122efe6f8a1dnull-9de6d23f-223d-4489-9172-43a6eeac97d8a",
                id: "reactflow__edge-2787518a-20a8-4546-a9e1-122efe6f8a1dnull-9de6d23f-223d-4489-9172-43a6eeac97d8a",
              },
            ],
            name: "Index",
            id: "675b0865c3fdac3b5dfef672",
          },
          account: "615ae60a3b0d9011ce1aecc9",
          user: {
            _id: "62b1e8e6c3d82b1ddd3dec0f",
            firstName: "Mohammed",
            lastName: "Gberejaye",
            id: "62b1e8e6c3d82b1ddd3dec0f",
          },
          task: {
            type: "ApprovalTask",
            assignedTo: [
              {
                _id: "67635ebec3fdac3b5d0242f9",
                id: "ac223ce8-2e53-461b-afe0-e798c50063ad",
                name: "Initiator (email)",
                emailType: "Variable",
              },
            ],
            _id: "67635e9bc3fdac3b5d02423a",
            name: "HR Approval",
            id: "67635e9bc3fdac3b5d02423a",
          },
          statusHistory: [
            {
              _id: "6765651ab05df3e64437c477",
              user: "62b1e8e6c3d82b1ddd3dec0f",
              status: "in-progress",
              date: "2024-12-20T12:37:46.451Z",
            },
            {
              _id: "6765652db05df3e64437c4b6",
              user: "62b1e8e6c3d82b1ddd3dec0f",
              status: "pending",
              date: "2024-12-20T12:38:05.039Z",
            },
          ],
          createdAt: "2024-12-20T12:37:46.454Z",
          updatedAt: "2024-12-20T12:38:05.976Z",
          __v: 0,
          metadata: {
            "76359023-4674-4d3d-8a71-044918374b7b": "Mohammed Gberejaye",
            "12af9d1b-bf44-4f63-b27d-e6d665d9f557": "muhammad17gb@gmail.com",
            "24979759-8cd4-46a5-a02b-7015565146ab": "CTO",
          },
          taskStatus: [
            {
              _id: "6765651db05df3e64437c47c",
              workflowInstance: workflowInstanceId,
              task: {
                type: "StartTask",
                _id: "675b0866c3fdac3b5dfef681",
                id: "675b0866c3fdac3b5dfef681",
              },
              type: "StartTask",
              status: "successful",
              updatedAt: "2024-12-20T12:37:49.085Z",
              id: "6765651db05df3e64437c47c",
            },
            {
              _id: "67656521b05df3e64437c48d",
              workflowInstance: workflowInstanceId,
              status: "in-progress",
              task: {
                type: "ScreenTask",
                _id: "67635e46c3fdac3b5d0241d1",
                name: "Leave REq screen",
                id: "67635e46c3fdac3b5d0241d1",
              },
              updatedAt: "2024-12-20T12:37:53.627Z",
              id: "67656521b05df3e64437c48d",
            },
            {
              _id: "67656529b05df3e64437c4a4",
              task: {
                type: "ScreenTask",
                _id: "67635e46c3fdac3b5d0241d1",
                name: "Leave REq screen",
                id: "67635e46c3fdac3b5d0241d1",
              },
              workflowInstance: workflowInstanceId,
              status: "in-progress",
              updatedAt: "2024-12-20T12:38:01.645Z",
              id: "67656529b05df3e64437c4a4",
            },
            {
              _id: "6765652ab05df3e64437c4a8",
              workflowInstance: workflowInstanceId,
              task: {
                type: "ScreenTask",
                _id: "67635e46c3fdac3b5d0241d1",
                name: "Leave REq screen",
                id: "67635e46c3fdac3b5d0241d1",
              },
              type: "ScreenTask",
              status: "successful",
              updatedAt: "2024-12-20T12:38:02.364Z",
              id: "6765652ab05df3e64437c4a8",
            },
            {
              _id: "6765652db05df3e64437c4bc",
              workflowInstance: workflowInstanceId,
              task: {
                type: "ApprovalTask",
                _id: "67635e9bc3fdac3b5d02423a",
                name: "HR Approval",
                id: "67635e9bc3fdac3b5d02423a",
              },
              type: "ApprovalTask",
              status: "pending",
              updatedAt: "2024-12-20T12:38:05.456Z",
              id: "6765652db05df3e64437c4bc",
            },
          ],
          approvalHistory: [],
          id: workflowInstanceId,
        },
      })
    );
  }
);
