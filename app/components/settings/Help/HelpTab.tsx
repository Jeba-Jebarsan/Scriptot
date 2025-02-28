import React from 'react';

export default function HelpTab() {
  return (
    <div className="p-4 bg-bolt-elements-bg-depth-2 border border-bolt-elements-borderColor rounded-lg mb-4">
      <div className="space-y-6">
        {/* What is DeepGen Section */}
        <section>
          <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-3">What is DeepGen?</h3>
          <p className="text-sm text-bolt-elements-textSecondary mb-4">
            DeepGen is an AI-powered full-stack development tool designed to make building MVPs and SaaS products fast and effortless. It allows you to:
          </p>
          <ul className="list-disc list-inside text-sm text-bolt-elements-textSecondary mb-4 pl-2 space-y-1">
            <li>Prompt, run, edit, and deploy full-stack applications instantly.</li>
            <li>Install and run popular development tools and libraries, including npm and React.</li>
            <li>Share creations via URL without extra setup.</li>
            <li>Deploy directly to Netlify for fast and reliable hosting.</li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-bolt-elements-background-depth-1 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="i-ph:code text-bolt-elements-textPrimary" />
                <h4 className="text-sm font-medium text-bolt-elements-textPrimary">Full-Stack Development</h4>
              </div>
              <p className="text-sm text-bolt-elements-textSecondary">
                Generate complete web applications with AI assistance, including both front-end and back-end code.
              </p>
            </div>
            <div className="p-3 bg-bolt-elements-background-depth-1 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="i-ph:github-logo text-bolt-elements-textPrimary" />
                <h4 className="text-sm font-medium text-bolt-elements-textPrimary">GitHub Integration</h4>
              </div>
              <p className="text-sm text-bolt-elements-textSecondary">
                Seamlessly upload generated code directly to GitHub for version control and collaboration.
              </p>
            </div>
            <div className="p-3 bg-bolt-elements-background-depth-1 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="i-ph:cloud-arrow-up text-bolt-elements-textPrimary" />
                <h4 className="text-sm font-medium text-bolt-elements-textPrimary">Netlify Deployment</h4>
              </div>
              <p className="text-sm text-bolt-elements-textSecondary">
                Deploy your applications to Netlify with a single click for seamless hosting.
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
                <li>Deploy to Netlify for hosting</li>
                <li>Make adjustments and iterate as needed</li>
              </ol>
            </div>
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Getting Your Netlify Token</h4>
              <ol className="list-decimal list-inside text-sm text-bolt-elements-textSecondary space-y-2">
                <li>Go to <a href="https://app.netlify.com/" target="_blank" rel="noopener noreferrer" className="text-bolt-elements-textLink hover:underline">Netlify</a></li>
                <li>Navigate to <strong>User Settings</strong> &gt; <strong>Applications</strong></li>
                <li>Click on <strong>New access token</strong></li>
                <li>Give your token a descriptive name and generate it</li>
                <li>Copy and securely store your token, as it won't be shown again</li>
              </ol>
            </div>
            <div>
              <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Tips for Better Results</h4>
              <ul className="list-disc list-inside text-sm text-bolt-elements-textSecondary space-y-2">
                <li>Provide detailed project requirements</li>
                <li>Use the enhance prompt feature for optimized results</li>
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
              <h4 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">Common Issues & Solutions</h4>
              <ul className="list-disc list-inside text-sm text-bolt-elements-textSecondary space-y-2">
                <li><strong>If code generation fails</strong>, try providing more detailed requirements</li>
                <li><strong>For large projects</strong>, break them down into smaller components</li>
                <li><strong>Check your API keys</strong> if using custom providers</li>
                <li><strong>If deployment fails</strong>, ensure your project has the correct build settings for Netlify</li>
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
