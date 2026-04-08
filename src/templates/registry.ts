type TemplateOption = 'typescript' | 'testing' | 'packageManager' | 'git';

type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  dirPath: string;
  supportedOptions: TemplateOption[];
}

export const getTemplates = (template: string): TemplateMeta => {
  switch (template) {
    case 'express':
      return {
        id: 'express',
        name: 'Express',
        description: 'A minimal and flexible Node.js web application framework.',
        dirPath: 'templates/express',
        supportedOptions: ['typescript', 'testing', 'packageManager', 'git'],
      };
    case 'react':
      return {
        id: 'react',
        name: 'React',
        description: 'A JavaScript library for building user interfaces.',
        dirPath: 'templates/react',
        supportedOptions: ['typescript', 'testing', 'packageManager', 'git'],
      };
    case 'express-react':
      return {
        id: 'express-react',
        name: 'Express + React',
        description: 'A full-stack template combining Express and React.',
        dirPath: 'templates/express-react',
        supportedOptions: ['typescript', 'testing', 'packageManager', 'git'],
      };
    default:
      throw new Error(`Unknown template: ${template}`);
  }
}

export const listTemplates = (): TemplateMeta[] => {
/*
Returns all registered TemplateMeta objects
Used to populate the template prompt choices (currently hardcoded as
['react', 'express', 'fullstack'] in prompts.ts)
Could also drive a --list CLI flag to show available templates with descriptions
*/
  return ['express', 'react', 'express-react'].map(getTemplates);
}
