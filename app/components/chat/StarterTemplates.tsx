import React, { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

interface StarterTemplatesProps {
  onTemplateSelect?: (prompt: string) => void;
  setImageDataList?: React.Dispatch<React.SetStateAction<string[]>>;
  imageDataList?: string[];
  setUploadedFiles?: React.Dispatch<React.SetStateAction<File[]>>;
  uploadedFiles?: File[];
}

const StarterTemplates: React.FC<StarterTemplatesProps> = ({ onTemplateSelect, setImageDataList, imageDataList = [], setUploadedFiles, uploadedFiles = [] }) => {
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string | React.ReactElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const examples = [
    {
      image: '/ex1.png',
      alt: '',
      title: 'Real Estate Landing Page Template'
    },
    {
      image: '/ex2.png',
      alt: '',
      title: 'Tech Company Landing Page Template'
    },
    {
      image: '/ex3.png',
      alt: '',
      title: 'Developer Portfolio Template'
    },
    {
      image: '/ex4.jpg',
      alt: '',
      title: 'Modern SaaS Tech Website Template'
    },
    {
      image: '/ex5.jpg',
      alt: '',
      title: 'Professional Analytics Dashboard Template'
    },
    {
      image: '/ex6.jpg',
      alt: '',
      title: 'Cryptocurrency Dashboard Template'
    },
    {
      image: '/ex7.jpg',
      alt: '',
      title: 'Modern Blog Website Template'
    },
    {
      image: '/ex8.jpg',
      alt: '',
      title: 'Professional Resume Template'
    },
    {
      image: '/ex9.jpg',
      alt: '',
      title: 'Modern Pricing Plan Template'
    },
    {
      image: '/ex10.jpg',
      alt: '',
      title: 'Beautiful Pricing Page Template'
    },
    {
      image: '/ex11.1.jpg',
      alt: '',
      title: 'Beautiful Authentication UI Template'
    }
  ];

  const displayedTemplates = showAllTemplates ? examples : examples.slice(0, isMobile ? 3 : 6);

  const handleDirectTemplateClick = (template: { title: string, image: string }) => {
    // Create and set the editable prompt
    const editablePrompt = `Create a ${template.title.toLowerCase()}:

Project Requirements:
- Create a modern and responsive design
- Implement user-friendly interface with smooth interactions
- Follow accessibility best practices (WCAG guidelines)
- Use clean code architecture and best practices
- Ensure cross-browser compatibility
- Implement responsive design for all screen sizes

Design Requirements:
- Match the provided template design style
- Use modern UI/UX patterns
- Include smooth transitions and animations
- Implement proper spacing and typography
- Ensure visual hierarchy and readability

Technical Requirements:
- Use modern frontend frameworks/libraries
- Implement component-based architecture
- Include proper error handling
- Add loading states and feedback
- Optimize performance and load times

Additional Notes:
- Reference image provided for design inspiration
- Feel free to enhance or modify these requirements
- Consider adding any relevant features for this type of project

Please review and modify these requirements before proceeding.`;

    // Process the image for upload
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = template.image;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `template-${Date.now()}.png`, { type: 'image/png' });
            
            if (setImageDataList && setUploadedFiles) {
              setUploadedFiles([...uploadedFiles, file]);
              setImageDataList([...imageDataList, canvas.toDataURL('image/png')]);
            }
          }
        }, 'image/png');
      }
    };

    // Create the preview modal content with both image and prompt
    const modalContent = (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
          <button
            onClick={() => setPreviewTemplate(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <div className="i-ph:x text-xl" />
          </button>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6 p-6`}>
            {/* Template Image */}
            <div className={`w-full ${isMobile ? '' : 'md:w-1/2'}`}>
              <img src={template.image} alt="Template Preview" className="w-full h-auto rounded-lg" />
            </div>
            
            {/* Template Details and Prompt */}
            <div className={`w-full ${isMobile ? '' : 'md:w-1/2'} flex flex-col gap-4`}>
              <h3 className="text-2xl font-semibold text-bolt-elements-textPrimary">{template.title}</h3>
              
              <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-auto">
                <pre className="whitespace-pre-wrap text-sm text-bolt-elements-textSecondary">
                  {editablePrompt}
                </pre>
              </div>
              
              {/* Action Buttons */}
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 mt-4`}>
                <button
                  onClick={() => {
                    if (onTemplateSelect) {
                      onTemplateSelect(editablePrompt);
                      setPreviewTemplate(null);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-md transition-all duration-200"
                >
                  Start Building with this Template
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 border border-bolt-elements-borderColor rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    // Set the preview modal content
    setPreviewTemplate(modalContent);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-7xl mx-auto px-4">
      <div className="flex flex-col items-center w-full">
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8 w-full`}>
          {displayedTemplates.map((example, index) => (
            <div 
              key={index}
              className="flex flex-col rounded-lg border border-bolt-elements-borderColor hover:border-bolt-elements-borderColor-hover transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={example.image}
                  alt={example.alt}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-900">
                <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">{example.title}</h3>
                <p className="text-sm text-bolt-elements-textSecondary mb-4">{example.alt}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDirectTemplateClick(example)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-md transition-all duration-200"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {examples.length > (isMobile ? 3 : 6) && (
          <button
            onClick={() => setShowAllTemplates(!showAllTemplates)}
            className="group relative mt-8 mb-12 px-12 py-4 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <span className="relative flex items-center gap-2">
              {showAllTemplates ? (
                <>
                  Show Less
                  <div className="i-ph:arrow-up text-lg animate-bounce" />
                </>
              ) : (
                <>
                  Show More
                  <div className="i-ph:arrow-down text-lg animate-bounce" />
                </>
              )}
            </span>
          </button>
        )}

        {/* Divider Line */}
        <div className="w-full max-w-4xl mx-auto my-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm" />
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-12 w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-bolt-elements-textPrimary text-center mb-6">
            Watch How It Works
          </h2>
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
            <div className="aspect-w-16 aspect-h-9">
              <video
                controls
                className="w-full h-full object-cover"
                poster="/net.png"
                style={{
                  backgroundColor: '#000000',
                  '--video-bg': '#000000'
                } as React.CSSProperties}
              >
                <source src="/video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-full max-w-4xl mx-auto my-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm" />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
            </div>
          </div>
          {/* Built with Tools Developers Love Section */}
          <div className="mt-16 w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-8">
              <div className="relative">
                <h2 className="text-3xl font-bold text-bolt-elements-textPrimary text-center z-10 relative">
                  Built with Tools Developers Love
                </h2>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
              
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Tool card 1 */}
                <div className="bg-bolt-elements-bg-depth-3 rounded-xl p-6 border border-bolt-elements-borderColor hover:border-purple-500/50 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-bolt-elements-bg-depth-2 rounded-full flex items-center justify-center shadow-inner">
                      <div className="i-ph:code-bold text-purple-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-bolt-elements-textPrimary">Modern Stack</h3>
                  </div>
                  <p className="text-bolt-elements-textSecondary">
                    Crafted with Next.js, React, and cutting-edge tools that developers rely on for scalable applications.
                  </p>
                </div>
                
                {/* Tool card 2 */}
                <div className="bg-bolt-elements-bg-depth-3 rounded-xl p-6 border border-bolt-elements-borderColor hover:border-blue-500/50 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-bolt-elements-bg-depth-2 rounded-full flex items-center justify-center shadow-inner">
                      <div className="i-ph:package-bold text-blue-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-bolt-elements-textPrimary">Auto-Install</h3>
                  </div>
                  <p className="text-bolt-elements-textSecondary">
                    DeepGen automatically installs packages, freeing you from dependency management.
                  </p>
                </div>
                
                {/* Tool card 3 */}
                <div className="bg-bolt-elements-bg-depth-3 rounded-xl p-6 border border-bolt-elements-borderColor hover:border-green-500/50 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-bolt-elements-bg-depth-2 rounded-full flex items-center justify-center shadow-inner">
                      <div className="i-ph:database-bold text-green-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-bolt-elements-textPrimary">Supabase Backend</h3>
                  </div>
                  <p className="text-bolt-elements-textSecondary">
                    Supabase powers the backend, providing easy authentication, database, and storage setup.
                  </p>
                </div>
                
                {/* Tool card 4 */}
                <div className="bg-bolt-elements-bg-depth-3 rounded-xl p-6 border border-bolt-elements-borderColor hover:border-amber-500/50 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-bolt-elements-bg-depth-2 rounded-full flex items-center justify-center shadow-inner">
                      <div className="i-ph:lightning-bold text-amber-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-bolt-elements-textPrimary">Instant Preview</h3>
                  </div>
                  <p className="text-bolt-elements-textSecondary">
                    See your changes in action instantly with live preview and hot reloading.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Code is Yours Section */}
          <div className="mt-24 w-full max-w-4xl mx-auto">
            <div className="bg-bolt-elements-bg-depth-2 rounded-2xl overflow-hidden border border-bolt-elements-borderColor shadow-xl">
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12">
                  {/* Text content */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className="relative inline-block mb-6">
                      <h2 className="text-3xl font-bold text-bolt-elements-textPrimary">
                        The Code is Yours
                      </h2>
                      <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-bolt-elements-button-primary-background flex items-center justify-center">
                          <div className="i-ph:check text-xs text-white" />
                        </div>
                        <p className="text-bolt-elements-textSecondary">
                          Download full source code with a single click
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-bolt-elements-button-primary-background flex items-center justify-center">
                          <div className="i-ph:check text-xs text-white" />
                        </div>
                        <p className="text-bolt-elements-textSecondary">
                          Full ownership rights to use in commercial projects
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-bolt-elements-button-primary-background flex items-center justify-center">
                          <div className="i-ph:check text-xs text-white" />
                        </div>
                        <p className="text-bolt-elements-textSecondary">
                          No attribution required, build your brand freely
                        </p>
                      </div>
                    </div>
                    
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-textPrimary rounded-lg transition-colors w-full md:w-auto">
                      <div className="i-ph:download-simple-bold" />
                      Download Source Code
                    </button>
                  </div>
                  
                  {/* Code preview */}
                  <div className="w-full md:w-1/2">
                    <div className="bg-bolt-elements-bg-depth-3 rounded-lg overflow-hidden border border-bolt-elements-borderColor shadow-lg">
                      <div className="bg-bolt-elements-bg-depth-1 p-2 flex items-center gap-2 border-b border-bolt-elements-borderColor">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs text-bolt-elements-textSecondary mx-auto">App.jsx</div>
                      </div>
                      <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        <pre className="text-sm">
                          <code>
                            <div className="flex">
                              <span className="text-purple-400">import</span> <span className="text-white">{'{'}</span> <span className="text-green-400">useState</span> <span className="text-white">{'}'}</span> <span className="text-purple-400">from</span> <span className="text-orange-300">'react'</span><span className="text-white">;</span>
                            </div>
                            <div className="mt-4"></div>
                            <div className="flex">
                              <span className="text-purple-400">export</span> <span className="text-purple-400">default</span> <span className="text-blue-400">function</span> <span className="text-yellow-300">App</span><span className="text-white">() {'{'}</span>
                            </div>
                            <div className="ml-4">
                              <span className="text-purple-400">const</span> <span className="text-white">[</span><span className="text-yellow-300">count</span><span className="text-white">, </span><span className="text-yellow-300">setCount</span><span className="text-white">] = </span><span className="text-blue-400">useState</span><span className="text-white">(</span><span className="text-orange-300">0</span><span className="text-white">);</span>
                            </div>
                            <div className="mt-2 ml-4">
                              <span className="text-purple-400">return</span> <span className="text-white">(</span>
                            </div>
                            <div className="ml-8">
                              <span className="text-gray-400">&lt;</span><span className="text-blue-300">div</span> <span className="text-green-400">className</span><span className="text-white">=</span><span className="text-orange-300">"container"</span><span className="text-gray-400">&gt;</span>
                            </div>
                            <div className="ml-12">
                              <span className="text-gray-400">&lt;</span><span className="text-blue-300">h1</span> <span className="text-green-400">className</span><span className="text-white">=</span><span className="text-orange-300">"title"</span><span className="text-gray-400">&gt;</span><span className="text-white">This is your app</span><span className="text-gray-400">&lt;/</span><span className="text-blue-300">h1</span><span className="text-gray-400">&gt;</span>
                            </div>
                            <div className="ml-12">
                              <span className="text-gray-400">&lt;</span><span className="text-blue-300">p</span><span className="text-gray-400">&gt;</span><span className="text-white">You clicked {'{'}count{'}'} times</span><span className="text-gray-400">&lt;/</span><span className="text-blue-300">p</span><span className="text-gray-400">&gt;</span>
                            </div>
                            <div className="ml-12">
                              <span className="text-gray-400">&lt;</span><span className="text-blue-300">button</span> <span className="text-green-400">onClick</span><span className="text-white">=</span><span className="text-orange-300">{'{() => setCount(count + 1)}'}</span><span className="text-gray-400">&gt;</span>
                            </div>
                            <div className="ml-16">
                              <span className="text-white">Click me</span>
                            </div>
                            <div className="ml-12">
                              <span className="text-gray-400">&lt;/</span><span className="text-blue-300">button</span><span className="text-gray-400">&gt;</span>
                            </div>
                            <div className="ml-8">
                              <span className="text-gray-400">&lt;/</span><span className="text-blue-300">div</span><span className="text-gray-400">&gt;</span>
                            </div>
                            <div className="ml-4">
                              <span className="text-white">);</span>
                            </div>
                            <div>
                              <span className="text-white">{'}'}</span>
                            </div>
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deploy to Your Custom Domain Section */}
          <div className="mt-24 w-full max-w-4xl mx-auto">
            <div className="bg-bolt-elements-bg-depth-2 rounded-2xl overflow-hidden border border-bolt-elements-borderColor shadow-xl">
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row-reverse gap-12">
                  {/* Text content */}
                  <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <div className="relative inline-block mb-6">
                      <h2 className="text-3xl font-bold text-bolt-elements-textPrimary">
                        Deploy to Your Custom Domain
                      </h2>
                      <div className="absolute -bottom-3 left-0 w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-bolt-elements-button-primary-background flex items-center justify-center">
                          <div className="i-ph:check text-xs text-white" />
                        </div>
                        <p className="text-bolt-elements-textSecondary">
                          One-click custom domain setup with automatic DNS configuration
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-bolt-elements-button-primary-background flex items-center justify-center">
                          <div className="i-ph:check text-xs text-white" />
                        </div>
                        <p className="text-bolt-elements-textSecondary">
                          Automatic SSL certificate provisioning for secure connections
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 w-4 h-4 rounded-full bg-bolt-elements-button-primary-background flex items-center justify-center">
                          <div className="i-ph:check text-xs text-white" />
                        </div>
                        <p className="text-bolt-elements-textSecondary">
                          Global CDN deployment for fast loading worldwide
                        </p>
                      </div>
                    </div>
                    
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover text-bolt-elements-textPrimary rounded-lg transition-colors w-full md:w-auto">
                      <div className="i-ph:globe-bold" />
                      Set Up Domain
                    </button>
                  </div>
                  
                  {/* Domain status card */}
                  <div className="w-full md:w-1/2 flex items-center">
                    <div className="bg-bolt-elements-bg-depth-3 rounded-lg border border-bolt-elements-borderColor p-6 w-full">
                      <div className="flex flex-col gap-6">
                        {/* Status indicators */}
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <div className="flex items-center gap-2 bg-bolt-elements-bg-depth-1 px-4 py-2 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-green-500 text-sm font-medium">Domain Connected</span>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-bolt-elements-bg-depth-1 px-4 py-2 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-green-500 text-sm font-medium">SSL Active</span>
                          </div>
                        </div>
                        
                        {/* URL display */}
                        <div className="mt-2 bg-bolt-elements-bg-depth-1 rounded-lg p-6 flex items-center justify-center border border-bolt-elements-borderColor">
                          <div className="flex items-center gap-2">
                            <div className="i-ph:lock-fill text-green-500"></div>
                            <span className="text-bolt-elements-textPrimary font-mono">https://your-app.com</span>
                          </div>
                        </div>
                        
                        {/* Status details */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="bg-bolt-elements-bg-depth-1 p-3 rounded-lg border border-bolt-elements-borderColor">
                            <div className="text-xs text-bolt-elements-textSecondary mb-1">Last Deployed</div>
                            <div className="text-sm text-bolt-elements-textPrimary">2 hours ago</div>
                          </div>
                          <div className="bg-bolt-elements-bg-depth-1 p-3 rounded-lg border border-bolt-elements-borderColor">
                            <div className="text-xs text-bolt-elements-textSecondary mb-1">Status</div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-bolt-elements-textPrimary">Healthy</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-full max-w-4xl mx-auto my-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm" />
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
            </div>
          </div>

          {/* Transforming the Way You Build Products */}
          <div className="mt-24 w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-bolt-elements-textPrimary text-center mb-12">
              Transforming the Way You Build Products
            </h2>
            
            <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-8`}>
              {[
                {
                  title: 'For Product Teams',
                  description: 'Equip your team to turn concepts into code. Align ideas by creating functional prototypes quickly and collaboratively.',
                  icon: '👥'
                },
                {
                  title: 'For Founders, Solopreneurs, and Indie Hackers',
                  description: 'Validate and refine ideas in record time. Launch complete products in just hours, not days.',
                  icon: '🚀'
                },
                {
                  title: 'For Product Designers',
                  description: 'Coming soon: Skip tedious prototyping and turn your designs into working applications instantly.',
                  icon: '🎨'
                },
                {
                  title: 'For Developers',
                  description: 'Generate entire frontends in a snap. Let CodeIQ handle bug fixes and make UI updates a breeze.',
                  icon: '👩‍💻'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300"
                >
                  <span className="text-3xl mb-4 block">{item.icon}</span>
                  <h3 className="text-xl font-semibold text-bolt-elements-textPrimary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-bolt-elements-textSecondary">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-full max-w-4xl mx-auto my-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm" />
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
        </div>
      </div>

      {/* Game Changer Section */}
      <div className="w-full max-w-4xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-bolt-elements-textPrimary text-center mb-12">
          A Game-Changer for Full-Stack Product Development
        </h2>

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-8`}>
          {[
            {
              title: 'Fast and User-Friendly',
              description: 'Real-time previews, smooth image handling, quick undo, and collaborative versioning. The AI resolves issues for you. Deploy your project with a single click.',
              icon: '⚡'
            },
            {
              title: 'Polished and Professional',
              description: 'We prioritize aesthetics. CodeIQ ensures every project follows modern UI/UX standards, so your creations are always visually stunning.',
              icon: '✨'
            },
            {
              title: 'Backend Versatility',
              description: 'Compatible with any database, API, or backend service. Connect your existing setup or leverage our Supabase integration for simplicity.',
              icon: '🔌'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-gray-900/20 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 group"
            >
              <span className="text-3xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
              <h3 className="text-xl font-semibold text-bolt-elements-textPrimary mb-3">
                {feature.title}
              </h3>
              <p className="text-bolt-elements-textSecondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Second row with 2 cards */}
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-8 mt-8`}>
          {[
            {
              title: 'Effortless Customization',
              description: 'Fine-tune every detail with ease. Just select an element and describe the changes you want to see.',
              icon: '🎨'
            },
            {
              title: 'Seamless Git Integration',
              description: 'Link CodeIQ to your GitHub for automatic code syncing. Ideal for handoffs, collaborations, and advanced development workflows.',
              icon: '🔄'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-gradient-to-br from-gray-900/40 via-gray-900/30 to-gray-900/20 border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 group"
            >
              <span className="text-3xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
              <h3 className="text-xl font-semibold text-bolt-elements-textPrimary mb-3">
                {feature.title}
              </h3>
              <p className="text-bolt-elements-textSecondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-full max-w-4xl mx-auto my-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm" />
          <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
        </div>
      </div>
      {/* Testimonials Section */}
      <div className="w-full max-w-4xl mx-auto mt-24 mb-20">
        <div className="relative rounded-2xl bg-gradient-to-br from-gray-900/40 to-transparent border border-gray-800/30 p-12">
          <div className="text-center space-y-12">
            {[
              {
                quote: "Coding like poetry should be short and concise.",
                author: "Santosh Kalwar"
              },
              {
                quote: "Clean code always looks like it was written by someone who cares. ",
                author: "Robert C. Martin"
              },
              {
                quote: "First, solve the problem. Then, write the code.",
                author: "John Johnson"
              },
              {
                quote: "Code is like humor. When you have to explain it, it's bad.",
                author: "Cory House"
              },
              {
                quote: "Make it work, make it right, make it fast.",
                author: "Kent Beck"
              }
            ].map((testimonial, index) => (
              <div key={index} className={`transition-opacity duration-300 ${index === 0 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold text-bolt-elements-textPrimary mb-4 leading-tight`}>
                  "{testimonial.quote}"
                </h2>
                <p className="text-xl text-bolt-elements-textSecondary mt-6">
                  ― {testimonial.author}
                </p>
              </div>
            ))}
          </div>
          
          {/* Slider Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {[0,1,2,3,4].map((index) => (
              <button
                key={index}
                onClick={() => {
                  const slides = document.querySelectorAll('.text-center > div');
                  slides.forEach((slide, i) => {
                    if (i === index) {
                      slide.classList.remove('opacity-0', 'hidden');
                      slide.classList.add('opacity-100');
                    } else {
                      slide.classList.remove('opacity-100');
                      slide.classList.add('opacity-0', 'hidden');
                    }
                  });
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === 0 ? 'bg-purple-500 w-4' : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {previewTemplate && (
        previewTemplate
      )}
    </div>
  );
};

export default StarterTemplates;
