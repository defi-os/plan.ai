import React from "react";

import { useRouter } from "next/router";

import useSWR from "swr";

// layouts
import { ProjectAuthorizationWrapper } from "layouts/auth-layout";
// services
import IntegrationService from "services/integration";
import projectService from "services/project.service";
// components
import { SettingsSidebar, SingleIntegration } from "components/project";
// ui
import {
  EmptyState,
  IntegrationAndImportExportBanner,
  ToggleSwitch,
  Input,
  TextArea,
  Loader,
  CustomSelect,
  DangerButton,
  Icon,
  PrimaryButton,
  SecondaryButton,
} from "components/ui";
import { BreadcrumbItem, Breadcrumbs } from "components/breadcrumbs";
// icons
import { WalletOutlined } from "@mui/icons-material";
// images
import emptyIntegration from "public/empty-state/integration.svg";
// types
import { IProject } from "types";
import type { NextPage } from "next";
// fetch-keys
import { PROJECT_DETAILS, WORKSPACE_INTEGRATIONS } from "constants/fetch-keys";
// helper
import { truncateText } from "helpers/string.helper";

const BillingSettings: NextPage = () => {
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { data: projectDetails } = useSWR<IProject>(
    workspaceSlug && projectId ? PROJECT_DETAILS(projectId as string) : null,
    workspaceSlug && projectId
      ? () => projectService.getProject(workspaceSlug as string, projectId as string)
      : null
  );

  const { data: workspaceIntegrations } = useSWR(
    workspaceSlug ? WORKSPACE_INTEGRATIONS(workspaceSlug as string) : null,
    () =>
      workspaceSlug
        ? IntegrationService.getWorkspaceIntegrationsList(workspaceSlug as string)
        : null
  );

  return (
    <ProjectAuthorizationWrapper
      breadcrumbs={
        <Breadcrumbs>
          <BreadcrumbItem
            title={`${truncateText(projectDetails?.name ?? "Project", 32)}`}
            link={`/${workspaceSlug}/projects/${projectId}/issues`}
            linkTruncate
          />
          <BreadcrumbItem title="Billing Settings" unshrinkTitle />
        </Breadcrumbs>
      }
    >
      <div className="flex flex-row gap-2 h-full">
        <div className="w-80 pt-8 overflow-y-hidden flex-shrink-0">
          <SettingsSidebar />
        </div>
        <div className="pr-9 py-8 gap-10 w-full flex flex-col overflow-y-auto">
          <div className="flex w-full items-center justify-center gap-4">
            <WalletOutlined className="text-custom-primary-100 w-8 h-8 text-2xl" />
            <div className="text-2xl font-bold">Billing</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold">API Key</div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Enter your OpenAI API key</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Only OpenAI APIs are supported right now.
                  </p>
                </div>
              </div>
              <div className="w-[25%]">
                <Input
                  id="openAIApiKey"
                  name="openAiApiKey"
                  type="text"
                  className="!p-3 rounded-md font-medium"
                  placeholder="OpenAI API Key"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Check API usage</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    OpenAI APIs are used for all AI functions on plAn
                  </p>
                </div>
              </div>
              <div className="w-[15%]">
                <PrimaryButton className="w-full">Check</PrimaryButton>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold">On Ramp</div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Buy USDC</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Developers are paid through USDC that&apos;s stored in your custodial wallet.
                  </p>
                </div>
              </div>
              <div className="w-[15%]">
                <SecondaryButton className="w-full">Buy</SecondaryButton>
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Check USDC balance & Usage</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Check how your money is being used to get work done
                  </p>
                </div>
              </div>
              <div className="w-[15%]">
                <PrimaryButton className="w-full">Check</PrimaryButton>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold">Set Limits</div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Set Global Monthly Spending Limit</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Choose the maximum amount (in $) you want your company to
                    <br />
                    spend per month on plAn. Money exceeding this amount won&apos;t be used.
                  </p>
                </div>
              </div>
              <div className="w-[25%]">
                <Input
                  id="globalSpendingLimit"
                  name="globalSpendingLimit"
                  type="number"
                  className="!p-3 rounded-md font-medium"
                  placeholder="amount in $"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">
                    Set amount to receive receive recurring notifications on
                  </h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Every time you spend this much amount, we&apos;ll notify you with detailed stats
                    on what got done with your money. <br />
                    For example - 1000 will notify you every time you&apos;ve spent $1000 on plAn
                  </p>
                </div>
              </div>
              <div className="w-[25%]">
                <Input
                  id="amtToNotif"
                  name="AmtToNotif"
                  type="number"
                  className="!p-3 rounded-md font-medium"
                  placeholder="amount in $"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProjectAuthorizationWrapper>
  );
};

export default BillingSettings;
