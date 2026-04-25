export type EmployeeGender = "male" | "female";

export type EmploymentStatus = "active" | "inactive" | "terminated";

export interface Employee {
  id?: string;
  employeeCode: string;
  firstName: string;
  fatherName?: string;
  gFatherName?: string;
  tin?: string;
  fan?: string;
  gender: EmployeeGender;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  hireDate?: string;
  employmentStatus: EmploymentStatus;
  departmentId?: string;
  positionId?: string;
}
