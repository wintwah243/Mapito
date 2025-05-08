import React from 'react';
import Navbar from './Navbar';

const Documentation = () => {
  // Categories of documentation links
  const documentationCategories = [
    {
      title: 'Frontend Development',
      links: [
        {
          name: 'React Documentation',
          url: 'https://react.dev/learn',
          description: 'Official React documentation with guides and API references',
          icon: '⚛️'
        },
        {
          name: 'Vue.js Documentation',
          url: 'https://vuejs.org/guide/introduction.html',
          description: 'Comprehensive Vue.js guide and API documentation',
          icon: '🖖'
        },
        {
          name: 'Angular Documentation',
          url: 'https://angular.io/docs',
          description: 'Complete Angular framework documentation and tutorials',
          icon: '🅰️'
        },
        {
          name: 'Tailwind CSS Documentation',
          url: 'https://tailwindcss.com/docs',
          description: 'Utility-first CSS framework documentation',
          icon: '🎨'
        }
      ]
    },
    {
      title: 'Backend Development',
      links: [
        {
          name: 'Node.js Documentation',
          url: 'https://nodejs.org/en/docs/',
          description: 'Official Node.js API documentation and guides',
          icon: '⬢'
        },
        {
          name: 'Express.js Documentation',
          url: 'https://expressjs.com/',
          description: 'Fast, unopinionated web framework for Node.js',
          icon: '🚀'
        },
        {
          name: 'Django Documentation',
          url: 'https://docs.djangoproject.com/',
          description: 'Official documentation for Django web framework',
          icon: '🐍'
        },
        {
          name: 'Spring Framework Documentation',
          url: 'https://spring.io/projects/spring-framework',
          description: 'Documentation for Spring Framework and Spring Boot',
          icon: '🌱'
        }
      ]
    },
    {
      title: 'Programming Languages',
      links: [
        {
          name: 'MDN Web Docs (JavaScript)',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
          description: 'JavaScript reference maintained by Mozilla',
          icon: '📜'
        },
        {
          name: 'Python Documentation',
          url: 'https://docs.python.org/3/',
          description: 'Official Python language documentation',
          icon: '🐍'
        },
        {
          name: 'TypeScript Documentation',
          url: 'https://www.typescriptlang.org/docs/',
          description: 'TypeScript language documentation and handbook',
          icon: '📘'
        },
        {
          name: 'Rust Documentation',
          url: 'https://doc.rust-lang.org/book/',
          description: 'The Rust Programming Language book',
          icon: '🦀'
        }
      ]
    },
    {
      title: 'DevOps & Tools',
      links: [
        {
          name: 'Docker Documentation',
          url: 'https://docs.docker.com/',
          description: 'Docker container platform documentation',
          icon: '🐳'
        },
        {
          name: 'Kubernetes Documentation',
          url: 'https://kubernetes.io/docs/home/',
          description: 'Production-grade container orchestration',
          icon: '☸️'
        },
        {
          name: 'Git Documentation',
          url: 'https://git-scm.com/doc',
          description: 'Official Git reference manual',
          icon: '📌'
        },
        {
          name: 'PostgreSQL Documentation',
          url: 'https://www.postgresql.org/docs/',
          description: 'PostgreSQL relational database documentation',
          icon: '🐘'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-18">
        <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Developer Documentation Resources
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Curated collection of official documentation from popular development tools and frameworks
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {documentationCategories.map((category, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-900">
                <h3 className="text-lg leading-6 font-medium text-white">
                  {category.title}
                </h3>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <ul className="space-y-4">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="flex items-start">
                      <div className="flex-shrink-0 text-2xl mr-3 mt-1">
                        {link.icon}
                      </div>
                      <div className="flex-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-medium text-gray-900 hover:text-blue-500 hover:underline"
                        >
                          {link.name}
                        </a>
                        <p className="mt-1 text-sm text-gray-500">
                          {link.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-900">
            <h3 className="text-lg leading-6 font-medium text-white">
              Additional Resources
            </h3>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Community Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="https://stackoverflow.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Stack Overflow
                    </a>
                  </li>
                  <li>
                    <a href="https://dev.to/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      DEV Community
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Learning Platforms</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      MDN Web Docs
                    </a>
                  </li>
                  <li>
                    <a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      freeCodeCamp
                    </a>
                  </li>
                  <li>
                    <a href="https://docs.microsoft.com/en-us/learn/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Microsoft Learn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;