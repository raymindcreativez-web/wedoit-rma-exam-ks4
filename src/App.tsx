import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertCircle, Upload, Settings, CheckCircle2, X, Send, FileText, 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Plus, LayoutGrid, Sliders, ImagePlus, Edit3, Eye,
  BarChart3, Award, Target, RefreshCcw, Lock, ShieldCheck, Timer, BookOpen, UserCheck, Play
} from 'lucide-react';

const getSecretKey = () => {
  try {
    // Base64 encoded key for secrecy from simple inspection
    return JSON.parse(atob("WyJTdG9yZSBBLiAxNDB4MTA9MTQwMCBhbmQgMTMweDEyPTE1NjAiLCAiRCIsICJDIiwgIkMiLCAiQiIsICI2IGFuZCAtMiIsICIxNSB3ZWVrcyIsICIxMiB2b2x1bnRlZXJzIiwgIkQiLCAiVGhlIHBhcnRpY2lwYW50cyBpbiB0aGUgcG9sbCBkb2VzIG5vdCByZXByZXNlbnQgYWxsIEZpbGlwaW5vcyBzaW5jZSB0aGUgdG90YWwgbnVtYmVyIG9mIHBhcnRpY2lwYW50cyBkb2VzIG5vdCByZXByZXNlbnQgbWFqb3JpdHkgb2YgRmlsaXBpbm9zLiIsICJCIiwgIkMiLCAiQSIsICJEIiwgIkMiLCAiSm9iIEIuIEpvYiBBOiAyNTAqMTAqND0xMDAwMDsgSm9iIEI6IDE1MDAwIiwgIkMiLCAiQiIsICJDIiwgIkIiLCAiQyIsICJBIiwgIjg6MDAgUE0gaW4gU2VvdWwiLCAiTWF0aGVtYXRpY3MgcGVyZm9ybWFuY2UgaXMgbW9yZSBjb25zaXN0ZW50IGJlY2F1c2UgdGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiBoZXIgc2NvcmVzIGlzIDQsIHdoaWNoIGlzIHNtYWxsZXIgdGhhbiB0aGF0IGluIEVuZ2xpc2gsIHdoaWNoIGlzIDUgLiIsICJELSIsICJBIiwgIk1vbnRobHkgbW9ydGdhZ2UgcGF5bWVudCBmb3JtdWxhIHdpdGggYXBwcm9wcmlhdGUgc3Vic3RpdHV0aW9ucyIsICI5NSBtIiwgIjIsNzAwIiwgIkMiXQ=="));
  } catch (e) {
    return Array(30).fill('');
  }
};

const INITIAL_RULES = [
  { id: 1, start: 1, end: 1, type: 'long', category: 'Problem Solving' },
  { id: 2, start: 2, end: 5, type: 'mcq4', category: 'Knowledge' },
  { id: 3, start: 6, end: 8, type: 'long', category: 'Problem Solving' },
  { id: 4, start: 9, end: 9, type: 'mcq4', category: 'Knowledge' },
  { id: 5, start: 10, end: 10, type: 'long', category: 'Analysis' },
  { id: 6, start: 11, end: 15, type: 'mcq4', category: 'Knowledge' },
  { id: 7, start: 16, end: 16, type: 'long', category: 'Problem Solving' },
  { id: 8, start: 17, end: 22, type: 'mcq4', category: 'Knowledge' },
  { id: 9, start: 23, end: 24, type: 'long', category: 'Analysis' },
  { id: 10, start: 25, end: 26, type: 'mcq4', category: 'Knowledge' },
  { id: 11, start: 27, end: 29, type: 'long', category: 'Problem Solving' },
  { id: 12, start: 30, end: 30, type: 'mcq4', category: 'Knowledge' }
];

