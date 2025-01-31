import React, { useState } from "react";
import axios from "axios";

const ResumeUploader = () => {
    const [resume, setResume] = useState(null);
    const [fileName, setFileName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResume(file);
            setFileName(file.name);
        }
    };

    const handleJobDescriptionChange = (e) => {
        setJobDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resume || !jobDescription.trim()) {
            alert('Please upload a file and provide a job description before submitting.');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('jobDescription', jobDescription);

        
        try {
            const response = await axios.post('https://resume-review-backend.onrender.com/api/upload-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAnalysisResult(response.data);
            alert('Resume analyzed successfully!');
        } catch (error) {
            console.error('Error uploading resume:', error);
            alert('Failed to analyze resume. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg rounded-3 border-0">
                <div className="card-header bg-primary text-white py-3">
                    <h2 className="text-center mb-0">
                        <i className="bi bi-file-earmark-arrow-up me-2"></i>
                        Upload Your Resume
                    </h2>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="border rounded-2 p-4 h-100">
                                    <label htmlFor="resumeInput" className="form-label fw-bold text-muted">
                                        Select Resume (PDF/DOC)
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            id="resumeInput"
                                            className="form-control"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                        <span className="input-group-text">
                                            <i className="bi bi-folder2-open"></i>
                                        </span>
                                    </div>


                                    {resume && (
                                        <div className="mt-3 alert alert-success d-flex align-items-center">
                                            <i className="bi bi-file-check fs-4 me-2"></i>
                                            <div>
                                                <strong>{fileName}</strong>
                                                <div className="text-muted small">
                                                    {(resume.size / 1024).toFixed(2)} KB - {resume.type.split('/')[1].toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="border rounded-2 p-4 h-100">
                                    <label htmlFor="jdInput" className="form-label fw-bold text-muted">
                                        Job Description
                                    </label>
                                    <textarea
                                        id="jdInput"
                                        className="form-control"
                                        rows="5"
                                        placeholder="Paste job description here..."
                                        style={{ resize: 'none' }}
                                        value={jobDescription}
                                        onChange={handleJobDescriptionChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>


                        <div className="d-grid gap-2 mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg rounded-pill"
                                disabled={!resume || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="bi bi-hourglass-split me-2"></i>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cloud-arrow-up me-2"></i>
                                        Analyze Resume
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center mt-3 text-muted small">
                            Supported formats: PDF
                        </div>
                    </form>

                    {/* Loader Section */}
                    {isLoading && (
                        <div className="text-center mt-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Please wait, analyzing your resume...</p>
                        </div>
                    )}

                    {/* Analysis Result Section */}
                    {analysisResult && (
                        <div className="mt-4">
                            <h4 className="text-primary">Analysis Result</h4>
                            <div className="bg-light p-3 rounded">
                                <h5 className="fw-bold">ATS Score: {analysisResult.atsScore.atsScore}</h5>
                                <ul>
                                    {Object.entries(analysisResult.atsScore.breakdown).map(([key, value]) => (
                                        <li key={key} className="text-muted">
                                            <strong>{key.replace(/([A-Z])/g, ' $1')}: </strong> {value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeUploader;
