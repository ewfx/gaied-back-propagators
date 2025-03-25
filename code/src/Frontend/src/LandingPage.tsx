import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FileUp, 
  X, 
  Send, 
  Zap, 
  Info
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [inputMode, setInputMode] = useState('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<{text: string, type: 'success' | 'error' | null} | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();


  const styles = {
    pageContainer: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      minHeight: '100vh',
      minWidth: '100vw',
      margin: 0,
      padding: 0,
      backgroundColor: '#ffffff',
      boxSizing: 'border-box' as const,
      position: 'fixed' as const,
      top: 0,
      left: 0
    },
    mainContainer: {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      borderRadius: 0,
      backgroundColor: 'white',
      boxShadow: 'none',
      overflow: 'auto'
    },
    gradientHeader: {
      background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
      padding: '1.5rem',
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      color: 'white',
      position: 'relative' as const,
      overflow: 'hidden' as const
    },
    headerContainer: {
      display: 'flex' as const, 
      alignItems: 'center' as const, 
      position: 'relative' as const, 
      zIndex: 2
    },
    headerTitle: {
      margin: 0, 
      fontSize: '1.5rem', 
      fontWeight: 600
    },
    toggleContainer: {
      backgroundColor: '#f9fafb',
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb'
    },
    toggleButtonGroup: {
      backgroundColor: '#e5e7eb',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      display: 'flex' as const,
      width: '20rem',
      margin: '0 auto',
      gap: '0.25rem'
    },
    toggleButton: (isActive: boolean) => ({
      flex: 1,
      padding: '0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: 500 as const,
      transition: 'all 0.2s',
      backgroundColor: isActive ? 'white' : 'transparent',
      color: isActive ? '#4f46e5' : '#4b5563',
      boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
      border: 'none',
      cursor: 'pointer' as const
    }),
    formContainer: {
      padding: '2rem',
      backgroundColor: 'linear-gradient(to bottom right, #f5f7fa, #e6e9f0)'
    },
    fileUploadContainer: (isHovering: boolean) => ({
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: `2px dashed ${isHovering ? '#4f46e5' : '#d1d5db'}`,
      textAlign: 'center' as const,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 15px -3px rgba(0, 0, 0, 0.05)',
      cursor: 'pointer' as const,
      transition: 'all 0.3s ease'
    }),
    actionButtonsContainer: {
      marginTop: '1.5rem',
      display: 'flex' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const
    },
    clearButton: {
      display: 'flex' as const,
      alignItems: 'center' as const,
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer' as const,
      transition: 'background-color 0.2s'
    },
    submitButton: (isDisabled: boolean) => ({
      display: 'flex' as const,
      alignItems: 'center' as const,
      padding: '0.5rem 1.5rem',
      borderRadius: '0.5rem',
      color: 'white',
      backgroundColor: isDisabled ? '#a5b4fc' : '#4f46e5',
      border: 'none',
      cursor: isDisabled ? 'not-allowed' as const : 'pointer' as const,
      transition: 'background-color 0.2s'
    }),
    footer: {
      backgroundColor: '#f3f4f6', 
      borderTop: '1px solid #e5e7eb', 
      padding: '1rem', 
      textAlign: 'center' as const,
      display: 'flex' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      gap: '0.5rem'
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setResult(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);

    try {
        const response = await axios.post('http://localhost:8080/classify', selectedFile);


      if (response.status === 200) {
        navigate('/results', { 
            state: { 
              classification: {
                reqType: response.data.reqType,
                subReqType: response.data.subReqType,
                primaryReqType: response.data.primaryReqType,
                confidence: response.data.confidence,
                keyDetails: response.data.keyDetails || []
              } 
            } 
          });
      } else {
        setResult({ text: 'Unexpected response. Please try again.', type: 'error' });
      }
    } catch (error) {
      setResult({ text: 'Error analyzing email. Please try again.', type: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
     
      <div style={styles.pageContainer}>
        <div style={styles.mainContainer}>
      
          <div style={styles.gradientHeader}>
            <div style={styles.headerContainer}>
              <Zap style={{marginRight: '0.75rem'}} color="white" size={32} />
              <h1 style={styles.headerTitle}>
                Email Classifier -
              </h1>
              <h2>
                Classify your email into different request and sub-request types
              </h2>
            </div>
          </div>

         
          <div style={styles.toggleContainer}>
            <div style={styles.toggleButtonGroup}>
              <button
                type="button"
                style={styles.toggleButton(inputMode === 'file')}
                onClick={() => setInputMode('file')}
              >
                Upload EML File
              </button>
            </div>
          </div>

        
          <form onSubmit={handleSubmit} style={styles.formContainer}>
            <div
              style={styles.fileUploadContainer(isHovering)}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".eml"
                style={{ display: 'none' }}
              />
              
              {selectedFile ? (
                <div style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#4f46e5'
                }}>
                  <FileUp style={{marginRight: '0.5rem'}} size={24} />
                  <span style={{fontWeight: 500}}>{selectedFile.name}</span>
                </div>
              ) : (
                <div>
                  <FileUp 
                    color="#4f46e5" 
                    style={{margin: '0 auto', marginBottom: '1rem'}} 
                    size={48} 
                  />
                  <p style={{color: '#4b5563', fontSize: '0.875rem'}}>
                    Drag and drop your .eml file here or click to browse
                  </p>
                  <p style={{
                    color: '#9ca3af', 
                    fontSize: '0.75rem', 
                    marginTop: '0.5rem'
                  }}>
                    Supported file type: .eml
                  </p>
                </div>
              )}
            </div>
            
            <div style={styles.actionButtonsContainer}>
              <button
                type="button"
                onClick={handleClear}
                style={styles.clearButton}
                aria-label="Clear input"
              >
                <X style={{marginRight: '0.5rem'}} size={16} />
                Clear
              </button>
              
              <button
                type="submit"
                disabled={isAnalyzing || !(selectedFile)}
                style={styles.submitButton(isAnalyzing || !(selectedFile))}
                aria-label="Classify Email"
              >
                {isAnalyzing ? (
                  <>
                    <div 
                      className="spinner" 
                      style={{
                        marginRight: '0.5rem', 
                        width: '1rem', 
                        height: '1rem'
                      }}
                    ></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send style={{marginRight: '0.5rem'}} size={16} />
                    Classify Email
                  </>
                )}
              </button>
            </div>
          </form>

        
          <div style={styles.footer}>
            <Info size={16} color="#6b7280" />
            <p style={{
              fontSize: '0.75rem', 
              color: '#6b7280',
              margin: 0
            }}>
              by Back-Propagatores AI Classification
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;