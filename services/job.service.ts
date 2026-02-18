import axios from "@/lib/axios";
import { Job, CreateJobDto, UpdateJobDto } from "@/types/job.types";

export const getJobs = async (id: string): Promise<Job[]> => {
  console.log('getjobs',id)
  const { data } = await axios.get<Job[]>(`/jobs/${id}`);
  return data;
};

export const getJobById = async (id: string): Promise<Job> => {
  const { data } = await axios.get<Job>(`/jobs/viewOne/${id}`);
  return data;
};

export const createJob = async (payload: CreateJobDto): Promise<Job> => {
  console.log('create')
  const { data } = await axios.post<Job>("/jobs", payload);
  return data;
};

export const updateJob = async (
  id: string,
  payload: UpdateJobDto
): Promise<Job> => {
  const { data } = await axios.put<Job>(`/jobs/${id}`, payload);
  return data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await axios.delete(`/jobs/${id}`);
};
