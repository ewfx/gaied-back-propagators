import React, { useState, useRef } from 'react';
import { CSSProperties } from 'react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<{text: string, type: 'success' | 'error' | null} | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const styles = {
    pageContainer: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    },
    gradientHeader: {
      background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      flexShrink: 0
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      maxWidth: '800px',
      width: '100%'
    },
    headerTitle: {
      margin: 0,
      fontSize: '1.5rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    headerSubtitle: {
      margin: 0,
      fontSize: '0.875rem',
      opacity: 0.8,
      marginLeft: '50px'
    },
    formContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      overflow: 'auto'
    },
    fileUploadContainer: (isHovering: boolean) => ({
      flex: 1,
      backgroundColor: 'white',
      border: `2px dashed ${isHovering ? '#4f46e5' : '#d1d5db'}`,
      borderRadius: '12px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }),
    actionButtonsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      gap: '1rem'
    },
    clearButton: {
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    submitButton: (isDisabled: boolean) => ({
      backgroundColor: isDisabled ? '#a5b4fc' : '#4f46e5',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      border: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }),
    footer: {
      backgroundColor: '#f3f4f6',
      padding: '1rem',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      flexShrink: 0
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
      const formData = new FormData();
      if (selectedFile) {
        formData.append('email_file', selectedFile);
      }

      const response = await axios.post('http://127.0.0.1:5000/process_email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });


      if (response.status === 200) {

        console.log(response.data);
        console.log("Hi")
        console.log(response.data.request_type);
        
        navigate('/results', { 
          state: { 
            classification: {
              request_type: response.data.request_type,
              sub_request_type: response.data.sub_request_type,
              primary_request: response.data.primary_request,
              sender_address: response.data.sender_address,
              confidence_score: response.data.confidence_score,
              key_values: response.data.key_values || {}
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
    <div style={styles.pageContainer as CSSProperties}>
      <div style={styles.gradientHeader}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>
            <Zap size={32} />
            Email Classifier
          </h1>
          <p style={styles.headerSubtitle}>
            Classify your email into different request and sub-request types
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.formContainer as CSSProperties}>
        <div
          style={styles.fileUploadContainer(isHovering)as CSSProperties}
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
              <span style={{fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'}}>
                {selectedFile.name}
              </span>
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
            <X size={16} />
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
                <Send size={16} />
                Classify Email
              </>
            )}
          </button>
        </div>
      </form>

      <div style={styles.footer as CSSProperties}>
        <Info size={16} />
        <span>by Back-Propagatores AI Classification</span>
      </div>
    </div>
  );
};

export default LandingPage;