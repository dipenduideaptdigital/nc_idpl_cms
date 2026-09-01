import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDynamicForm } from './useDynamicForm.js';
import { DynamicFormField } from './DynamicFormField';

const DynamicFormRenderer = ({ slug, className = '' }) => {
  const { 
    schema, settings, formData, fieldErrors, status, 
    handleFieldChange, submitForm, resetStatus 
  } = useDynamicForm(slug);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  if (status.state === 'loading') {
    return <div className={`flex justify-center p-8 ${className}`}><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;
  }

  if (!schema) return null; 

  const isSubmitting = status.state === 'submitting';

  return (
    <div className={`nc-form-wrapper w-full ${className}`}>
      {status.state === 'success' && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-300">
          
          <div className="relative w-full max-w-sm p-8 text-center overflow-hidden rounded-[32px] bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
            
            <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-400/40 dark:bg-emerald-500/30 blur-[50px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-blue-400/20 dark:bg-blue-500/20 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/5 dark:from-white/10 dark:to-transparent pointer-events-none rounded-[32px]"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-md">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400 drop-shadow-lg" />
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 font-kanit tracking-wide drop-shadow-sm">
                Success!
              </h3>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-4 leading-relaxed font-medium">
                {status.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {status.state === 'error' && !Object.keys(fieldErrors).length && (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-200 dark:border-red-500/20 mb-6 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 nc-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
          {schema.fields.map((field) => (
            <div key={field.id} className={field.width === 'full' ? 'sm:col-span-2' : 'col-span-1'}>
              <DynamicFormField
                field={field}
                value={formData[field.key]}
                error={fieldErrors[field.key]}
                onChange={handleFieldChange}
                disabled={isSubmitting}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#7BA641] hover:bg-[#6CA844] text-white font-kanit tracking-widest text-sm uppercase py-3.5 rounded-md transition-colors flex justify-center items-center gap-2 shadow-md mt-2 disabled:opacity-75 disabled:cursor-not-allowed nc-submit-btn cursor-pointer"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {settings?.submitButton?.processingText || 'Sending...'}</>
          ) : (
            settings?.submitButton?.text || 'Submit'
          )}
        </button>
      </form>
    </div>
  );
};

export default DynamicFormRenderer;