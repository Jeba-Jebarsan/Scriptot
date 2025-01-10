import React from 'react';
import type { Template } from '~/types/template';
import { STARTER_TEMPLATES } from '~/utils/constants';

interface FrameworkLinkProps {
  template: Template;
}

const FrameworkLink: React.FC<FrameworkLinkProps> = ({ template }) => (
  <a
    href={`/git?url=https://github.com/${template.githubRepo}.git`}
    data-state="closed"
    data-discover="true"
    className="flex flex-col gap-2 p-6 rounded-lg border border-bolt-elements-borderColor bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 transition-theme w-full"
  >
    <div className="flex items-center gap-2">
      <div className={`${template.icon} w-8 h-8`} />
      <h3 className="text-lg font-medium text-bolt-elements-textPrimary">{template.label}</h3>
    </div>
    <p className="text-sm text-bolt-elements-textSecondary">{template.description}</p>
    {template.tags && (
      <div className="flex flex-wrap gap-2 mt-auto">
        {template.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-800 text-bolt-elements-textSecondary"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </a>
);

const StarterTemplates: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-bolt-elements-textPrimary">Starter Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {STARTER_TEMPLATES.map((template) => (
          <FrameworkLink key={template.name} template={template} />
        ))}
      </div>
    </div>
  );
};

export default StarterTemplates;
