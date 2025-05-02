export interface Employee {
  roleId: number;
  empId: string; // Changed to string for UUID
  empName: string;
  empEmailId: string;
  empDesignationId: number;
  empContactNo: string;
  empAltContactNo: string;
  empPersonalEmailId: string;
  empExpTotalYear: number;
  empExpTotalMonth: number;
  empCity: string;
  empState: string;
  empPinCode: string;
  empAddress: string;
  empPerCity: string;
  empPerState: string;
  empPerPinCode: string;
  empPerAddress: string;
  password: string;
  ErpEmployeeSkills: EmployeeSkill[];
  ErmEmpExperiences: EmployeeExperience[];
}

export interface EmployeeSkill {
  empskillId: string;
  empId: string; // Changed to string for UUID
  skill: string;
  totalYearExp: number;
  lastVersionUsed: string;
}

export interface EmployeeExperience {
  empExpId: string;
  empId: string; // Changed to string for UUID
  companyName: string;
  startDate: string;
  endDate: string;
  designation: string;
  projectsWorkedon: string;
}