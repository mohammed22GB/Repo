export {};

declare global {
  interface GoogleAuth {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
    authuser: string;
    prompt: string;
  }

  namespace Plug {
    interface Meta {
      status_code: number;
      success: boolean;
      token?: string;
      accessToken?: string;
      pagination?: {
        total_count: number;
        per_page: number;
        current: number;
        current_page: string;
        next: number;
        next_page: string;
      };
    }

    interface Account {
      _id: string;
      deleted: boolean;
      user: string;
      active: boolean;
      createdAt: string;
      updatedAt: string;
      country: string;
      email: string;
      industry: string;
      name: string;
      noOfEmployee: string;
      slug: string;
      twoFactorAuthEnabled: boolean;
      integrations: string[];
      totalApps: { total: number }[];
      totalUsers: { total: number }[];
    }

    interface LastLogin {
      time: Date;
      agent: string;
      ip: string;
      coordinate: string[];
      city: string;
      country: string;
    }

    type SocialAuthType =
      | "facebook"
      | "google"
      | "microsoft"
      | "sso"
      | "oauth"
      | (string & {});

    interface User {
      lastLogin: LastLogin;
      mobileVerified: boolean;
      emailVerified: boolean;
      roles: Array<string>;
      userGroups: Array<string>;
      passwordReset: boolean;
      changePassword: boolean;
      twoFactorAuthType: string;
      active: boolean;
      deleted?: boolean;
      _id: string;
      socialAuthType?: SocialAuthType;
      socialAuthId?: string;
      userType: string;
      firstName: string;
      lastName: string;
      email: string;
      account: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      password?: string;
      socialAuth?: boolean;
      mobile: string;
      id: string;
    }

    interface UserGroup {
      _id: string;
      account: any;
      user: any;
      name?: string;
      description?: string;
      type: "functional" | "generic";
      admins: string[];
      active: boolean;
      deleted?: boolean;
    }

    interface WorkflowInstance {
      _id: string;
      status: string;
      active: boolean;
      deleted: boolean;
      app: {
        _id: string;
        active: boolean;
        deleted: boolean;
        account: {
          customisations: {
            logo: {
              imageSource: string;
              imageUrl: string;
              altText: string;
            };
            defaultEmailSender: {
              usePlugDefault: boolean;
              integrationId: any;
            };
            theme: {
              usePlugDefault: boolean;
              primaryColor: string;
            };
            organizationEmail: {
              isEnabled: boolean;
            };
            externalPage: {
              logo: {
                imageSource: string;
              };
              isEnabled: boolean;
              showCompanyLogo: boolean;
              showShortBio: boolean;
              showAboutUs: boolean;
              showPartnerLogo: boolean;
              showBlog: boolean;
              showNewsletter: boolean;
              showContactUs: boolean;
              showLinkProduct: boolean;
              showSocialMediaHandles: boolean;
              showCustomUrls: boolean;
            };
            internalPage: {
              logo: {
                imageSource: string;
              };
              theme: {
                usePlugDefault: boolean;
                primaryColor: string;
              };
              isEnabled: boolean;
              organizationDetails: Array<{
                contentType: string;
                _id: string;
                title: string;
                linkText?: string;
                linkUrl?: string;
                documentType?: string;
                fileType?: string;
                file?: string;
              }>;
              personalDetails: Array<{
                contentType: string;
                _id: string;
                title: string;
                informationType: string;
                userInformation: string;
              }>;
            };
            quickAccessApps: Array<{
              _id: string;
              name: string;
              description: string;
              slug: string;
            }>;
            menuItems: Array<{
              contentType: string;
              _id: string;
              title: string;
              informationType: string;
              userInformation: string;
            }>;
          };
          twoFactorAuthEnabled: boolean;
          enableCustomPortal: boolean;
          ssoEnabled: boolean;
          webhookEnabled: boolean;
          active: boolean;
          _id: string;
          user: string;
          __v: number;
          createdAt: string;
          updatedAt: string;
          country: string;
          email: string;
          industry: string;
          name: string;
          noOfEmployee: string;
          slug: string;
          apiKeyDate: string;
          apiKey: string;
          id: string;
        };
        name: string;
        category: {
          _id: string;
          name: string;
          id: string;
        };
        slug: string;
        id: string;
      };
      user: {
        _id: string;
        firstName: string;
        lastName: string;
        id: string;
      };
      account: string;
      workflow: string;
      task: {
        properties: {
          screen: {
            type: string;
            _id: string;
            name: string;
            slug: string;
            id: string;
          };
        };
        type: string;
        _id: string;
        name: string;
        id: string;
      };
      statusHistory: Array<{
        _id: string;
        user: string;
        status: string;
        date: string;
      }>;
      createdAt: string;
      updatedAt: string;
      __v: number;
      metadata: Record<string, string>;
      taskStatus: {
        _id: string;
        active: boolean;
        deleted: boolean;
        app: string;
        workflowInstance: string;
        account: string;
        task: string;
        type: string;
        output: string;
        status: string;
        user: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        assignedTo: {
          assignedOn: number;
          _id: string;
          id: string;
          name: string;
          emailType: string;
          active: boolean;
        };
      };
      string: number;
      approvalHistory: Array<any>;
    }

    type Integration = {
      properties: {
        type: string;
        resources: Array<{
          name: string;
          _id?: string;
          columns?: Array<{
            name: string;
            fieldType: string;
            required: boolean;
          }>;
          id?: string;
        }>;
        connectionCredentials?: {
          url: string;
          scopes?: Array<string>;
          authType?: string;
        };
        userInfo?: {
          email: string;
          picture?: string;
          id?: string;
          verified_email?: boolean;
          sub?: string;
          name?: string;
          given_name?: string;
          family_name?: string;
          accounts?: Array<{
            account_id: string;
            is_default: boolean;
            account_name: string;
            base_uri: string;
          }>;
        };
        database?: string;
        tables?: Array<any>;
        webhookInfos?: Array<any>;
        docusignAccount?: string;
        tokenType?: string;
        expiryDate?: number;
      };
      type: string;
      disabled: boolean;
      active: boolean;
      _id: string;
      user: string;
      account: string;
      name: string;
      group?: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
      id: string;
    };
  }
}
