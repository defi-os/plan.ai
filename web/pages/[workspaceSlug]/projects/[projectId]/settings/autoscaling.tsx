import React,{useState} from "react";

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
import { EmptyState, IntegrationAndImportExportBanner } from "components/ui";
import {
  Input,
  TextArea,
  Loader,
  CustomSelect,
  DangerButton,
  Icon,
  PrimaryButton,
} from "components/ui";
import { ToggleSwitch } from "components/ui";
import { BreadcrumbItem, Breadcrumbs } from "components/breadcrumbs";
// icons
import { PlusIcon, PuzzlePieceIcon } from "@heroicons/react/24/outline";
// images
// types
import { IProject } from "types";
import type { NextPage } from "next";
// fetch-keys
import { PROJECT_DETAILS, WORKSPACE_INTEGRATIONS } from "constants/fetch-keys";
// helper
import { truncateText } from "helpers/string.helper";

const AutoscalingSettings: NextPage = () => {

  const [autoscalingToggle,setAutoscalingToggle]= useState(false)

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
            <ToggleSwitch value={autoscalingToggle} onChange={()=>setAutoscalingToggle(!autoscalingToggle)} size='lg'/>
          </div>
          <div className="flex flex-col gap-8 my-8">
            <div className="flex flex-col gap-1">
              <h4 className="text-sm">Project Name</h4>
              <Input
                id="name"
                name="name"
                className="!p-3 rounded-md font-medium"
                placeholder="Project Name"
                validations={{
                  required: "Name is required",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </ProjectAuthorizationWrapper>
  );
};

export default AutoscalingSettings;
