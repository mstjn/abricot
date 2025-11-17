export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface ProfileResponse {
  data?: {
    user?: User;
  };
}

export interface AssignedTasksResponse {
  success: boolean;
  message: string;
  data: {
    tasks: Task[];
  };
}

export interface ProjectsResponse {
 success: boolean;
  message: string;
  data: {
    projects: Project[];
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  tasks?: Task[];
  _count? : Count
  createdAt: string;
  updatedAt: string;
}

interface Count {
  tasks : number
}

export type ProjectRole = "CONTRIBUTOR" | "ADMIN"

export interface ProjectMember {
  id: string;
  role: ProjectRole;
  user: User;
  joinedAt: string; 
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  creatorId: string;
  assignees: TaskAssignee[];
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskAssignee {
  id: string;
  userId: string;
  taskId: string;
  user: User;
  assignedAt: string;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskProjectItem {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | Date;
  commentsCount: number;
  projectName: string;
}
