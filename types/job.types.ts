export interface Job {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  companyId?: number;
  country?: string;
  city?: string;
  educationLevel?: string;
  experienceLevel?: string;
  expirationDate?: string;
  fullyRemote?: boolean;
  jobLevel?: string;
  jobRole?: string;
  jobType?: string;
  minSalary?: number;
  maxSalary?: number;
  salaryType?: string;
  salary?: string;
  tags?: string;
  __v?: number;
}

export interface CreateJobDto {
  title: string;
  companyId?: number;
  country?: string;
  city?: string;
  educationLevel?: string;
  experienceLevel?: string;
  expirationDate?: string;
  fullyRemote?: boolean;
  jobLevel?: string;
  jobRole?: string;
  jobType?: string;
  minSalary?: string;
  maxSalary?: string;
  salaryType?: string;
  salary?: string;
  description: string;
  tags?: string;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}
