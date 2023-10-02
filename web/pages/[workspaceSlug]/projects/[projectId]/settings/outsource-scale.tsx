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
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
// images
// types
import { IProject } from "types";
import type { NextPage } from "next";
// fetch-keys
import { PROJECT_DETAILS, WORKSPACE_INTEGRATIONS } from "constants/fetch-keys";
// helper
import { truncateText } from "helpers/string.helper";

const OutsourceScaleSettings: NextPage = () => {
  const [autoscalingToggle, setAutoscalingToggle] = useState(false);
  const [smartPrioritization, setSmartPrioritization] = useState(false);
  const [dependencyResolution, setDependencyResolution] = useState(false);
  const [taskAnonymization, setTaskAnonymization] = useState(false);

  const [candidatePicker, setCandidatePicker] = useState("GPT-4");

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
          <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center p-3 rounded bg-custom-background-90">
                <WrenchScrewdriverIcon className="text-custom-primary-100 w-6 h-6" />
              </div>
              <div className="">
                <h4 className="text-sm font-medium">Outsource & Scale</h4>
                <p className="text-sm text-custom-text-200 tracking-tight">
                  Outsource & Scale is enabled for all the projects in this workspace. Access them
                  from the sidebar.
                </p>
              </div>
            </div>
            <ToggleSwitch
              value={autoscalingToggle}
              onChange={() => setAutoscalingToggle(!autoscalingToggle)}
              size="lg"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold">Set Limits</div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Maximum amount per task</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Choose the maximum amount (in $) you want to spend for each task to be solved.
                    <br />
                    This can always be adjusted.
                  </p>
                </div>
              </div>
              <div className="w-[25%]">
                <Input
                  id="maxAmt"
                  name="maxAmt"
                  type="number"
                  className="!p-3 rounded-md font-medium"
                  placeholder="max amt/job"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Maximum number of concurrent tasks</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Choose the amount of tasks that can be outsourced at any point of time
                  </p>
                </div>
              </div>
              <div className="w-[25%]">
                <Input
                  id="maxJobs"
                  name="maxJobs"
                  type="number"
                  className="!p-3 rounded-md font-medium"
                  placeholder="max number of concurrent jobs"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Smart Prioritization</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Let Plan&apos;s AI prioritize outsourcing your most important issues instead of
                    outsourcing your tasks chronologically
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

          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold">Open Source</div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Dependency Resolution</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Let Plan&apos;s AI automatically check, create issues & outsource them as tasks
                    for all broken dependencies on your codebase
                  </p>
                </div>
              </div>
              <ToggleSwitch
                value={dependencyResolution}
                onChange={() => setDependencyResolution(!dependencyResolution)}
                size="lg"
              />
            </div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Funding Amount</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Choose the funding for each dependency resolution tasks created for your &/or
                    external codebases
                  </p>
                </div>
              </div>
              <div className="w-[25%]">
                <Input
                  id="fundingAmt"
                  name="fundingAmt"
                  type="number"
                  className="!p-3 rounded-md font-medium"
                  placeholder="max number of concurrent jobs"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Dependency Depth</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Choose the number of dependencies that should be checked for at all times
                  </p>
                </div>
              </div>
              <div className="w-[25%]">
                <Input
                  id="depDepth"
                  name="DepDepth"
                  type="number"
                  className="!p-3 rounded-md font-medium"
                  placeholder="dependency depth 1 to Max"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold">Privacy</div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Code Anonymization</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    Let Plan&apos;s AI automatically anonymize your code before sending the task
                    over to freelancers
                  </p>
                </div>
              </div>
              <ToggleSwitch
                value={taskAnonymization}
                onChange={() => setTaskAnonymization(!taskAnonymization)}
                size="lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold">Outsourced Developer Picker</div>
            <div className="flex items-center justify-between gap-x-8 gap-y-2 border rounded-lg border-custom-border-200 bg-custom-background-100 p-4">
              <div className="flex items-start gap-3">
                <div className="">
                  <h4 className="text-sm font-medium">Select AI model</h4>
                  <p className="text-sm text-custom-text-200 tracking-tight">
                    While the most advanced models are usually great for code anonymization,
                    selecting viable & skilled developers can be achieved with a less advanced &
                    cheaper model.
                  </p>
                </div>
              </div>
              <CustomSelect
                value={candidatePicker}
                onChange={(e: any) => setCandidatePicker(e.target.value)}
                label={candidatePicker ?? "Select Candidate Picker"}
                className="!border-custom-border-200 w-[25%] !shadow-none"
                input
              >
                <CustomSelect.Option className="w-full" value={"GPT-4"}>
                  GPT-4
                </CustomSelect.Option>
              </CustomSelect>
            </div>
          </div>

          <div className="text-md underline w-full flex items-center justify-center">
            Already outsourcing to external developers?
            <br /> Send us their details and we&apos;ll onboard them!
          </div>
        </div>
      </div>
    </ProjectAuthorizationWrapper>
  );
};

export default OutsourceScaleSettings;
