import { useState, useEffect } from 'react';
import { dynamicFormsApi } from '../../api/dynamicForms';
import { FieldRegistry } from './registry.js';

export const useDynamicForm = (slug) => {
  const [schema, setSchema] = useState(null);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ state: 'loading', message: null });

  // Fetch Form & Handle Race Conditions
  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    const loadForm = async () => {
      setStatus({ state: 'loading', message: null });
      try {
        const res = await dynamicFormsApi.getPublicForm(slug);
        if (!isMounted) return;

        const formSchema = res.data.schema;
        setSchema(formSchema);
        setSettings(res.data.settings);
        
        // Initialize dynamic default values using the Registry
        const initialData = {};
        formSchema.fields.forEach(f => {
          const registryEntry = FieldRegistry[f.type];
          initialData[f.key] = registryEntry ? registryEntry.getDefaultValue() : '';
        });
        setFormData(initialData);
        setStatus({ state: 'idle', message: null });

      } catch (err) {
        if (!isMounted) return;
        setStatus({ state: 'error', message: "This form is currently unavailable." });
      }
    };

    loadForm();
    return () => { isMounted = false; };
  }, [slug]);

  // Update Field Values
  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // Submit Handler & Zod Error Parsing
  const submitForm = async () => {
    setStatus({ state: 'submitting', message: null });
    setFieldErrors({});

    try {
      await dynamicFormsApi.submitForm(slug, formData);
      
      const successMsg = settings?.successAction?.message || "Thank you! Your submission has been received.";
      setStatus({ state: 'success', message: successMsg });
      
      // Reset form to default values
      const resetData = {};
      schema.fields.forEach(f => {
        const entry = FieldRegistry[f.type];
        resetData[f.key] = entry ? entry.getDefaultValue() : '';
      });
      setFormData(resetData);

      // Handle redirect if configured
      if (settings?.successAction?.type === 'redirect' && settings?.successAction?.redirectUrl) {
        window.location.href = settings.successAction.redirectUrl;
      } else {
        setTimeout(() => {
          setStatus(prev => prev.state === 'success' ? { state: 'idle', message: null } : prev);
        }, 2500);
      }

    } catch (err) {
      console.error("Form submit error:", err);
      let globalMessage = "Something went wrong. Please check your inputs.";
      let parsedFieldErrors = {};

      if (err.response?.data?.message) {
        try {
          const parsed = JSON.parse(err.response.data.message);
          if (Array.isArray(parsed)) {
            parsed.forEach(errObj => {
              if (errObj.path && errObj.path.length > 0) {
                parsedFieldErrors[errObj.path[0]] = errObj.message;
              }
            });
            globalMessage = "Please correct the errors below.";
          } else {
            globalMessage = err.response.data.message;
          }
        } catch {
          globalMessage = err.response.data.message;
        }
      }

      setFieldErrors(parsedFieldErrors);
      setStatus({ state: 'error', message: globalMessage });
    }
  };

  const resetStatus = () => setStatus({ state: 'idle', message: null });

  return { schema, settings, formData, fieldErrors, status, handleFieldChange, submitForm, resetStatus };
};