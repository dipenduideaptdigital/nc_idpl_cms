import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuilderHeader from './BuilderHeader';
import FieldPalette from './FieldPalette';
import BuilderCanvas from './BuilderCanvas';
import FieldProperties from './FieldProperties';
import { adminDynamicFormsApi } from '../../../api/adminDynamicForms';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const FormBuilder = () => {
  const { id } = useParams();
  const [formId, setFormId] = useState(id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [message, setMessage] = useState(null);

  const [formState, setFormState] = useState({
    title: "Untitled Form",
    slug: "",
    status: "DRAFT",
    schema: { version: 1, fields: [] },
    settings: {
      submitButton: { text: "Submit", processingText: "Please wait..." },
      successAction: { type: "message", message: "Thank you! Your submission has been received.", redirectUrl: "" }
    }
  });

  const [activeFieldId, setActiveFieldId] = useState(null);

  // FETCH DATA FOR EDIT MODE
  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const res = await adminDynamicFormsApi.getForm(id);
          setFormId(res.data.id);
          setFormState({
            title: res.data.title,
            slug: res.data.slug,
            status: res.data.status,
            schema: res.data.schema,
            settings: res.data.settings
          });
        } catch (error) {
          console.error("Failed to load form", error);
          setMessage({ type: 'error', text: 'Failed to load form data.' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchForm();
    }
  }, [id]);

  const updateFormState = (key, value) => setFormState(prev => ({ ...prev, [key]: value }));
  const updateSettings = (key, value) => setFormState(prev => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
  
  const addField = (fieldType) => {
    const newId = `fld_${Math.random().toString(36).substr(2, 9)}`;
    const newField = {
      id: newId,
      key: `field_${Math.random().toString(36).substr(2, 6)}`,
      type: fieldType,
      label: `New ${fieldType} field`,
      placeholder: "",
      required: false,
      width: "full"
    };
    setFormState(prev => ({ ...prev, schema: { ...prev.schema, fields: [...prev.schema.fields, newField] } }));
    setActiveFieldId(newId);
  };

  const updateActiveField = (key, value) => {
    setFormState(prev => ({ ...prev, schema: { ...prev.schema, fields: prev.schema.fields.map(f => f.id === activeFieldId ? { ...f, [key]: value } : f) } }));
  };

  const removeField = (idToRemove) => {
    setFormState(prev => ({ ...prev, schema: { ...prev.schema, fields: prev.schema.fields.filter(f => f.id !== idToRemove) } }));
    if (activeFieldId === idToRemove) setActiveFieldId(null);
  };

  const handleReorderFields = (newFields) => {
    setFormState(prev => ({ ...prev, schema: { ...prev.schema, fields: newFields } }));
  };

  const duplicateField = (idToCopy) => {
    setFormState(prev => {
      const fields = prev.schema.fields;
      const index = fields.findIndex(f => f.id === idToCopy);
      if (index === -1) return prev;

      const fieldToCopy = fields[index];
      const newId = `fld_${Math.random().toString(36).substr(2, 9)}`;
      
      const newField = {
        ...fieldToCopy,
        id: newId,
        key: `${fieldToCopy.key}_copy_${Math.random().toString(36).substr(2, 4)}`,
        label: `${fieldToCopy.label} (Copy)`
      };

      const newFields = [...fields];
      newFields.splice(index + 1, 0, newField);
      return { ...prev, schema: { ...prev.schema, fields: newFields } };
    });
  };

  const handleSave = async (statusToSave) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        title: formState.title.trim(),
        slug: formState.slug.trim() || undefined,
        status: statusToSave,
        schema: formState.schema,
        settings: formState.settings
      };

      let response;
      if (formId) {
        response = await adminDynamicFormsApi.updateForm(formId, payload);
        setMessage({ type: 'success', text: `Form successfully updated as ${statusToSave}.` });
      } else {
        response = await adminDynamicFormsApi.createForm(payload);
        setFormId(response.data.id);
        setMessage({ type: 'success', text: `Form successfully created and saved as ${statusToSave}.` });
      }

      setFormState(prev => ({
        ...prev,
        slug: response.data.slug,
        status: response.data.status,
        schema: { ...prev.schema, version: response.data.version }
      }));

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      let errorMsg = err.response?.data?.message || 'Failed to save form.';
      if (errorMsg.includes('unique within the form')) {
         errorMsg = "Data Keys must be unique! Two fields cannot have the same Data Key.";
      }
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-zinc-50 dark:bg-zinc-950 font-sans relative">
      <BuilderHeader formState={formState} updateFormState={updateFormState} handleSave={handleSave} isSaving={isSaving} />

      {message && (
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-semibold text-sm">{message.text}</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
          <FieldPalette onAddField={addField} />
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50 dark:bg-zinc-950 relative">
          <BuilderCanvas 
            fields={formState.schema.fields} 
            activeFieldId={activeFieldId}
            setActiveFieldId={setActiveFieldId}
            removeField={removeField}
            onReorder={handleReorderFields}
            onDuplicate={duplicateField} 
          />
        </div>

        <div className="w-80 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto">
          <FieldProperties 
            activeFieldId={activeFieldId}
            setActiveFieldId={setActiveFieldId}
            fields={formState.schema.fields}
            updateActiveField={updateActiveField}
            settings={formState.settings}
            updateSettings={updateSettings}
          />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;