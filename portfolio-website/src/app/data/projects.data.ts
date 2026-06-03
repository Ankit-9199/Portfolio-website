import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    id: 'weave-ipp',
    name: 'Weave IPP (Integration Platform Planning)',
    description:
      'Large-scale supply chain system managing factory, store, and product pricing data. Built REST APIs integrated with dynamic Angular UI for real-time processing, data visualisation dashboards, secure admin authentication, and Docker-based deployment.',
    techStack: ['Angular', 'Python (Flask)', 'PostgreSQL', 'Docker'],
    repoUrl: '',
    featured: true,
  },
  {
    id: 'qc-pet-studies',
    name: 'QC Pet Studies',
    description:
      'Pet grooming and care platform. Developed responsive, customised UI components based on client requirements and improved user experience through modern frontend practices and optimised rendering.',
    techStack: ['Next.js'],
    repoUrl: '',
    featured: false,
  },
  {
    id: 'centralized-tuition-management',
    name: 'Centralized Tuition Management System',
    description:
      'Centralised platform to manage students, faculty, parents, and administrative operations. Implemented CRUD operations and role-based data management features.',
    techStack: ['Laravel', 'MySQL'],
    repoUrl: '',
    featured: false,
  },
  {
    id: 'smart-city-management',
    name: 'Smart City Management System',
    description:
      'City guide web application to manage and display information about amenities and services, enabling efficient data storage and retrieval for improved user accessibility.',
    techStack: ['Node.js', 'MongoDB'],
    repoUrl: '',
    featured: false,
  },
  {
    id: 'ecommerce-website',
    name: 'E-commerce Web Application',
    description:
      'Full-featured e-commerce platform with product management, order tracking, search functionality, authentication, cart management, and online payment features.',
    techStack: ['Django', 'MongoDB'],
    repoUrl: '',
    featured: false,
  },
];
