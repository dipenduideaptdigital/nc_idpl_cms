import React, { Suspense } from 'react';
import { templateRegistry } from '../../registry/templateRegistry';
import SEOHead from '../../../components/shared/SEOHead';
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary';
import { AlertTriangle } from 'lucide-react';

export const TemplateRenderer = ({ page }) => {
  const registryEntry = templateRegistry[page.templateKey];

  //Check if Template Exists in Registry
  if (!registryEntry) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-red-50 text-center px-4 m-4 rounded-3xl border border-red-200">
        <SEOHead data={{ title: "Template Error", noIndex: true, noFollow: true }} type="page" />
        
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-700 mb-2">Template Not Found</h2>
        <p className="text-red-600">The template "{page.templateKey}" is missing from the system registry.</p>
      </div>
    );
  }

  // Future expansion: Version Checking Logic goes here
  // if (page.templateVersion !== registryEntry.config.version) { handle migration }

  const TemplateComponent = registryEntry.component;

  // 3. Render with Error Boundary and Suspense
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
          <p className="mt-4 text-zinc-500 font-medium">Loading Template Content...</p>
        </div>
      }>
        <TemplateComponent content={page.content} />
      </Suspense>
    </ErrorBoundary>
  );
};