import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import useSWR from "swr";

// services
import projectService from "services/project.service";
import inboxService from "services/inbox.service";
// layouts
import { ProjectAuthorizationWrapper } from "layouts/auth-layout";
// helper
import { truncateText } from "helpers/string.helper";
// ui
import { PrimaryButton, SecondaryButton } from "components/ui";
import { BreadcrumbItem, Breadcrumbs } from "components/breadcrumbs";
// icons
import { PlusIcon } from "@heroicons/react/24/outline";
// types
import type { NextPage } from "next";
// fetch-keys
import { PROJECT_DETAILS, INBOX_LIST } from "constants/fetch-keys";

const ProjectJobs: NextPage = () => {
  const [analyticsModal, setAnalyticsModal] = useState(false);

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { data: projectDetails } = useSWR(
    workspaceSlug && projectId ? PROJECT_DETAILS(projectId as string) : null,
    workspaceSlug && projectId
      ? () => projectService.getProject(workspaceSlug as string, projectId as string)
      : null
  );

  const { data: inboxList } = useSWR(
    workspaceSlug && projectId ? INBOX_LIST(projectId as string) : null,
    workspaceSlug && projectId
      ? () => inboxService.getInboxes(workspaceSlug as string, projectId as string)
      : null
  );

  return (
    <ProjectAuthorizationWrapper
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbItem title="Projects" link={`/${workspaceSlug}/projects`} />
            <BreadcrumbItem
              title={`${truncateText(projectDetails?.name ?? "Project", 32)} Jobs`}
            />
          </Breadcrumbs>
        }
        bg="secondary"
      >
        <div className="h-full w-full flex flex-col">
          Dependancies
        </div>
      </ProjectAuthorizationWrapper>
  );
};

export default ProjectJobs;
