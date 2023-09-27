import React, { useState } from "react";

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
import { PlusIcon, PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { AutoAwesomeOutlined, AccountTreeOutlined, AttachMoneyOutlined    } from "@mui/icons-material";
// images
// types
import { IProject } from "types";
import type { NextPage } from "next";
// fetch-keys
import { PROJECT_DETAILS, WORKSPACE_INTEGRATIONS } from "constants/fetch-keys";
// helper
import { truncateText } from "helpers/string.helper";

const AutoscalingSettings: NextPage = () => {
  const [autoscalingToggle, setAutoscalingToggle] = useState(false);
  const [smartPrioritization, setSmartPrioritization] = useState(false);
  const [dependencyResolution, setDependencyResolution] = useState(false);
  const [taskAnonymization, setTaskAnonymization] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"USDC" | "project token">("USDC");
  const [distributionStrategy, setDistributionStrategy] = useState("recursive non-blocking");
  const [issueBuilder, setIssueBuilder] = useState("defi-os.com");
  const [candidatePicker, setCandidatePicker] = useState("GPT-4");
  const [incentiveAligner, setIncentiveAligner] = useState("GPT-3.5-Turbo-Instruct");

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
          <BreadcrumbItem title="Autoscaling Settings" unshrinkTitle />
        </Breadcrumbs>
      }
    >
      <div className="flex flex-row gap-2 h-full">
        <div className="w-80 pt-8 overflow-y-hidden flex-shrink-0">
          <SettingsSidebar />
        </div>
        <div className="pr-9 py-8 gap-10 w-full flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between pr-5 py-3.5 border-b border-custom-border-200">
            <h3 className="text-xl font-medium">Autoscaling</h3>
            <ToggleSwitch
              value={autoscalingToggle}
              onChange={() => setAutoscalingToggle(!autoscalingToggle)}
              size="lg"
            />
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex items-center w-full gap-8 justify-between">
              <div className="flex flex-col gap-3 w-full">
                <h4 className="text-sm">Max amount per job</h4>
                <Input
                  id="maxAmt"
                  name="maxAmt"
                  type="number"
                  className="!p-3 rounded-md font-medium"
                  placeholder="max amt/job"
                />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <h4 className="text-sm">Max number of concurrent job</h4>
                <Input
                  id="maxJobs"
                  name="maxJobs"
                  type="number"
                  className="!p-3 rounded-md font-medium"
                  placeholder="max number of concurrent jobs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-x-8 gap-y-2 border-b border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center p-3 rounded bg-custom-background-90">
                  <AutoAwesomeOutlined className="w-6 h-6" />
                </div>
                <div className="">
                  <h4 className="text-sm font-medium">Smart Prioritization</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    AI powered task scheduler
                  </p>
                </div>
              </div>
              <ToggleSwitch
                value={smartPrioritization}
                onChange={() => setSmartPrioritization(!smartPrioritization)}
                size="lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pr-5 py-3.5 border-b border-custom-border-200">
            <h3 className="text-xl font-medium">open source</h3>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border-b border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center p-3 rounded bg-custom-background-90">
                  <AccountTreeOutlined className="w-6 h-6" />
                </div>
                <div className="">
                  <h4 className="text-sm font-medium">Dependency Resolution</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    we will help you resolve your open source Dependencies
                  </p>
                </div>
              </div>
              <ToggleSwitch
                value={dependencyResolution}
                onChange={() => setDependencyResolution(!dependencyResolution)}
                size="lg"
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <h4 className="text-sm">Dependency depth</h4>
              <Input
                id="depDepth"
                name="DepDepth"
                type="number"
                className="!p-3 rounded-md font-medium"
                placeholder="dependency depth 1 to Max"
              />
            </div>

            <div className="flex items-center justify-between gap-x-8 gap-y-2 border-b border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center p-3 rounded bg-custom-background-90">
                  <AttachMoneyOutlined className="w-6 h-6" />
                </div>
                <div className="">
                  <h4 className="text-sm font-medium">Method of payment</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Pay using UDSC or project tokens
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                {paymentMethod === "USDC" && (
                  <>
                    <PrimaryButton className="w-7rem">USDC</PrimaryButton>
                    <SecondaryButton
                      className="w-7rem"
                      onClick={() => setPaymentMethod("project token")}
                    >
                      project token
                    </SecondaryButton>
                  </>
                )}
                {paymentMethod === "project token" && (
                  <>
                    <SecondaryButton className="w-7rem" onClick={() => setPaymentMethod("USDC")}>
                      USDC
                    </SecondaryButton>
                    <PrimaryButton className="w-7rem">project token</PrimaryButton>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center w-full gap-8 justify-between">
              <div className="flex flex-col gap-3 w-full">
                <h4 className="text-sm">Distribution Strategy</h4>
                <CustomSelect
                  value={distributionStrategy}
                  onChange={(e: any) => setDistributionStrategy(e.target.value)}
                  label={distributionStrategy ?? "Select Distribution Strategy"}
                  className="!border-custom-border-200 !shadow-none"
                  input
                >
                  <CustomSelect.Option className="w-full" value={"recursive non-blocking"}>
                    recursive non-blocking
                  </CustomSelect.Option>
                </CustomSelect>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <h4 className="text-sm">Issue Builder</h4>
                <CustomSelect
                  value={issueBuilder}
                  onChange={(e: any) => setIssueBuilder(e.target.value)}
                  label={issueBuilder ?? "Select Issue Builder"}
                  className="!border-custom-border-200 !shadow-none"
                  input
                >
                  <CustomSelect.Option className="w-full" value={"defi-os.com"}>
                    defi-os.com
                  </CustomSelect.Option>
                </CustomSelect>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pr-5 py-3.5 border-b border-custom-border-200">
            <h3 className="text-xl font-medium">privacy</h3>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border-b border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center p-3 rounded bg-custom-background-90">
                  <AccountTreeOutlined className="w-6 h-6" />
                </div>
                <div className="">
                  <h4 className="text-sm font-medium">Task Anonymization</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    we will help you create a synthetic copy of your issues without exposing
                    sensitive information using AI
                  </p>
                </div>
              </div>
              <ToggleSwitch
                value={taskAnonymization}
                onChange={() => setTaskAnonymization(!taskAnonymization)}
                size="lg"
              />
            </div>

            <div className="flex items-center w-full gap-8 justify-between">
              <div className="flex flex-col gap-3 w-full">
                <h4 className="text-sm">Candidate Picker</h4>
                <CustomSelect
                  value={candidatePicker}
                  onChange={(e: any) => setCandidatePicker(e.target.value)}
                  label={candidatePicker ?? "Select Candidate Picker"}
                  className="!border-custom-border-200 !shadow-none"
                  input
                >
                  <CustomSelect.Option className="w-full" value={"GPT-4"}>
                    GPT-4
                  </CustomSelect.Option>
                </CustomSelect>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <h4 className="text-sm">Incentive Aligner</h4>
                <CustomSelect
                  value={incentiveAligner}
                  onChange={(e: any) => setIncentiveAligner(e.target.value)}
                  label={incentiveAligner ?? "Select Incentive Aligner"}
                  className="!border-custom-border-200 !shadow-none"
                  input
                >
                  <CustomSelect.Option className="w-full" value={"GPT-3.5-Turbo-Instruct"}>
                    GPT-3.5-Turbo-Instruct
                  </CustomSelect.Option>
                </CustomSelect>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProjectAuthorizationWrapper>
  );
};

export default AutoscalingSettings;
