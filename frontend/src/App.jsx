
import { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Files,
  BarChart3,
  Settings,
  BrainCircuit,
  FileText,
  Database,
  Activity,
  Plus,
  Menu,
  X,
  CheckCircle2,
  Upload,
  Bot,
  Send,
  Zap,
  ArrowUpRight,
  Trash2,
} from "lucide-react";

import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chat states
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Document upload states
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "AI Chat", icon: MessageSquare },
    { name: "Documents", icon: Files },
    { name: "Evaluation", icon: BarChart3 },
  ];

  // --------------------------------
  // API ERROR HANDLING
  // --------------------------------
  const getApiError = async (response) => {
    try {
      const data = await response.json();

      if (Array.isArray(data.detail)) {
        return data.detail
          .map((item) => item.msg || JSON.stringify(item))
          .join(", ");
      }

      if (typeof data.detail === "string") {
        return data.detail;
      }

      return data.message || `Request failed: ${response.status}`;
    } catch {
      return `Request failed: ${response.status}`;
    }
  };

  // --------------------------------
  // AI CHAT FUNCTION
  // --------------------------------
  const handleAsk = async (e) => {
    e.preventDefault();

    const userQuestion = question.trim();

    if (!userQuestion || chatLoading) {
      return;
    }

    // Display user message
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");

    // Handle greetings without calling the LLM
    const greetingPattern =
      /^(hi|hii+|hello+|hey+|good morning|good afternoon|good evening|how are you)[!?. ,]*$/i;

    if (greetingPattern.test(userQuestion)) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Hello! Welcome to your Agentic RAG Assistant. I can help you understand Artificial Intelligence and Machine Learning topics from your uploaded documents. What would you like to learn today?",
        },
      ]);

      return;
    }

    // Send actual questions to backend
    setChatLoading(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          top_k: 3,
        }),
      });

      if (!response.ok) {
        throw new Error(await getApiError(response));
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            data.answer || "No answer received from the server.",
          sources: data.sources || [],
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: `Error: ${error.message}. Please check your backend and Ollama.`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // --------------------------------
  // PDF UPLOAD FUNCTION
  // --------------------------------
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadMessage("Please select a PDF file.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadMessage("Uploading and processing PDF...");

    try {
      const response = await fetch(`${API_URL}/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await getApiError(response));
      }

      const data = await response.json();

      setUploadMessage(
        `${data.filename} uploaded successfully! ${data.chunks_stored} chunks stored in ChromaDB.`
      );

      setDocuments((previous) => [
        {
          filename: data.filename,
          chunks: data.chunks_stored,
        },
        ...previous.filter(
          (doc) => doc.filename !== data.filename
        ),
      ]);
    } catch (error) {
      setUploadMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // --------------------------------
  // DASHBOARD PAGE
  // --------------------------------
  const renderDashboard = () => (
    <div className="page-content">

      <div className="page-heading">
        <p className="welcome-label">OVERVIEW</p>

        <h1>
          Welcome to <span>RAGFlow</span>
        </h1>

        <p className="welcome-description">
          Your intelligent domain-specific question answering system.
        </p>
      </div>

      <div className="stats-grid">

        <div className="panel stat-card">
          <div className="stat-icon">
            <Files size={22} />
          </div>
          <p>Total Documents</p>
          <h2>{documents.length + 1}</h2>
          <span>Previously indexed and current-session uploads</span>
        </div>

        <div className="panel stat-card">
          <div className="stat-icon">
            <Database size={22} />
          </div>
          <p>Vector Database</p>
          <h2>ChromaDB</h2>
          <span>Persistent storage</span>
        </div>

        <div className="panel stat-card">
          <div className="stat-icon">
            <BrainCircuit size={22} />
          </div>
          <p>Language Model</p>
          <h2>Qwen 2.5</h2>
          <span>Local language model</span>
        </div>

        <div className="panel stat-card">
          <div className="stat-icon">
            <Activity size={22} />
          </div>
          <p>System Status</p>
          <h2>Online</h2>
          <span>Backend integration configured</span>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>RAG Pipeline</h3>
              <p>How your question is processed</p>
            </div>
            <Zap size={20} />
          </div>

          <div className="pipeline">
            {[
              ["Document Ingestion", "Extract PDF text", Upload],
              ["Text Embedding", "Convert text into vectors", Database],
              ["Semantic Retrieval", "Retrieve relevant chunks", BrainCircuit],
              ["Answer Generation", "Generate answers using Qwen", Bot],
            ].map(([title, description, Icon]) => (
              <div className="pipeline-step" key={title}>
                <div className="pipeline-icon">
                  <Icon size={20} />
                </div>

                <div>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>

                <CheckCircle2 size={18} />
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Continue working on your project</p>
            </div>
            <ArrowUpRight size={20} />
          </div>

          {[
            ["Start AI Chat", "Ask questions about documents", "AI Chat", MessageSquare],
            ["Upload Documents", "Add PDF files", "Documents", Upload],
            ["Evaluate System", "Explore RAG evaluation", "Evaluation", BarChart3],
          ].map(([title, description, page, Icon]) => (
            <button
              className="quick-action"
              key={page}
              onClick={() => setActivePage(page)}
            >
              <Icon size={20} />

              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>

              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>

      </div>
    </div>
  );

  // --------------------------------
  // AI CHAT PAGE
  // --------------------------------
  const renderChat = () => (
    <div className="page-content">

      <div className="page-heading">
        <p className="welcome-label">INTELLIGENT ASSISTANT</p>

        <h1>
          AI <span>Chat</span>
        </h1>

        <p className="welcome-description">
          Ask questions about your uploaded AI and ML documents.
        </p>
      </div>

      <div className="panel chat-panel">

        <div className="chat-messages">

          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="placeholder-icon">
                <Bot size={35} />
              </div>

              <h2>How can I help you?</h2>

              <p>
                Ask questions about your uploaded documents.
                Qwen will generate answers using retrieved context.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
            >
              <strong>
                {message.role === "user"
                  ? "You"
                  : "RAG Assistant"}
              </strong>

              <p>{message.content}</p>

              {message.sources?.length > 0 && (
                <div className="message-sources">
                  <strong>Retrieved Sources</strong>

                  {message.sources.map((source, i) => (
                    <div key={i}>
                      {source.source} - Chunk {source.chunk_index}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {chatLoading && (
            <div className="message assistant">
              <strong>RAG Assistant</strong>
              <p>
                Thinking... Retrieving information and generating answer.
              </p>
            </div>
          )}

        </div>

        <form
          className="chat-input-preview"
          onSubmit={handleAsk}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your documents..."
            disabled={chatLoading}
          />

          <button
            type="submit"
            disabled={chatLoading || !question.trim()}
            aria-label="Send question"
          >
            <Send size={18} />
          </button>
        </form>

        <p className="coming-soon">
          <BrainCircuit size={14} />
          Powered by Qwen 2.5 · Local LLM
        </p>

      </div>

      <button
        className="clear-chat-button"
        onClick={() => setMessages([])}
      >
        <Trash2 size={15} />
        Clear conversation
      </button>

    </div>
  );

  // --------------------------------
  // DOCUMENTS PAGE
  // --------------------------------
  const renderDocuments = () => (
    <div className="page-content">

      <div className="page-heading">
        <p className="welcome-label">KNOWLEDGE MANAGEMENT</p>

        <h1>
          My <span>Documents</span>
        </h1>

        <p className="welcome-description">
          Upload PDF documents to build your AI knowledge base.
        </p>
      </div>

      <div className="panel documents-management">
        <div className="upload-area">

          <div className="placeholder-icon">
            <Upload size={35} />
          </div>

          <h2>Upload your documents</h2>

          <p>Select a PDF file from your computer.</p>

          <label
            htmlFor="pdf-upload"
            className="primary-button upload-label"
          >
            <Plus size={17} />
            {uploading ? "Processing..." : "Choose PDF"}
          </label>

          <input
            id="pdf-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />

          {uploadMessage && (
            <p className="upload-feedback">
              {uploadMessage}
            </p>
          )}

        </div>
      </div>

      <div className="panel">

        <div className="panel-header">
          <div>
            <h3>Existing Documents</h3>
            <p>Previously indexed and current-session uploads</p>
          </div>

          <Files size={20} />
        </div>

        <div className="document-row">
          <div className="document-icon">
            <FileText size={23} />
          </div>

          <div className="document-info">
            <h4>AI.pdf</h4>
            <p>Previously indexed · 930 chunks</p>
          </div>

          <div className="document-status">
            <CheckCircle2 size={15} />
            Processed
          </div>
        </div>

        {documents.map((doc) => (
          <div className="document-row" key={doc.filename}>
            <div className="document-icon">
              <FileText size={23} />
            </div>

            <div className="document-info">
              <h4>{doc.filename}</h4>
              <p>PDF Document · {doc.chunks} chunks</p>
            </div>

            <div className="document-status">
              <CheckCircle2 size={15} />
              Processed
            </div>
          </div>
        ))}

      </div>
    </div>
  );

  // --------------------------------
  // EVALUATION PAGE
  // --------------------------------
  const renderEvaluation = () => (
    <div className="page-content">

      <div className="page-heading">
        <p className="welcome-label">PERFORMANCE ANALYTICS</p>

        <h1>
          System <span>Evaluation</span>
        </h1>

        <p className="welcome-description">
          Evaluate the reliability and performance of your RAG system.
        </p>
      </div>

      <div className="panel evaluation-placeholder">

        <div className="placeholder-icon">
          <BarChart3 size={35} />
        </div>

        <h2>Evaluation Module</h2>

        <p>
          RAGAS evaluation will be integrated here.
          This module will measure faithfulness, answer relevancy,
          and context precision.
        </p>

      </div>
    </div>
  );

  // --------------------------------
  // PAGE NAVIGATION
  // --------------------------------
  const renderPage = () => {
    switch (activePage) {
      case "AI Chat":
        return renderChat();

      case "Documents":
        return renderDocuments();

      case "Evaluation":
        return renderEvaluation();

      default:
        return renderDashboard();
    }
  };

  // --------------------------------
  // MAIN APPLICATION LAYOUT
  // --------------------------------
  return (
    <div className="app-container">

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="sidebar-brand">

          <div className="brand-icon">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h2>RAGFlow</h2>
            <p>AI KNOWLEDGE SYSTEM</p>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>

        </div>

        <div className="sidebar-section">

          <p className="sidebar-label">WORKSPACE</p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}

        </div>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="sidebar-status">
            <span className="status-dot" />
            <span>System Online</span>
          </div>

          <p className="sidebar-version">
            Agentic RAG System · v1.0
          </p>

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="topbar-title">
            <span>Workspace</span>
            <strong>/ {activePage}</strong>
          </div>

          <div className="topbar-right">
            <div className="topbar-status">
              <span className="status-dot" />
              Online
            </div>

            <div className="profile-avatar">AI</div>
          </div>

        </header>

        {renderPage()}

      </main>
    </div>
  );
}

export default App;
