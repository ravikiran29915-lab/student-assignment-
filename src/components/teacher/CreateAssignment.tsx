import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlusCircle,
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Upload,
  Plus,
  Trash2,
  FileCheck2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const CreateAssignment: React.FC = () => {
  const { currentUser, addAssignment, setActivePage } = useApp();

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('MCA-307-A1');
  const [subject, setSubject] = useState('Advanced Database Systems');
  const [subjectCode, setSubjectCode] = useState('MCA-301');
  const [department, setDepartment] = useState('Department of Computer Applications');
  const [targetClass, setTargetClass] = useState('MCA 2nd Year (Sem III)');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState<string[]>([
    'Review textbook chapter 8 and lab guidelines before implementing.',
    'Write clean, modular code with descriptive variable naming and docstrings.',
    'Include execution screenshots, performance graphs, and tabular benchmarks.',
  ]);
  const [newInstruction, setNewInstruction] = useState('');
  const [tasks, setTasks] = useState<string[]>([
    'Task 1: Core algorithmic implementation & validation (15 marks)',
    'Task 2: Performance benchmark and analysis report (10 marks)',
  ]);
  const [newTask, setNewTask] = useState('');
  const [assignedDate, setAssignedDate] = useState('2026-10-26');
  const [dueDate, setDueDate] = useState('2026-11-10T23:59');
  const [maxMarks, setMaxMarks] = useState<number>(25);
  const [maxFileSizeMB, setMaxFileSizeMB] = useState<number>(20);
  const [acceptedFormats, setAcceptedFormats] = useState<string[]>(['PDF', 'ZIP']);
  const [resourceFile, setResourceFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentUser) return null;

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (idx: number) => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleRemoveTask = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleFormatToggle = (fmt: string) => {
    if (acceptedFormats.includes(fmt)) {
      if (acceptedFormats.length > 1) {
        setAcceptedFormats(acceptedFormats.filter((f) => f !== fmt));
      }
    } else {
      setAcceptedFormats([...acceptedFormats, fmt]);
    }
  };

  const handleSave = (status: 'published' | 'draft') => {
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please specify an assignment title.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a problem overview and assignment description.');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Please pick a submission deadline date and time.');
      return;
    }
    if (maxMarks <= 0) {
      setErrorMsg('Maximum marks must be greater than zero.');
      return;
    }

    const resources = resourceFile
      ? [
          {
            id: 'res-' + Date.now(),
            name: resourceFile.name,
            size: resourceFile.size,
            type: resourceFile.type,
          },
        ]
      : [];

    addAssignment({
      code,
      title: title.trim(),
      subject,
      subjectCode,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      department,
      targetClass,
      description: description.trim(),
      instructions,
      tasks,
      assignedDate,
      dueDate,
      maxMarks,
      acceptedFormats,
      maxFileSizeMB,
      status,
      resources,
    });

    setActivePage('manage-assignments');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('manage-assignments')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Assignments</span>
        </button>

        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
          Faculty Assignment Authoring
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Create & Publish Assignment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify course deliverables, rubric marks, instructions, and deadline for students
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Title & Assignment Code */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assignment Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus with Raft Algorithm"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Module Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MCA-307-A1"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-purple-700 focus:outline-none focus:border-purple-600 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Subject & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Name
              </label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (e.target.value.includes('Database')) setSubjectCode('MCA-301');
                  else if (e.target.value.includes('Cloud')) setSubjectCode('MCA-302');
                  else if (e.target.value.includes('Algorithms')) setSubjectCode('MCA-303');
                  else if (e.target.value.includes('Web')) setSubjectCode('MCA-304');
                  else setSubjectCode('MCA-305');
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600"
              >
                <option value="Advanced Database Systems">Advanced Database Systems</option>
                <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                <option value="Design & Analysis of Algorithms">Design & Analysis of Algorithms</option>
                <option value="Modern Web Engineering">Modern Web Engineering</option>
                <option value="Artificial Intelligence & Deep Learning">Artificial Intelligence & Deep Learning</option>
                <option value="Software Quality Assurance">Software Quality Assurance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Cohort / Class
              </label>
              <input
                type="text"
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Max Rubric Marks
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 tabular-nums"
              />
            </div>
          </div>

          {/* Dates & Deadlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assigned Date
              </label>
              <input
                type="date"
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Submission Due Date & Time
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-purple-600"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Problem Description & Learning Objectives
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the technical specifications, requirements, theoretical background, and expected deliverable structure..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
              required
            />
          </div>

          {/* Tasks & Marks Allocation */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Specific Tasks & Marks Breakdown
            </label>
            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium">
                    {task}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                placeholder="Add another task item (e.g. Task 3: Unit test coverage & linting)..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Instructions & Compliance Rules
            </label>
            <div className="space-y-2">
              {instructions.map((inst, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                    {inst}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInstruction())}
                placeholder="Add another instruction..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-purple-600"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rule</span>
              </button>
            </div>
          </div>

          {/* File formats & Reference material attachment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Accepted Submission Formats
              </label>
              <div className="flex flex-wrap gap-2">
                {['PDF', 'ZIP', 'DOC', 'DOCX', 'TXT'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleFormatToggle(fmt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      acceptedFormats.includes(fmt)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    .{fmt.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Attach Reference Material / Starter Code
              </label>
              {resourceFile ? (
                <div className="flex items-center justify-between p-2.5 bg-white border border-slate-300 rounded-xl text-xs">
                  <div className="truncate">
                    <span className="font-bold text-slate-800 block truncate">{resourceFile.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{resourceFile.size}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResourceFile(null)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setResourceFile({
                      name: `${code}_Reference_Lab_Guide.pdf`,
                      size: '1.9 MB',
                      type: 'PDF',
                    })
                  }
                  className="w-full py-2 px-3 border border-dashed border-slate-300 hover:border-purple-400 rounded-xl text-xs font-semibold text-slate-600 hover:text-purple-700 bg-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach Starter Code / Reference Spec</span>
                </button>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActivePage('manage-assignments')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-bold transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Assignment Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
