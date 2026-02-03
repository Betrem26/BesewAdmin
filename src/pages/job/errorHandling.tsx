import { CommonJob } from "./common-job.type";

export const handleSetCommonJob = (updatedCommonJob: CommonJob) => {
    // Perform error handling here
    const errors: string[] = [];

    // Check for empty or invalid values
    if (!updatedCommonJob.party_id) {
      errors.push('Party ID is required');
    }

    if (!updatedCommonJob.jobCategoryId) {
      errors.push('Job category ID is required');
    }

    if (!updatedCommonJob.jobCategory.name) {
      errors.push('Job category name is required');
    }

    if (!updatedCommonJob.jobId) {
      errors.push('Job ID is required');
    }

    if (!updatedCommonJob.jobName) {
      errors.push('Job name is required');
    }

    if (!updatedCommonJob.jobDescription) {
      errors.push('Job description is required');
    }

    // Handle competency array errors
    if (updatedCommonJob.competency.length === 0) {
      errors.push('At least one competency is required');
    }

    // Handle jobEnvironment array errors
    if (updatedCommonJob.jobEnvironment.length === 0) {
      errors.push('At least one job environment is required');
    }

    if (errors.length > 0) {
     
      return errors
    }

   
  };