export default function App() {
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [testDuration, setTestDuration] = useState(60); 
  const [timeLeft, setTimeLeft] = useState(60 * 60); 
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState("");
  const [fileType, setFileType] = useState(null); 
  const [docxHtml, setDocxHtml] = useState("");
  const [mdText, setMdText] = useState(""); 
  const [isMdEditing, setIsMdEditing] = useState(false); 
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfScale, setPdfScale] = useState(1.2);
  const [isRendering, setIsRendering] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [studentLRN, setStudentLRN] = useState("");
  const [studentSex, setStudentSex] = useState("");
  const [studentBirthday, setStudentBirthday] = useState("");
  
  const [answers, setAnswers] = useState(Array(30).fill(''));
  const [answerKey, setAnswerKey] = useState(getSecretKey()); 
  const [pendingKeyText, setPendingKeyText] = useState(null); 
  const [pendingKeyFileName, setPendingKeyFileName] = useState("");
  
  const [webhookUrl, setWebhookUrl] = useState("https://script.google.com/macros/s/AKfycbwTZerD-gCE3K3Kq6cg1CSG-odA94dt3-EQhh9dlBrhx00bsCxsoARIUK_eQWXu2PEw/exec");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [validationError, setValidationError] = useState("");
  const [feedback, setFeedback] = useState(null); 
  const [showTosModal, setShowTosModal] = useState(false); 
  const [tosFileName, setTosFileName] = useState(""); 
  
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general'); 
  const [questionRules, setQuestionRules] = useState(INITIAL_RULES);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [authTarget, setAuthTarget] = useState(null); 

  const itemRefs = useRef([]);
  const canvasRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const mdTextareaRef = useRef(null);

  useEffect(() => {
    let timerInterval = null;
    if (isTestStarted && submitStatus !== 'success' && !isTimerPaused) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTestStarted, submitStatus, isTimerPaused]);

  const loadPdfJs = async () => {
    if (window.pdfjsLib) return window.pdfjsLib;

    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return window.pdfjsLib;
  };

  const parseMarkdown = (rawText) => {
    if (!window.marked) return "";
    const renderer = new window.marked.Renderer();
    
    renderer.list = (body, ordered) => {
        const type = ordered ? 'ol' : 'ul';
        const classes = ordered ? 'list-decimal pl-5' : 'list-disc pl-5';
        return `<${type} class="${classes} space-y-6 my-6">${body}</${type}>`;
    };

    renderer.listitem = (text) => {
        return `<li class="pl-2 marker:text-blue-600 marker:font-black marker:text-lg">
            <div class="bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                ${text}
            </div>
        </li>`;
    };
    
    renderer.paragraph = (text) => {
        const plain = text.replace(new RegExp('<[^>]*>?', 'gm'), '');
        if (new RegExp('^(?:Item|Question)?\\s*\\d+[\\.\\)\\:\\-]\\s', 'i').test(plain)) {
           return `<div class="mb-6 bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
               <p class="text-slate-800 font-medium leading-relaxed">${text}</p>
           </div>`;
        }
        return `<p class="mb-3 text-slate-700 leading-relaxed">${text}</p>`;
    };
    
    renderer.image = (href, title, text) => {
        return `<img src="${href}" alt="${text}" class="max-w-[90%] mx-auto h-auto rounded-xl shadow-md my-6 border border-slate-200 block" />`;
    };

    window.marked.setOptions({ renderer, breaks: true });
    return window.marked.parse(rawText);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isPdf = file.type === "application/pdf" || file.name.endsWith('.pdf');
    const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith('.docx');
    const isMd = file.name.endsWith('.md') || file.type === "text/markdown";

    if (!isPdf && !isDocx && !isMd) {
      return;
    }

    setPdfName(file.name);
    setIsLoadingFile(true);
    setPdfDoc(null);
    setCurrentPage(1);
    canvasRefs.current = [];

    if (isPdf) {
      try {
        const pdfjs = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setFileType('pdf');
        
        const fileUrl = URL.createObjectURL(file);
        setPdfFile(fileUrl);
      } catch (error) {
        console.error("Error parsing PDF via PDF.js:", error);
      } finally {
        setIsLoadingFile(false);
      }
    } else if (isDocx) {
      try {
        if (!window.mammoth) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        
        setDocxHtml(result.value);
        setFileType('docx');
      } catch (error) {
        console.error("Error parsing DOCX:", error);
      } finally {
        setIsLoadingFile(false);
      }
    } else if (isMd) {
      try {
        if (!window.marked) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.2/marked.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        
        const text = await file.text();
        setMdText(text);
        setDocxHtml(parseMarkdown(text));
        setFileType('md');
        setIsMdEditing(false); 
      } catch (error) {
        console.error("Error parsing MD:", error);
      } finally {
        setIsLoadingFile(false);
      }
    }
  };

  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;
    let isCancelled = false;

    const renderAllPages = async () => {
      setIsRendering(true);
      for (let i = 1; i <= numPages; i++) {
        if (isCancelled) return;
        try {
          const page = await pdfDoc.getPage(i);
          const outputScale = window.devicePixelRatio || 1;
          const viewport = page.getViewport({ scale: pdfScale * outputScale });
          const canvas = canvasRefs.current[i - 1];
          if (canvas) {
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = Math.floor(viewport.width / outputScale) + "px";
            canvas.style.height = Math.floor(viewport.height / outputScale) + "px";
          }
        } catch (error) {
          console.error("Error calculating viewport for page", i, error);
        }
      }

      for (let i = 1; i <= numPages; i++) {
        if (isCancelled) return;
        try {
          const page = await pdfDoc.getPage(i);
          const outputScale = window.devicePixelRatio || 1;
          const viewport = page.getViewport({ scale: pdfScale * outputScale });
          const canvas = canvasRefs.current[i - 1];
          if (canvas) {
            const context = canvas.getContext('2d', { willReadFrequently: true });
            await page.render({ canvasContext: context, viewport }).promise;
          }
        } catch (error) {
          if (error.name !== 'RenderingCancelledException') {
            console.error(`Error rendering page ${i}:`, error);
          }
        }
      }
      setIsRendering(false);
    };

    renderAllPages();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pdfScale, numPages]);

  useEffect(() => {
    if (settingsTab === 'key') {
      const textareas = document.querySelectorAll('.auto-resize-ta');
      textareas.forEach(ta => {
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
      });
    }
  }, [answerKey, settingsTab]);

  const handlePdfScroll = (e) => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight } = e.target;
    const pageHeight = scrollHeight / numPages;
    const estimatedPage = Math.floor(scrollTop / pageHeight) + 1;
    const boundedPage = Math.max(1, Math.min(estimatedPage, numPages));
    if (boundedPage !== currentPage) {
      setCurrentPage(boundedPage);
    }
  };

  const handlePageChange = (direction) => {
    let targetPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    targetPage = Math.max(1, Math.min(targetPage, numPages));
    const targetCanvas = canvasRefs.current[targetPage - 1];
    if (targetCanvas && scrollContainerRef.current) {
      targetCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleZoom = (type) => {
    if (type === 'in' && pdfScale < 3) {
      setPdfScale(prev => Math.min(prev + 0.2, 3));
    } else if (type === 'out' && pdfScale > 0.6) {
      setPdfScale(prev => Math.max(prev - 0.2, 0.6));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startAssessment = () => {
    if (!studentName || !studentSection || !studentLRN || !studentSex || !studentBirthday) {
      setValidationError("Please fill out all registration fields on the landing page before starting.");
      return;
    }
    setValidationError("");
    setTimeLeft(testDuration * 60);
    setIsTestStarted(true);
  };

  const addQuestionRule = () => {
    const lastRule = questionRules[questionRules.length - 1];
    const newStart = lastRule ? lastRule.end + 1 : 1;
    setQuestionRules([...questionRules, { id: Date.now(), start: newStart, end: newStart + 9, type: 'text', category: 'Knowledge' }]);
  };

  const updateQuestionRule = (id, field, value) => {
    setQuestionRules(questionRules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeQuestionRule = (id) => {
    setQuestionRules(questionRules.filter(r => r.id !== id));
  };

  const getItemType = (itemNumber) => {
    for (let i = questionRules.length - 1; i >= 0; i--) {
      const rule = questionRules[i];
      if (itemNumber >= rule.start && itemNumber <= rule.end) {
        return rule.type;
      }
    }
    return 'text'; 
  };

  const handleAnswerChange = (index, value) => {
    if (submitStatus === 'success') return; 
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    if (validationError) setValidationError("");
  };

  const handleItemCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count > 0 && count <= 150) {
      setAnswers(prev => {
        const newAns = [...prev];
        if (count > prev.length) {
          return [...newAns, ...Array(count - prev.length).fill('')];
        }
        return newAns.slice(0, count);
      });
      setAnswerKey(prev => {
        const newKey = [...prev];
        if (count > prev.length) {
          return [...newKey, ...Array(count - prev.length).fill('')];
        }
        return newKey.slice(0, count);
      });
    }
  };

  const scrollToItem = (index) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleParseKey = () => {
    if (!pendingKeyText) return;

    const lines = pendingKeyText.split(/\r?\n/);
    let parsedKey = [];
    let currentNum = -1;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const cleanLine = trimmed.replace(new RegExp('(\\*\\*|__)', 'g'), '');
      const itemMatch = cleanLine.match(new RegExp('^[\\s#\\-\\*]*(?:(?:Item|Question|Q)\\s*(\\d+)[\\.\\:\\-\\\)]*|(\\d+)[\\.\\:\\)]+|(0\\d+)[\\.\\:\\-\\\)]*)\\s*(.*)$', 'i'));

      let isNewItem = false;

      if (itemMatch) {
        const numStr = itemMatch[1] || itemMatch[2] || itemMatch[3];
        const num = parseInt(numStr, 10) - 1; 
        const hasExplicitPrefix = !!itemMatch[1]; 

        if (num >= 0 && (num > currentNum || hasExplicitPrefix)) {
          currentNum = num;
          while (parsedKey.length <= currentNum) parsedKey.push("");
          parsedKey[currentNum] = itemMatch[4] ? itemMatch[4].trim() : "";
          isNewItem = true;
        }
      }

      if (!isNewItem) {
        if (currentNum >= 0) {
          let ansText = trimmed;
          if (!parsedKey[currentNum]) ansText = trimmed.replace(/^[\-\*\s]+/, '');
          parsedKey[currentNum] += (parsedKey[currentNum] ? '\n' : '') + ansText;
        } else {
          const firstEmpty = parsedKey.findIndex(val => !val);
          if (firstEmpty !== -1) {
            let ansText = trimmed;
            if (!parsedKey[firstEmpty]) ansText = trimmed.replace(/^[\-\*\s]+/, '');
            parsedKey[firstEmpty] = ansText;
            currentNum = firstEmpty;
          } else {
            let ansText = trimmed.replace(/^[\-\*\s]+/, '');
            parsedKey.push(ansText);
            currentNum = parsedKey.length - 1;
          }
        }
      }
    }

    setAnswerKey(prev => {
      const newLen = Math.max(prev.length, parsedKey.length);
      const newKey = Array(newLen).fill("");
      for (let i = 0; i < newLen; i++) {
        newKey[i] = parsedKey[i] !== undefined && parsedKey[i] !== "" ? parsedKey[i] : (prev[i] || "");
      }
      return newKey;
    });

    setAnswers(prev => {
      if (parsedKey.length > prev.length) {
        const newAns = [...prev];
        while (newAns.length < parsedKey.length) newAns.push("");
        return newAns;
      }
      return prev;
    });

    setPendingKeyText(null);
    setPendingKeyFileName("");
  };

  const handleOpenAuth = (target) => {
    setAuthTarget(target);
    setShowAuthModal(true);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authPassword === 'teacher123') { 
      setShowAuthModal(false);
      setAuthPassword('');
      setAuthError(false);
      
      if (authTarget === 'settings') setShowSettings(true);
      if (authTarget === 'markdown') setIsMdEditing(!isMdEditing);
    } else {
      setAuthError(true);
    }
  };

  const processImmediateTOSFeedback = () => {
    let correctCount = 0;
    let checkableCount = 0;
    let categoryStats = {};
    
    answers.forEach((ans, i) => {
       const itemNum = i + 1;
       let itemRule = questionRules.find(r => itemNum >= r.start && itemNum <= r.end) || { type: 'text', category: 'General' };
       
       const type = itemRule.type;
       const category = itemRule.category || 'General';
       const key = answerKey[i] || "";

       if (!categoryStats[category]) {
          categoryStats[category] = { correct: 0, checkable: 0, total: 0, subjective: 0 };
       }
       categoryStats[category].total++;

       if (type === 'long') {
         categoryStats[category].subjective++;
         return;
       }

       checkableCount++;
       categoryStats[category].checkable++;
       
       const cleanAns = ans.trim().toLowerCase().replace(/[^\w\s]/g, '');
       const possibleKeys = key.split(/[\/\,\|]/).map(k => k.trim().toLowerCase().replace(/[^\w\s]/g, '')).filter(k => k);
       
       const isCorrect = possibleKeys.includes(cleanAns) || cleanAns === key.trim().toLowerCase().replace(/[^\w\s]/g, '');

       if (isCorrect) {
          correctCount++;
          categoryStats[category].correct++;
       }
    });
    
    setFeedback({ correct: correctCount, checkable: checkableCount, total: answers.length, categoryStats });
  };

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    setValidationError("");

    try {
      const payload = {
        studentName,
        section: studentSection,
        lrn: studentLRN,
        sex: studentSex,
        birthday: studentBirthday,
        answers,
        answerKey,
        isAutoSubmitted: true
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      processImmediateTOSFeedback();
      setSubmitStatus('success');
      setShowTosModal(true);
    } catch (error) {
      console.error("Auto submission error:", error);
      processImmediateTOSFeedback();
      setSubmitStatus('success');
      setShowTosModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!studentName || !studentSection || !studentLRN || !studentSex || !studentBirthday) {
      setSubmitStatus('error');
      setValidationError("Please fill in all student information fields before submitting.");
      return;
    }

    const unansweredCount = answers.filter(a => a.trim() === '').length;
    if (unansweredCount > 0) {
      setSubmitStatus('error');
      setValidationError(`Incomplete: You have ${unansweredCount} unanswered item(s). Please complete all items before submitting.`);
      return;
    }

    if (!webhookUrl) {
      setSubmitStatus('error');
      setValidationError("Teacher Error: Webhook submission URL configuration is missing.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setValidationError("");

    try {
      const payload = {
        studentName,
        section: studentSection,
        lrn: studentLRN,
        sex: studentSex,
        birthday: studentBirthday,
        answers,
        answerKey
      };

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      processImmediateTOSFeedback();
      setSubmitStatus('success');
      setShowTosModal(true); 
      setValidationError("");
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmitStatus('error');
      setValidationError("Failed to submit. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStudentName("");
    setStudentSection("");
    setStudentLRN("");
    setStudentSex("");
    setStudentBirthday("");
    setAnswers(Array(answers.length).fill(''));
    setFeedback(null);
    setSubmitStatus(null);
    setShowTosModal(false);
    setIsTestStarted(false);
    setTimeLeft(testDuration * 60);
  };

  const renderItemInput = (index, type) => {
    const currentValue = answers[index];
    const isError = currentValue.trim() === '' && submitStatus === 'error';

    let baseClasses = `flex-1 px-3 border rounded-md outline-none transition-all text-sm font-medium ${
      isError ? 'border-red-300 focus:border-red-500 bg-red-50 placeholder-red-300' : 'border-slate-300 focus:border-blue-500 bg-white'
    } hover:border-slate-400 focus:ring-2 focus:ring-blue-500`;

    if (type === 'long') {
      return (
        <textarea
          value={currentValue}
          onChange={(e) => handleAnswerChange(index, e.target.value)}
          placeholder="Type answer explanation..."
          rows="3"
          className={`${baseClasses} py-3 resize-y min-h-[80px]`}
        />
      );
    }

    if (type === 'mcq4' || type === 'mcq5' || type === 'tf') {
      const options = type === 'mcq4' ? ['A', 'B', 'C', 'D'] : type === 'mcq5' ? ['A', 'B', 'C', 'D', 'E'] : ['True', 'False'];
      return (
        <div className="flex gap-1.5 w-full">
          {options.map(opt => {
            const isSelected = currentValue === opt;
            const btnClass = isSelected
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : (isError ? 'bg-red-50 text-red-400 border-red-200' : 'bg-white text-slate-600 border-slate-300');
              
            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswerChange(index, opt)}
                className={`flex-1 h-10 rounded-md font-bold text-sm transition-all border ${btnClass} hover:bg-slate-50`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      );
    }

    return (
      <input 
        type="text" 
        value={currentValue}
        onChange={(e) => handleAnswerChange(index, e.target.value)}
        placeholder={`Type exact answer...`}
        className={`${baseClasses} h-10`}
      />
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800 relative">
      
      {/* SECURE TOS IMMEDIATE FEEDBACK MODAL OVERLAY */}
      {showTosModal && feedback && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Assessment Recorded
              </h2>
              <button 
                onClick={() => setShowTosModal(false)} 
                className="text-white/80 hover:text-white transition-colors bg-white/10 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </header>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-9 h-9 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Great Job, {studentName}!</h3>
                <p className="text-sm text-slate-500 mt-1">Your responses have been locked and securely compiled.</p>
              </div>

              {/* Secure Performance Scores Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Checked Objective Items</span>
                  <div className="text-4xl font-black text-blue-900 mb-1">
                    {feedback.correct} <span className="text-lg text-slate-400">/ {feedback.checkable}</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1 rounded-full border border-blue-200">
                    {feedback.checkable > 0 ? ((feedback.correct / feedback.checkable) * 100).toFixed(0) : 0}% Target Accuracy
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Subjective Items Loaded</span>
                  <div className="text-4xl font-black text-amber-600 mb-1">
                    {feedback.total - feedback.checkable} <span className="text-lg text-slate-400">/ {feedback.total}</span>
                  </div>
                  <div className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
                    Pending Manual Evaluation
                  </div>
                </div>
              </div>

              {/* Table of Specifications (TOS) Dashboard breakdown */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-slate-500" /> Table of Specifications (TOS) Domain Scorecard
                </span>
                <div className="space-y-4">
                  {Object.entries(feedback.categoryStats).map(([cat, stats]) => {
                    const percentage = stats.checkable > 0 ? (stats.correct / stats.checkable) * 100 : 0;
                    return (
                      <div key={cat} className="group">
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-700">{cat}</span>
                          <span className="text-slate-600">{stats.correct} / {stats.checkable} correct</span>
                        </div>
                        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        {stats.subjective > 0 && (
                          <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                            Contains {stats.subjective} written items awaiting grading.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 text-blue-800 text-xs p-3.5 rounded-xl border border-blue-100 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  <strong>Assessment Integrity:</strong> In compliance with test distribution guidelines, individual items and correction keys are withheld from this receipt to ensure fairness for subsequent testing windows.
                </p>
              </div>
            </div>

            <footer className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
              <button 
                onClick={() => setShowTosModal(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 rounded-lg transition-colors shadow-sm text-sm"
              >
                Close Summary
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-sm text-sm flex items-center justify-center gap-1.5"
              >
                <RefreshCcw className="w-4 h-4" /> Start New Test
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Teacher Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col relative overflow-hidden">
            <header className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Teacher Settings
              </h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </header>
            
            <div className="flex gap-2 border-b border-slate-200 px-5 pt-3 shrink-0">
              <button
                onClick={() => setSettingsTab('general')}
                className={`py-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  settingsTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Sliders className="w-4 h-4" /> System
              </button>
              <button
                onClick={() => setSettingsTab('types')}
                className={`py-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  settingsTab === 'types' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" /> Questions
              </button>
              <button
                onClick={() => setSettingsTab('key')}
                className={`py-2 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  settingsTab === 'key' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Answer Key
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {settingsTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Google Apps Script Webhook URL</label>
                    <input 
                      type="text" 
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                    />
                  </div>

                  {/* Test Timer Settings Option */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Test Timer Duration (Minutes)</label>
                    <p className="text-xs text-slate-500 mb-2">Set how long students have to complete the assessment.</p>
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-blue-600" />
                      <input 
                        type="number" 
                        min="1" 
                        max="180"
                        value={testDuration}
                        onChange={(e) => setTestDuration(Math.max(1, parseInt(e.target.value) || 60))}
                        className="w-28 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-center"
                      />
                      <span className="text-sm font-medium text-slate-600">Minutes</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Exam Document</label>
                    <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
                      <Upload className="w-4 h-4 text-blue-600" />
                      {pdfName ? 'Replace Questionnaire (PDF/DOCX/MD)' : 'Upload Questionnaire'}
                      <input 
                        type="file" 
                        accept=".pdf,.docx,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                      />
                    </label>
                    {pdfName && <p className="text-xs text-slate-500 mt-2 font-medium">Current: {pdfName}</p>}
                  </div>
                </div>
              )}

              {settingsTab === 'types' && (
                <div>
                  <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-semibold text-slate-700">Table of Specifications (TOS)</label>
                      <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5">
                        <Upload className="w-3 h-3 text-blue-600" />
                        Upload TOS
                        <input
                          type="file"
                          accept=".csv,.xlsx,.pdf,.docx,.md"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setTosFileName(e.target.files[0].name);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                    {tosFileName ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800 truncate">{tosFileName} uploaded.</span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 mb-2">Upload your Table of Specifications file for reference.</p>
                    )}
                  </div>

                  <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Total Number of Items</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="150" 
                      value={answers.length}
                      onChange={handleItemCountChange}
                      className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-md outline-none focus:border-blue-500 font-bold"
                    />
                    <p className="text-xs text-slate-500 mt-1">Set the total number of questions for this exam.</p>
                  </div>

                  <div className="flex justify-between items-center mb-3 pt-2 border-t border-slate-100">
                    <label className="block text-sm font-semibold text-slate-700">Question Types (Item Formats)</label>
                    <button 
                      onClick={addQuestionRule}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                    >
                      <Plus className="w-3 h-3" /> Add Rule
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Define how the answer sheet appears for specific item ranges.</p>
                  
                  <div className="space-y-3">
                    {questionRules.map((rule) => (
                      <div key={rule.id} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex-wrap">
                        <span className="text-xs font-semibold text-slate-500">Items</span>
                        <input 
                          type="number" min="1" max="150"
                          value={rule.start} onChange={(e) => updateQuestionRule(rule.id, 'start', parseInt(e.target.value) || 1)}
                          className="w-14 px-1 py-1 border border-slate-300 rounded text-sm text-center outline-none focus:border-blue-500" 
                        />
                        <span className="text-xs font-medium text-slate-500">to</span>
                        <input 
                          type="number" min="1" max="150"
                          value={rule.end} onChange={(e) => updateQuestionRule(rule.id, 'end', parseInt(e.target.value) || 1)}
                          className="w-14 px-1 py-1 border border-slate-300 rounded text-sm text-center outline-none focus:border-blue-500" 
                        />
                        <select 
                          value={rule.type} onChange={(e) => updateQuestionRule(rule.id, 'type', e.target.value)}
                          className="flex-1 border border-slate-300 rounded p-1.5 text-sm outline-none focus:border-blue-500 bg-white min-w-[120px]"
                        >
                          <option value="text">Text (Short Answer)</option>
                          <option value="long">Long Answer (Paragraph)</option>
                          <option value="mcq4">Multiple Choice (A-D)</option>
                          <option value="mcq5">Multiple Choice (A-E)</option>
                          <option value="tf">True / False</option>
                        </select>
                        <input
                          type="text"
                          placeholder="TOS Category"
                          value={rule.category || ''}
                          onChange={(e) => updateQuestionRule(rule.id, 'category', e.target.value)}
                          className="flex-1 border border-slate-300 rounded p-1.5 text-sm outline-none focus:border-blue-500 min-w-[100px]"
                        />
                        <button 
                          onClick={() => removeQuestionRule(rule.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settingsTab === 'key' && (
                <div className="flex flex-col gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col gap-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-blue-900 text-sm">Upload Key</h4>
                        <p className="text-xs text-blue-700 mt-0.5">CSV, TXT, or MD (newline separated).</p>
                      </div>
                      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm ml-2 whitespace-nowrap">
                        Choose File
                        <input 
                          type="file" 
                          accept=".csv,.txt,.md" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setPendingKeyFileName(file.name);
                            const text = await file.text();
                            setPendingKeyText(text);
                            e.target.value = ''; 
                          }} 
                        />
                      </label>
                    </div>

                    {pendingKeyFileName && (
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-blue-200 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col overflow-hidden mr-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Selected</span>
                          <span className="text-sm font-semibold text-slate-700 truncate">{pendingKeyFileName}</span>
                        </div>
                        <button 
                          onClick={handleParseKey}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Parse & Map Key
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 italic">Or enter answers manually:</p>
                    {answers.map((_, index) => (
                      <div key={`key-${index}`} className="flex items-start gap-3">
                        <span className="w-8 text-right text-xs font-bold text-slate-500 mt-2">{String(index + 1).padStart(2, '0')}.</span>
                        <textarea 
                          value={answerKey[index] || ""}
                          onChange={(e) => {
                            const newKey = [...answerKey];
                            newKey[index] = e.target.value;
                            setAnswerKey(newKey);
                          }}
                          rows={1}
                          placeholder="Correct answer/Rubric..."
                          className="auto-resize-ta flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none overflow-hidden"
                          style={{ minHeight: '34px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <footer className="p-5 border-t border-slate-100 bg-white shrink-0">
              <button 
                onClick={() => setShowSettings(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Save & Close
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Teacher Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[110]">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Teacher Authentication
              </h2>
              <button onClick={() => { setShowAuthModal(false); setAuthPassword(''); setAuthError(false); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="p-5">
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Enter Password</label>
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => { setAuthPassword(e.target.value); setAuthError(false); }}
                  className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors ${
                    authError ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50' : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                  placeholder="••••••••"
                  autoFocus
                />
                {authError && <p className="text-xs text-red-500 mt-1.5 font-medium">Incorrect password. Please try again.</p>}
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors shadow-sm"
              >
                Unlock
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-3">Default password is <strong>teacher123</strong></p>
            </form>
          </div>
        </div>
      )}

      {/* DYNAMIC LANDING PORTAL SCREEN */}
      {!isTestStarted ? (
        <main className="flex-1 overflow-y-auto bg-slate-900 flex flex-col justify-between p-4 md:p-8 bg-gradient-to-b from-slate-900 to-indigo-950">
          
          <div className="max-w-4xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto relative animate-in fade-in zoom-in-95 duration-500">
            
            {/* Admin Controls Anchor */}
            <div className="absolute top-0 right-0 -mt-12 lg:-mt-16 flex justify-end w-full">
              <button 
                onClick={() => handleOpenAuth('settings')}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                title="Teacher Settings Portal"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Assessment Rules Column */}
            <section className="lg:col-span-7 bg-slate-800/50 border border-slate-700 backdrop-blur-md rounded-2xl p-6 md:p-8 text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full inline-block mb-3 uppercase tracking-wider">
                  RAPID MATHEMATICS ASSESSMENT—KS4
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  LEVEL 11 NUMERACY TEST QUESTIONNAIRE
                </h1>
                
                <div className="mt-6 space-y-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    Instructions to Candidates
                  </h2>
                  <ol className="space-y-3.5 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 mt-0.5">1</span>
                      <p>
                        The total time allowed for this numeracy assessment is <strong className="text-blue-300">{testDuration} minutes</strong>. Manage your time carefully and attempt all questions.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 mt-0.5">2</span>
                      <p>Read each question carefully before you answer it.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 mt-0.5">3</span>
                      <p>Write all answers and full solutions clearly on the answer sheet provided.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 mt-0.5">4</span>
                      <p>Write neatly and ensure all responses are easy to read.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 mt-0.5">5</span>
                      <p>Raise your hand and ask the teacher if any instructions are unclear.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/40 text-xs font-bold text-blue-300 mt-0.5">6</span>
                      <p className="text-slate-400 italic">
                        This assessment is used only to understand your numeracy skills and support your learning and development.
                      </p>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>Secure timer lockout enabled</span>
                <span>Active Key validation</span>
              </div>
            </section>

            {/* Candidate Credentials Column */}
            <section className="lg:col-span-5 bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  Candidate Registration
                </h2>
                <p className="text-xs text-slate-500 mb-6">Enter your profile information below to register and start the examination.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Student Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        if (validationError) setValidationError("");
                      }}
                      placeholder="Last, First M.I."
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Grade & Section <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={studentSection}
                        onChange={(e) => {
                          setStudentSection(e.target.value);
                          if (validationError) setValidationError("");
                        }}
                        placeholder="e.g. 11-Rizal"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">12-Digit LRN <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        maxLength={12}
                        value={studentLRN}
                        onChange={(e) => {
                          setStudentLRN(e.target.value.replace(/\D/g, ''));
                          if (validationError) setValidationError("");
                        }}
                        placeholder="e.g. 123456789012"
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Sex <span className="text-red-500">*</span></label>
                      <select 
                        value={studentSex}
                        onChange={(e) => {
                          setStudentSex(e.target.value);
                          if (validationError) setValidationError("");
                        }}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Birthday <span className="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        value={studentBirthday}
                        onChange={(e) => {
                          setStudentBirthday(e.target.value);
                          if (validationError) setValidationError("");
                        }}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {validationError && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-lg border border-red-100 flex items-start gap-2 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium">{validationError}</span>
                  </div>
                )}

                <button 
                  onClick={startAssessment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Unlock & Start Assessment ({testDuration}m)
                </button>
              </div>
            </section>
          </div>

          {/* Core Corporate Branding Footer */}
          <footer className="w-full text-center text-slate-500 text-xs pt-8 border-t border-slate-800/60 mt-8 shrink-0">
            <p className="font-bold text-slate-400">©2016-2026 wedoIT™Solutions</p>
            <p className="text-[10px] text-slate-500 mt-0.5">All rights reserved</p>
          </footer>
        </main>
      ) : (
        /* DYNAMIC EXAM WORKSPACE */
        <div className="flex-1 flex flex-col h-[calc(100vh-10px)] overflow-hidden">
          <div className="flex-1 flex flex-col lg:flex-row p-2 md:p-4 gap-4 overflow-hidden">
            
            {/* Left Column: Document Questionnaire Viewer */}
            <section className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[45vh] lg:min-h-0">
              <header className="bg-white p-4 border-b border-slate-200 flex justify-between items-center shrink-0">
                <div>
                  <h1 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    RAPID MATHEMATICS ASSESSMENT
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">KS4—Level 11</span>
                  </h1>
                  {pdfName && (
                     <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1 line-clamp-1">
                       <FileText className="w-3 h-3" />
                       {pdfName}
                     </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {fileType === 'pdf' && pdfDoc && (
                    <div className="flex items-center bg-slate-100 rounded-lg p-1 text-slate-600 mr-2 border border-slate-200 shadow-sm">
                      <button 
                        onClick={() => handlePageChange('prev')} 
                        disabled={currentPage <= 1}
                        className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold px-2 select-none min-w-[50px] text-center text-slate-700">
                        {currentPage} / {numPages}
                      </span>
                      <button 
                        onClick={() => handlePageChange('next')} 
                        disabled={currentPage >= numPages}
                        className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
                      <button 
                        onClick={() => handleZoom('out')} 
                        disabled={pdfScale <= 0.6}
                        className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleZoom('in')} 
                        disabled={pdfScale >= 3.0}
                        className="p-1 hover:bg-white rounded transition-colors disabled:opacity-30"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => handleOpenAuth('settings')}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors border border-transparent hover:border-blue-100"
                    title="Teacher Settings Portal"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </header>

              <div className="flex-1 relative bg-slate-200 overflow-hidden">
                {!fileType && !isLoadingFile ? (
                  <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-100">
                    <div className="bg-white border-2 border-dashed border-slate-300 hover:border-blue-500 transition-colors rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Questionnaire</h3>
                      <p className="text-sm text-slate-500 mb-6">Select the test questionnaire file (PDF/DOCX/MD) to view beside your answer sheets.</p>
                      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors inline-block w-full shadow-sm">
                        Browse Files
                        <input 
                          type="file" 
                          accept=".pdf,.docx,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown" 
                          className="hidden" 
                          onChange={handleFileUpload} 
                        />
                      </label>
                    </div>
                  </div>
                ) : isLoadingFile ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-100">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 font-medium">Processing document...</p>
                  </div>
                ) : fileType === 'pdf' ? (
                  <div 
                    ref={scrollContainerRef}
                    onScroll={handlePdfScroll}
                    className="w-full h-full overflow-auto p-4 flex flex-col items-center gap-6 relative scroll-smooth animate-in fade-in duration-300"
                  >
                    {isRendering && (
                      <div className="fixed bottom-6 left-1/2 lg:left-1/4 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10 animate-pulse">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Rendering pages...
                      </div>
                    )}
                    {Array.from({ length: numPages }, (_, index) => (
                      <div key={index} className="relative group shadow-xl bg-white rounded-lg transition-transform duration-100 flex justify-center" style={{ minHeight: '500px', width: 'auto' }}>
                        <canvas 
                          ref={el => canvasRefs.current[index] = el}
                          className="max-w-full h-auto rounded-lg shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col bg-slate-100 overflow-hidden animate-in fade-in duration-300">
                    {fileType === 'md' && (
                      <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm z-10">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenAuth('markdown')}
                            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border shadow-sm transition-colors ${
                              isMdEditing ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {isMdEditing ? <Eye className="w-4 h-4 text-blue-600" /> : <Edit3 className="w-4 h-4 text-blue-600" />}
                            <span>{isMdEditing ? 'View Rendered Exam' : 'Edit Markdown'}</span>
                          </button>
                          
                          {isMdEditing && (
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-white hover:bg-emerald-50 px-4 py-2 rounded-lg border border-slate-300 hover:border-emerald-200 shadow-sm transition-colors cursor-pointer group">
                              <ImagePlus className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                              <span>Insert Image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    const url = URL.createObjectURL(e.target.files[0]);
                                    const textarea = mdTextareaRef.current;
                                    const start = textarea ? textarea.selectionStart : mdText.length;
                                    const end = textarea ? textarea.selectionEnd : mdText.length;
                                    
                                    const newMd = mdText.substring(0, start) + `\n\n![Image](${url})\n\n` + mdText.substring(end);
                                    setMdText(newMd);
                                    setDocxHtml(parseMarkdown(newMd));
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-8 shadow-inner relative">
                      {isMdEditing ? (
                        <textarea
                          ref={mdTextareaRef}
                          value={mdText}
                          onChange={(e) => {
                             setMdText(e.target.value);
                             setDocxHtml(parseMarkdown(e.target.value));
                          }}
                          className="w-full h-full min-h-[500px] p-6 bg-white text-slate-800 font-mono text-sm rounded-xl shadow-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                          placeholder="Type your markdown here..."
                        />
                      ) : (
                        <div className="docx-content max-w-4xl mx-auto bg-transparent font-sans">
                          <style>{`
                            .docx-content h1 { font-size: 1.8em; font-weight: 800; margin-bottom: 0.5em; color: #1e3a8a; }
                            .docx-content h2 { font-size: 1.5em; font-weight: 700; margin-top: 1em; margin-bottom: 0.5em; color: #1e40af; }
                            .docx-content h3 { font-size: 1.2em; font-weight: 600; margin-top: 1em; margin-bottom: 0.5em; color: #3b82f6; }
                            .docx-content table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 1.5em; border-radius: 0.5rem; overflow: hidden; border: 1px solid #e2e8f0; }
                            .docx-content th { background-color: #f8fafc; font-weight: 600; text-align: left; padding: 0.75rem 1rem; border-bottom: 2px solid #e2e8f0; }
                            .docx-content td { padding: 0.75rem 1rem; border-bottom: 1px solid #e2e8f0; background-color: #ffffff; }
                            .docx-content tr:last-child td { border-bottom: none; }
                            .docx-content pre { background: #1e293b; color: #f8fafc; padding: 1.2rem; border-radius: 0.75rem; overflow-x: auto; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                            .docx-content code { background: #e0f2fe; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; color: #0369a1; font-family: monospace; }
                            .docx-content pre code { background: transparent; color: inherit; padding: 0; }
                          `}</style>
                          <div dangerouslySetInnerHTML={{ __html: docxHtml }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Right Column: Secure Candidate Workspace Panel */}
            <section className="w-full lg:w-[450px] xl:w-[500px] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden shrink-0 h-[50vh] lg:h-full relative">
              
              {/* SUBMISSION VERIFIED MASK SCREEN */}
              {submitStatus === 'success' ? (
                <div className="flex-1 flex flex-col justify-between p-8 bg-slate-50 text-center animate-in fade-in duration-300">
                  <div className="my-auto flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <ShieldCheck className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Responses Locked & Submitted</h2>
                    <p className="text-sm text-slate-500 max-w-sm mt-3 leading-relaxed">
                      Your responses have been successfully locked and transmitted. Under standard assessment rules, individual responses cannot be viewed or modified after submission.
                    </p>
                    
                    <div className="w-full max-w-sm mt-8 space-y-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-left">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 mb-2">Student Particulars</div>
                      <div className="text-xs font-semibold text-slate-700 flex justify-between"><span>Name:</span> <span className="font-bold text-slate-900">{studentName}</span></div>
                      <div className="text-xs font-semibold text-slate-700 flex justify-between"><span>Section:</span> <span className="font-bold text-slate-900">{studentSection}</span></div>
                      <div className="text-xs font-semibold text-slate-700 flex justify-between"><span>LRN:</span> <span className="font-bold text-slate-900">{studentLRN}</span></div>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-sm mt-8">
                      <button
                        onClick={() => setShowTosModal(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        View Domain Scorecard
                      </button>
                      <button
                        onClick={handleReset}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <RefreshCcw className="w-4 h-4" />
                        Start Next Candidate
                      </button>
                    </div>
                  </div>

                  {/* Sidebar Footer Branding */}
                  <div className="text-center text-[10px] text-slate-400 font-semibold border-t pt-4">
                    <p>©2016-2026 wedoIT™Solutions</p>
                    <p className="text-[9px] text-slate-300">All rights reserved</p>
                  </div>
                </div>
              ) : (
                /* ACTIVE TEST PORTAL LAYOUT */
                <>
                  {/* Dynamic Countdown Header */}
                  <div className="bg-blue-50 p-4 border-b border-blue-100 shrink-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-bold text-blue-900 text-lg">Official Answer Sheet</h2>
                        <p className="text-xs text-blue-700 mt-0.5">Your input will auto-submit when the timer expires.</p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-sm flex items-center gap-1.5 transition-all ${
                        timeLeft < 300 
                          ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' 
                          : 'bg-white text-blue-900 border-blue-200'
                      }`}>
                        <Timer className="w-4 h-4" />
                        <span>{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Map Navigation */}
                  <div className="bg-slate-50 p-3 border-b border-slate-200 shrink-0">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                      <span>Question Progress Map</span>
                      <span className="text-blue-600 font-bold">{answers.filter(a => a.trim() !== '').length} / {answers.length} Complete</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-1 scrollbar-thin">
                      {answers.map((ans, i) => {
                        let btnStyle = ans.trim() !== '' 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                            : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-300';
                        
                        return (
                          <button
                            key={`map-${i}`}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToItem(i);
                            }}
                            className={`w-8 h-8 text-xs rounded font-bold flex items-center justify-center transition-all duration-200 ${btnStyle}`}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Active Input Workspace Sheet */}
                  <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 relative bg-white">
                    
                    <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-600 shrink-0 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{studentName}</span>
                        <span className="mx-2 text-slate-300">|</span>
                        <span>{studentSection}</span>
                      </div>
                      <span className="font-mono text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">LRN: {studentLRN}</span>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between mb-3 sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 border-b border-slate-100">
                        <h3 className="font-semibold text-slate-800 text-sm">Your Answers</h3>
                      </div>
                      
                      {answers.map((answer, index) => {
                        const itemType = getItemType(index + 1);
                        
                        let containerStyle = 'hover:bg-slate-50 border-transparent';
                        let numberStyle = answer.trim() !== '' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-100 text-slate-500 border-slate-200';
                        
                        if (answer.trim() === '' && submitStatus === 'error') {
                           containerStyle = 'bg-red-50/50 border-red-100';
                        }

                        return (
                          <div 
                            key={index} 
                            ref={el => itemRefs.current[index] = el}
                            className={`flex gap-3 items-start group p-2.5 rounded-lg transition-colors border ${containerStyle}`}
                          >
                            <div className={`font-bold h-10 w-10 rounded-md flex items-center justify-center shrink-0 border text-sm mt-0.5 ${numberStyle}`}>
                              {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5">
                              {renderItemInput(index, itemType)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit validation prompts and action anchor */}
                    <div className="mt-6 pt-4 pb-8 border-t border-slate-200 shrink-0">
                      {submitStatus === 'error' && (
                        <div className="bg-red-50 text-red-800 p-3 rounded-lg border border-red-200 flex items-start gap-2 mb-3 animate-in fade-in">
                          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
                          <div>
                            <p className="font-semibold text-sm">Cannot Submit</p>
                            <p className="text-xs mt-1 text-red-700">{validationError}</p>
                          </div>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-3.5 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
                          isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Encrypting & Transmitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Submit {answers.length} Items Now
                          </>
                        )}
                      </button>

                      {/* Small subtle Workspace Footer branding */}
                      <p className="text-center text-[10px] text-slate-400 mt-4 font-semibold">
                        ©2016-2026 wedoIT™Solutions • All rights reserved
                      </p>
                    </div>
                  </form>
                </>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}