import React from 'react';

export default function HelpTab() {
  return (
    <div className="p-4 bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor rounded-lg mb-4">
      <div className="space-y-6">
        {/* What is CodeIQ Section */}
        <section>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-3">What is CodeIQ?</h3>
          <p className="text-sm text-bolt-elements-textSecondary mb-4">
            CodeIQ is an AI-powered full-stack development tool that helps you create web applications effortlessly.
            Generate both front-end and back-end code, upload directly to GitHub for version control, and soon self-host
            your applications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-bolt-elements-background-depth-1 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="i-ph:code text-bolt-elements-textPrimary" />
                <h4 className="text-sm font-medium text-bolt-elements-textPrimary">Full-Stack Development</h4>
              </div>
              <p className="text-sm text-bolt-elements-textSecondary">
                Generate complete web applications with both front-end and back-end code using AI assistance.
              </p>
            </div>
            <div className="p-3 bg-bolt-elements-background-depth-1 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="i-ph:github-logo text-bolt-elements-textPrimary" />
                <h4 className="text-sm font-medium text-bolt-elements-textPrimary">GitHub Integration</h4>
              </div>
              <p className="text-sm text-bolt-elements-textSecondary">
                Upload generated code directly to GitHub for version control and collaboration.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-3">Getting Started</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Creating Your First Project</h4>
              <ol className="list-decimal list-inside text-sm text-bolt-elements-textSecondary space-y-2">
                <li>Enter your project description or select from templates</li>
                <li>Let the AI generate your project code</li>
                <li>Download the code or upload directly to GitHub</li>
                <li>Make adjustments and iterate as needed</li>
              </ol>
            </div>
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Tips for Better Results</h4>
              <ul className="list-disc list-inside text-sm text-bolt-elements-textSecondary space-y-2">
                <li>Provide detailed project requirements</li>
                <li>Use the enhance prompt feature</li>
                <li>Start with basic structure before adding complex features</li>
                <li>Combine related tasks into single prompts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-3">Troubleshooting</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Common Issues</h4>
              <ul className="list-disc list-inside text-sm text-bolt-elements-textSecondary space-y-2">
                <li>If code generation fails, try providing more detailed requirements</li>
                <li>For large projects, break them down into smaller components</li>
                <li>Check your API keys if using custom providers</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-3">Additional Resources</h3>
          <div className="space-y-3">
            <a
              href="https://github.com/stackblitz-labs/bolt.diy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-bolt-elements-textPrimary hover:text-bolt-elements-textSecondary transition-colors"
            >
              <div className="i-ph:github-logo" />
              GitHub Repository
            </a>
            <a
              href="https://thinktank.ottomator.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-bolt-elements-textPrimary hover:text-bolt-elements-textSecondary transition-colors"
            >
              <div className="i-ph:users" />
              Community Chat
            </a>
            <a
              href="mailto:jebajebarsan4@gmail.com"
              className="flex items-center gap-2 text-sm text-bolt-elements-textPrimary hover:text-bolt-elements-textSecondary transition-colors"
            >
              <div className="i-ph:envelope" />
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
