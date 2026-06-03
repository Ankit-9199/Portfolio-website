export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  repoUrl: string;
  demoUrl?: string;
  featured: boolean;
}
