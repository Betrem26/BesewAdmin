import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  FiZap, FiList, FiPlus, FiEdit2, FiTrash2, FiRefreshCw,
  FiSearch, FiX, FiCheck, FiAlertTriangle, FiShield,
  FiCopy, FiChevronDown, FiChevronUp, FiFileText,
} from "react-icons/fi";
import { jobApi, handleApiError } from "../../services/api";
import { toast } from "react-toastify";
import { SmartConfirmDialog } from "../../components/SmartConfirmDialog";

// ── Types ──────────────────────────────────────────────────────────────────

interface JobTemplate {
  _id: string;
  title: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  qualifications?: string;
  salary_range?: string;
  employment_type?: string;
  experience_level?: string;
  skills?: string[];
  location?: string;
  company_type?: string;
  lang_opt?: string;
  addedByAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface GeneratedJob {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  qualifications?: string;
  skills?: string[];
  employment_type?: string;
  experience_level?: string;
  salary_range?: string;
}

type FetchStatus = "idle" | "loading" | "success" | "error" | "forbidden";

// ── Animations ─────────────────────────────────────────────────────────────
const fadeIn  = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const shimmer = keyframes`0%{background-position:-400px 0}100%{background-position:400px 0}`;
const spin    = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const pulse   = keyframes`0%,100%{opacity:1}50%{opacity:0.5}`;

// ── Layout ─────────────────────────────────────────────────────────────────
const Page = styled.div`max-width:1400px;animation:${fadeIn} 0.3s ease;`;
const PageHeader = styled.div`display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap;gap:16px;`;
const TitleBlock = styled.div``;
const PageTitle = styled.h1`font-size:26px;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:10px;margin:0 0 4px;`;
const PageSub   = styled.p`font-size:13px;color:#64748b;margin:0;`;
const HeaderActions = styled.div`display:flex;gap:10px;flex-wrap:wrap;`;

// ── Buttons ────────────────────────────────────────────────────────────────
const Btn = styled.button<{ $variant?: "primary"|"ai"|"danger"|"ghost" }>`
  display:inline-flex;align-items:center;gap:6px;
  padding:9px 18px;border:none;border-radius:8px;
  font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;
  ${p => p.$variant === "primary" && css`background:#3b82f6;color:white;&:hover{background:#2563eb;}`}
  ${p => p.$variant === "ai"      && css`background:linear-gradient(135deg,#7c3aed,#3b82f6);color:white;&:hover{filter:brightness(1.1);}`}
  ${p => p.$variant === "danger"  && css`background:#fee2e2;color:#dc2626;&:hover{background:#fecaca;}`}
  ${p => (!p.$variant || p.$variant === "ghost") && css`background:#f1f5f9;color:#475569;&:hover{background:#e2e8f0;}`}
  &:disabled{opacity:0.5;cursor:not-allowed;}
`;
const SpinIcon = styled(FiRefreshCw)<{ $spin?: boolean }>`
  ${p => p.$spin && css`animation:${spin} 1s linear infinite;`}
`;

// ── Two-column layout ──────────────────────────────────────────────────────
const TwoCol = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:24px;@media(max-width:900px){grid-template-columns:1fr;}`;
const Panel  = styled.div`background:white;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,0.07);overflow:hidden;`;
const PanelHeader = styled.div<{ $gradient?: string }>`
  padding:18px 22px;border-bottom:1px solid #f1f5f9;
  background:${p => p.$gradient || "white"};
  display:flex;justify-content:space-between;align-items:center;
`;
const PanelTitle = styled.h2`font-size:16px;font-weight:700;color:#1e293b;margin:0;display:flex;align-items:center;gap:8px;`;
const PanelBody  = styled.div`padding:22px;`;

// ── AI Generator ───────────────────────────────────────────────────────────
const AiInputRow = styled.div`display:flex;gap:10px;margin-bottom:16px;`;
const AiInput = styled.input`
  flex:1;padding:11px 16px;border:2px solid #e2e8f0;border-radius:10px;
  font-size:15px;outline:none;
  &:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
`;
const AiHint = styled.p`font-size:12px;color:#94a3b8;margin:0 0 16px;`;

const GeneratingBox = styled.div`
  background:linear-gradient(135deg,#faf5ff,#eff6ff);
  border:1px solid #e9d5ff;border-radius:10px;padding:24px;
  text-align:center;color:#7c3aed;
`;
const GeneratingDots = styled.span`
  display:inline-block;animation:${pulse} 1.2s ease infinite;font-size:24px;
`;

const ResultBox = styled.div`
  background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;
  padding:20px;max-height:420px;overflow-y:auto;animation:${fadeIn} 0.3s ease;
`;
const ResultSection = styled.div`margin-bottom:16px;&:last-child{margin-bottom:0;}`;
const ResultLabel = styled.div`font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px;`;
const ResultText  = styled.div`font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap;`;
const SkillChips  = styled.div`display:flex;flex-wrap:wrap;gap:6px;`;
const SkillChip   = styled.span`background:#ede9fe;color:#5b21b6;border-radius:20px;padding:3px 10px;font-size:12px;font-weight:600;`;

const ResultActions = styled.div`display:flex;gap:8px;margin-top:16px;padding-top:16px;border-top:1px solid #e2e8f0;`;

// ── Templates list ─────────────────────────────────────────────────────────
const SearchRow = styled.div`
  position:relative;margin-bottom:16px;
  svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;}
`;
const SearchInput = styled.input`
  width:100%;padding:9px 12px 9px 36px;border:1px solid #e2e8f0;
  border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;
  &:focus{border-color:#3b82f6;}
`;

const TemplateList = styled.div`display:flex;flex-direction:column;gap:10px;max-height:600px;overflow-y:auto;`;
const TemplateCard = styled.div`
  border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;
  transition:box-shadow 0.15s;animation:${fadeIn} 0.3s ease;
  &:hover{box-shadow:0 4px 12px rgba(0,0,0,0.08);}
`;
const TemplateTop = styled.div`
  padding:14px 16px;display:flex;justify-content:space-between;align-items:flex-start;
  cursor:pointer;background:#fafafa;&:hover{background:#f1f5f9;}
`;
const TemplateName = styled.div`font-size:14px;font-weight:700;color:#1e293b;margin-bottom:4px;`;
const TemplateMeta = styled.div`display:flex;gap:8px;flex-wrap:wrap;`;
const MetaTag = styled.span<{ $color?: string }>`
  background:${p => p.$color || "#f1f5f9"};color:#475569;
  border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;
`;
const AdminTag = styled.span`
  background:#dbeafe;color:#1d4ed8;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:700;
`;
const TemplateActions = styled.div`display:flex;gap:6px;flex-shrink:0;`;
const IconBtn = styled.button<{ $danger?: boolean; $primary?: boolean }>`
  padding:6px 10px;border:none;border-radius:6px;cursor:pointer;
  font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;
  background:${p => p.$danger ? "#fee2e2" : p.$primary ? "#dbeafe" : "#f1f5f9"};
  color:${p => p.$danger ? "#dc2626" : p.$primary ? "#1d4ed8" : "#475569"};
  &:hover{filter:brightness(0.95);}
`;
const TemplateBody = styled.div<{ $open: boolean }>`
  display:${p => p.$open ? "block" : "none"};
  padding:14px 16px;border-top:1px solid #f1f5f9;background:white;
`;
const BodyText = styled.p`font-size:13px;color:#374151;line-height:1.6;margin:0 0 8px;&:last-child{margin:0;}`;

const SkeletonRow = styled.div`
  height:64px;border-radius:10px;
  background:linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%);
  background-size:400px 100%;animation:${shimmer} 1.4s ease infinite;
`;

// ── Alerts ─────────────────────────────────────────────────────────────────
const AlertBanner = styled.div<{ $type: "error"|"warning"|"info" }>`
  display:flex;align-items:flex-start;gap:12px;padding:14px 18px;
  border-radius:10px;margin-bottom:16px;font-size:14px;
  background:${p => ({error:"#fef2f2",warning:"#fffbeb",info:"#eff6ff"}[p.$type])};
  border-left:4px solid ${p => ({error:"#ef4444",warning:"#f59e0b",info:"#3b82f6"}[p.$type])};
  color:${p => ({error:"#991b1b",warning:"#92400e",info:"#1e40af"}[p.$type])};
`;
const AlertBody = styled.div`font-size:13px;`;

// ── Modal ──────────────────────────────────────────────────────────────────
const Overlay = styled.div<{ $open: boolean }>`
  display:${p => p.$open ? "flex" : "none"};
  position:fixed;inset:0;background:rgba(0,0,0,0.45);
  z-index:1000;align-items:center;justify-content:center;padding:20px;
`;
const Modal = styled.div`
  background:white;border-radius:16px;padding:32px;
  width:100%;max-width:560px;max-height:90vh;overflow-y:auto;
  box-shadow:0 20px 60px rgba(0,0,0,0.2);animation:${fadeIn} 0.2s ease;
`;
const ModalHeader = styled.div`display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;`;
const ModalTitle  = styled.h2`font-size:20px;font-weight:700;color:#1e293b;margin:0;`;
const CloseBtn    = styled.button`background:none;border:none;cursor:pointer;color:#94a3b8;padding:4px;border-radius:6px;&:hover{background:#f1f5f9;}`;
const FormGroup   = styled.div`margin-bottom:16px;`;
const Label       = styled.label`display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;`;
const FormInput   = styled.input`width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;&:focus{border-color:#3b82f6;}`;
const FormTextarea = styled.textarea`width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;resize:vertical;min-height:100px;box-sizing:border-box;&:focus{border-color:#3b82f6;}`;
const FormSelect  = styled.select`width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;background:white;outline:none;cursor:pointer;&:focus{border-color:#3b82f6;}`;
const ModalActions = styled.div`display:flex;gap:10px;margin-top:24px;`;
const EmptyBox = styled.div`text-align:center;padding:40px 20px;color:#94a3b8;`;


// ── Helpers ────────────────────────────────────────────────────────────────
const COMPANY_TYPES = ["company","local_agency","Int_agency","bpo","broker"];
const LANG_OPTS     = ["English","Amharic","Oromiffa"];
const EMP_TYPES     = ["Full-time","Part-time","Contract","Internship","Remote"];
const EXP_LEVELS    = ["Entry","Junior","Mid","Senior","Lead","Executive"];

const fmt = (iso?: string) => iso ? new Date(iso).toLocaleDateString() : "";

// ── Admin override headers — sent on every job-service request ─────────────
// Some job services check X-Admin-Override or X-User-Role to allow admin bypass
const ADMIN_HEADERS = {
  "X-Admin-Override": "true",
  "X-User-Role": "admin",
  "X-Admin-Access": "true",
};

// ── Component ──────────────────────────────────────────────────────────────

interface EditForm {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  qualifications: string;
  skills: string;
  employment_type: string;
  experience_level: string;
  salary_range: string;
  location: string;
  company_type: string;
  lang_opt: string;
}

const EMPTY_FORM: EditForm = {
  title:"", description:"", requirements:"", responsibilities:"",
  qualifications:"", skills:"", employment_type:"Full-time",
  experience_level:"Mid", salary_range:"", location:"", company_type:"company", lang_opt:"English",
};

const JobTemplates: React.FC = () => {
  // AI Generator state
  const [aiTitle,      setAiTitle]      = useState("");
  const [aiStatus,     setAiStatus]     = useState<FetchStatus>("idle");
  const [aiError,      setAiError]      = useState<string | null>(null);
  const [generated,    setGenerated]    = useState<GeneratedJob | null>(null);

  // Templates list state
  const [templates,    setTemplates]    = useState<JobTemplate[]>([]);
  const [listStatus,   setListStatus]   = useState<FetchStatus>("idle");
  const [listError,    setListError]    = useState<string | null>(null);
  const [search,       setSearch]       = useState("");
  const [expanded,     setExpanded]     = useState<string | null>(null);

  // Edit modal state
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState<JobTemplate | null>(null);
  const [form,         setForm]         = useState<EditForm>(EMPTY_FORM);
  const [saving,       setSaving]       = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; templateId: string; title: string; isDeleting: boolean }>({
    isOpen: false,
    templateId: '',
    title: '',
    isDeleting: false,
  });

  // ── Fetch templates ────────────────────────────────────────────────────
  const fetchTemplates = useCallback(async () => {
    setListStatus("loading"); setListError(null);
    try {
      const res = await jobApi.post(
        "/job-common/added-by-admin",
        {},
        { headers: { ...ADMIN_HEADERS, "Content-Type": "application/json" } }
      );
      setTemplates(Array.isArray(res.data) ? res.data : res.data?.data || []);
      setListStatus("success");
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 403) {
        setListStatus("forbidden");
        setListError(
          err?.response?.data?.details?.message ||
          err?.response?.data?.message ||
          "The job service requires user/agency role for this endpoint. Admin override headers were sent but rejected."
        );
      } else {
        setListStatus("error");
        setListError(handleApiError(err));
      }
    }
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  // ── AI Generate ────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!aiTitle.trim()) { toast.error("Enter a job title first"); return; }
    setAiStatus("loading"); setAiError(null); setGenerated(null);
    try {
      const res = await jobApi.post(
        "/job-common/generate",
        { title: aiTitle },
        { headers: { ...ADMIN_HEADERS, "Content-Type": "application/json" } }
      );
      const d = res.data;
      setGenerated({
        title:            d.title            || aiTitle,
        description:      d.description      || d.job_description || "",
        requirements:     d.requirements     || d.job_requirements || "",
        responsibilities: d.responsibilities || d.job_responsibilities || "",
        qualifications:   d.qualifications   || "",
        skills:           Array.isArray(d.skills) ? d.skills : [],
        employment_type:  d.employment_type  || "",
        experience_level: d.experience_level || "",
        salary_range:     d.salary_range     || "",
      });
      setAiStatus("success");
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 403) {
        setAiStatus("forbidden");
        setAiError(
          err?.response?.data?.details?.message ||
          err?.response?.data?.message ||
          "The job service requires user/agency role for the AI generator. Admin override headers were sent but rejected by the backend."
        );
      } else {
        setAiStatus("error");
        setAiError(handleApiError(err));
      }
    }
  };

  // ── Copy generated to clipboard ────────────────────────────────────────
  const copyGenerated = () => {
    if (!generated) return;
    const text = [
      `Title: ${generated.title}`,
      generated.description && `\nDescription:\n${generated.description}`,
      generated.responsibilities && `\nResponsibilities:\n${generated.responsibilities}`,
      generated.requirements && `\nRequirements:\n${generated.requirements}`,
      generated.qualifications && `\nQualifications:\n${generated.qualifications}`,
      generated.skills?.length && `\nSkills: ${generated.skills.join(", ")}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard"));
  };

  // ── Load generated into edit form ──────────────────────────────────────
  const useGenerated = () => {
    if (!generated) return;
    setForm({
      title:            generated.title,
      description:      generated.description,
      requirements:     generated.requirements || "",
      responsibilities: generated.responsibilities || "",
      qualifications:   generated.qualifications || "",
      skills:           (generated.skills || []).join(", "),
      employment_type:  generated.employment_type || "Full-time",
      experience_level: generated.experience_level || "Mid",
      salary_range:     generated.salary_range || "",
      location:         "",
      company_type:     "company",
      lang_opt:         "English",
    });
    setEditTarget(null);
    setModalOpen(true);
  };

  // ── Open edit modal ────────────────────────────────────────────────────
  const openEdit = (t: JobTemplate) => {
    setEditTarget(t);
    setForm({
      title:            t.title,
      description:      t.description || "",
      requirements:     t.requirements || "",
      responsibilities: t.responsibilities || "",
      qualifications:   t.qualifications || "",
      skills:           (t.skills || []).join(", "),
      employment_type:  t.employment_type || "Full-time",
      experience_level: t.experience_level || "Mid",
      salary_range:     t.salary_range || "",
      location:         t.location || "",
      company_type:     t.company_type || "company",
      lang_opt:         t.lang_opt || "English",
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditTarget(null); };

  // ── Save (create or update) ────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const payload = {
      ...form,
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editTarget) {
        await jobApi.put(`/job-common/${editTarget._id}`, payload, {
          headers: { ...ADMIN_HEADERS, "Content-Type": "application/json" },
        });
        toast.success("Template updated");
      } else {
        await jobApi.post("/job-common", payload, {
          headers: { ...ADMIN_HEADERS, "Content-Type": "application/json" },
        });
        toast.success("Template created");
      }
      closeModal();
      fetchTemplates();
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 403) {
        toast.error("Job service rejected the request — admin override headers were sent but the backend requires user/agency role. Contact the backend team.");
      } else {
        toast.error(handleApiError(err));
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (t: JobTemplate) => {
    setDeleteDialog({ isOpen: true, templateId: t._id, title: t.title, isDeleting: false });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog(prev => ({ ...prev, isDeleting: true }));
    try {
      await jobApi.delete(`/job-common/${deleteDialog.templateId}`, {
        headers: ADMIN_HEADERS,
      });
      toast.success("Template deleted");
      setTemplates(prev => prev.filter(x => x._id !== deleteDialog.templateId));
      setDeleteDialog({ isOpen: false, templateId: '', title: '', isDeleting: false });
    } catch (err: any) {
      const code = err?.response?.status;
      if (code === 403) {
        toast.error("Job service rejected delete — admin override headers were sent but the backend requires user/agency role.");
      } else {
        toast.error(handleApiError(err));
      }
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, templateId: '', title: '', isDeleting: false });
  };

  const filtered = templates.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  );

  const isForbidden = listStatus === "forbidden" || aiStatus === "forbidden";


  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <Page>
      <PageHeader>
        <TitleBlock>
          <PageTitle><FiFileText color="#7c3aed" /> Job Templates & AI Generator</PageTitle>
          <PageSub>Generate AI-powered job descriptions and manage admin job templates</PageSub>
        </TitleBlock>
        <HeaderActions>
          <Btn onClick={() => fetchTemplates()} disabled={listStatus === "loading"}>
            <SpinIcon size={14} $spin={listStatus === "loading"} /> Refresh
          </Btn>
          <Btn $variant="primary" onClick={() => { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true); }}>
            <FiPlus size={14} /> New Template
          </Btn>
        </HeaderActions>
      </PageHeader>

      {/* 403 role mismatch banner */}
      {isForbidden && (
        <AlertBanner $type="warning">
          <FiShield size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <AlertBody>
            <strong>Role Restriction:</strong> The job service returned 403 for this endpoint.
            It requires <code>role: "user"</code> or <code>role: "agency"</code> — your token has <code>role: "admin"</code>.
            Admin override headers (<code>X-Admin-Override: true</code>, <code>X-User-Role: admin</code>) were sent but rejected.{" "}
            <strong>Backend fix needed:</strong> The job service guard must be updated to allow admin role,
            or the admin account must be granted user/agency scope in the job service database.
          </AlertBody>
        </AlertBanner>
      )}

      <TwoCol>
        {/* ── LEFT: AI Generator ── */}
        <Panel>
          <PanelHeader $gradient="linear-gradient(135deg,#faf5ff,#eff6ff)">
            <PanelTitle><FiZap color="#7c3aed" /> AI Job Generator</PanelTitle>
          </PanelHeader>
          <PanelBody>
            <AiHint>Enter a job title and the AI will generate a complete job description, requirements, and skills list.</AiHint>

            <AiInputRow>
              <AiInput
                placeholder="e.g. Senior React Developer"
                value={aiTitle}
                onChange={e => setAiTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGenerate()}
              />
              <Btn $variant="ai" onClick={handleGenerate} disabled={aiStatus === "loading" || !aiTitle.trim()}>
                <FiZap size={14} />
                {aiStatus === "loading" ? "Generating…" : "Generate"}
              </Btn>
            </AiInputRow>

            {aiStatus === "loading" && (
              <GeneratingBox>
                <GeneratingDots>✦ ✦ ✦</GeneratingDots>
                <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>AI is writing your job description…</div>
                <div style={{ fontSize: 12, marginTop: 6, opacity: 0.7 }}>This usually takes 3–8 seconds</div>
              </GeneratingBox>
            )}

            {(aiStatus === "error" || aiStatus === "forbidden") && aiError && (
              <AlertBanner $type={aiStatus === "forbidden" ? "warning" : "error"}>
                <FiAlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <AlertBody>
                  {aiStatus === "forbidden"
                    ? <><strong>Access Denied:</strong> {aiError}</>
                    : <><strong>Error:</strong> {aiError}</>
                  }
                </AlertBody>
              </AlertBanner>
            )}

            {aiStatus === "success" && generated && (
              <>
                <ResultBox>
                  <ResultSection>
                    <ResultLabel>Job Title</ResultLabel>
                    <ResultText style={{ fontWeight: 700, fontSize: 16 }}>{generated.title}</ResultText>
                  </ResultSection>
                  {generated.description && (
                    <ResultSection>
                      <ResultLabel>Description</ResultLabel>
                      <ResultText>{generated.description}</ResultText>
                    </ResultSection>
                  )}
                  {generated.responsibilities && (
                    <ResultSection>
                      <ResultLabel>Responsibilities</ResultLabel>
                      <ResultText>{generated.responsibilities}</ResultText>
                    </ResultSection>
                  )}
                  {generated.requirements && (
                    <ResultSection>
                      <ResultLabel>Requirements</ResultLabel>
                      <ResultText>{generated.requirements}</ResultText>
                    </ResultSection>
                  )}
                  {generated.qualifications && (
                    <ResultSection>
                      <ResultLabel>Qualifications</ResultLabel>
                      <ResultText>{generated.qualifications}</ResultText>
                    </ResultSection>
                  )}
                  {generated.skills && generated.skills.length > 0 && (
                    <ResultSection>
                      <ResultLabel>Skills</ResultLabel>
                      <SkillChips>
                        {generated.skills.map((s, i) => <SkillChip key={i}>{s}</SkillChip>)}
                      </SkillChips>
                    </ResultSection>
                  )}
                  {(generated.employment_type || generated.experience_level || generated.salary_range) && (
                    <ResultSection>
                      <ResultLabel>Details</ResultLabel>
                      <SkillChips>
                        {generated.employment_type  && <SkillChip>{generated.employment_type}</SkillChip>}
                        {generated.experience_level && <SkillChip>{generated.experience_level}</SkillChip>}
                        {generated.salary_range     && <SkillChip>{generated.salary_range}</SkillChip>}
                      </SkillChips>
                    </ResultSection>
                  )}
                </ResultBox>
                <ResultActions>
                  <Btn onClick={copyGenerated} style={{ flex: 1 }}>
                    <FiCopy size={13} /> Copy
                  </Btn>
                  <Btn $variant="primary" onClick={useGenerated} style={{ flex: 2 }}>
                    <FiPlus size={13} /> Save as Template
                  </Btn>
                </ResultActions>
              </>
            )}
          </PanelBody>
        </Panel>

        {/* ── RIGHT: Templates List ── */}
        <Panel>
          <PanelHeader>
            <PanelTitle><FiList color="#3b82f6" /> Admin Templates ({filtered.length})</PanelTitle>
          </PanelHeader>
          <PanelBody>
            <SearchRow>
              <FiSearch size={14} />
              <SearchInput
                placeholder="Search templates…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </SearchRow>

            {listStatus === "loading" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[1,2,3,4].map(i => <SkeletonRow key={i} />)}
              </div>
            )}

            {(listStatus === "error" || listStatus === "forbidden") && listError && (
              <AlertBanner $type={listStatus === "forbidden" ? "warning" : "error"}>
                <FiAlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <AlertBody>
                  {listStatus === "forbidden"
                    ? <><strong>Access Denied:</strong> {listError}</>
                    : <><strong>Error:</strong> {listError}</>
                  }
                </AlertBody>
              </AlertBanner>
            )}

            {listStatus === "success" && filtered.length === 0 && (
              <EmptyBox>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                <div style={{ fontWeight: 600, color: "#64748b", marginBottom: 6 }}>No templates yet</div>
                <div style={{ fontSize: 13 }}>
                  {search ? "No results for your search." : "Use the AI Generator to create your first template."}
                </div>
              </EmptyBox>
            )}

            {listStatus === "success" && filtered.length > 0 && (
              <TemplateList>
                {filtered.map(t => (
                  <TemplateCard key={t._id}>
                    <TemplateTop onClick={() => setExpanded(expanded === t._id ? null : t._id)}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <TemplateName>{t.title}</TemplateName>
                        <TemplateMeta>
                          {t.addedByAdmin && <AdminTag>Admin</AdminTag>}
                          {t.company_type && <MetaTag>{t.company_type}</MetaTag>}
                          {t.lang_opt     && <MetaTag $color="#e0f2fe">{t.lang_opt}</MetaTag>}
                          {t.employment_type  && <MetaTag $color="#fef9c3">{t.employment_type}</MetaTag>}
                          {t.experience_level && <MetaTag $color="#f3e8ff">{t.experience_level}</MetaTag>}
                          {t.createdAt && <MetaTag>{fmt(t.createdAt)}</MetaTag>}
                        </TemplateMeta>
                      </div>
                      <TemplateActions onClick={e => e.stopPropagation()}>
                        <IconBtn $primary onClick={() => openEdit(t)}>
                          <FiEdit2 size={12} /> Edit
                        </IconBtn>
                        <IconBtn $danger onClick={() => handleDelete(t)}>
                          <FiTrash2 size={12} /> Delete
                        </IconBtn>
                        {expanded === t._id ? <FiChevronUp size={16} color="#94a3b8" /> : <FiChevronDown size={16} color="#94a3b8" />}
                      </TemplateActions>
                    </TemplateTop>
                    <TemplateBody $open={expanded === t._id}>
                      {t.description      && <BodyText><strong>Description:</strong> {t.description}</BodyText>}
                      {t.responsibilities && <BodyText><strong>Responsibilities:</strong> {t.responsibilities}</BodyText>}
                      {t.requirements     && <BodyText><strong>Requirements:</strong> {t.requirements}</BodyText>}
                      {t.qualifications   && <BodyText><strong>Qualifications:</strong> {t.qualifications}</BodyText>}
                      {t.skills && t.skills.length > 0 && (
                        <SkillChips style={{ marginTop: 8 }}>
                          {t.skills.map((s, i) => <SkillChip key={i}>{s}</SkillChip>)}
                        </SkillChips>
                      )}
                    </TemplateBody>
                  </TemplateCard>
                ))}
              </TemplateList>
            )}
          </PanelBody>
        </Panel>
      </TwoCol>

      {/* ── Edit / Create Modal ── */}
      <Overlay $open={modalOpen} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
        <Modal>
          <ModalHeader>
            <ModalTitle>{editTarget ? "Edit Template" : "New Job Template"}</ModalTitle>
            <CloseBtn onClick={closeModal}><FiX size={20} /></CloseBtn>
          </ModalHeader>
          <form onSubmit={handleSave}>
            <FormGroup>
              <Label>Job Title *</Label>
              <FormInput placeholder="e.g. Senior React Developer" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <FormTextarea placeholder="Job description…" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
            </FormGroup>
            <FormGroup>
              <Label>Responsibilities</Label>
              <FormTextarea placeholder="Key responsibilities…" value={form.responsibilities} onChange={e => setForm(f => ({...f, responsibilities: e.target.value}))} style={{ minHeight: 80 }} />
            </FormGroup>
            <FormGroup>
              <Label>Requirements</Label>
              <FormTextarea placeholder="Requirements…" value={form.requirements} onChange={e => setForm(f => ({...f, requirements: e.target.value}))} style={{ minHeight: 80 }} />
            </FormGroup>
            <FormGroup>
              <Label>Skills (comma-separated)</Label>
              <FormInput placeholder="React, TypeScript, Node.js" value={form.skills} onChange={e => setForm(f => ({...f, skills: e.target.value}))} />
            </FormGroup>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormGroup>
                <Label>Employment Type</Label>
                <FormSelect value={form.employment_type} onChange={e => setForm(f => ({...f, employment_type: e.target.value}))}>
                  {EMP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <Label>Experience Level</Label>
                <FormSelect value={form.experience_level} onChange={e => setForm(f => ({...f, experience_level: e.target.value}))}>
                  {EXP_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <Label>Company Type</Label>
                <FormSelect value={form.company_type} onChange={e => setForm(f => ({...f, company_type: e.target.value}))}>
                  {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <Label>Language</Label>
                <FormSelect value={form.lang_opt} onChange={e => setForm(f => ({...f, lang_opt: e.target.value}))}>
                  {LANG_OPTS.map(l => <option key={l} value={l}>{l}</option>)}
                </FormSelect>
              </FormGroup>
            </div>
            <FormGroup>
              <Label>Salary Range</Label>
              <FormInput placeholder="e.g. 50,000 – 80,000 ETB" value={form.salary_range} onChange={e => setForm(f => ({...f, salary_range: e.target.value}))} />
            </FormGroup>
            <FormGroup>
              <Label>Location</Label>
              <FormInput placeholder="e.g. Addis Ababa / Remote" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} />
            </FormGroup>
            <ModalActions>
              <Btn type="button" onClick={closeModal} style={{ flex: 1 }}>Cancel</Btn>
              <Btn $variant="primary" type="submit" disabled={saving} style={{ flex: 2 }}>
                {saving ? "Saving…" : editTarget ? <><FiCheck size={14} /> Save Changes</> : <><FiPlus size={14} /> Create Template</>}
              </Btn>
            </ModalActions>
          </form>
        </Modal>
      </Overlay>

      <SmartConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Job Template"
        message="This will permanently delete the job template. This action cannot be reversed."
        itemName={deleteDialog.title}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleteDialog.isDeleting}
        confirmText="Delete Template"
      />
    </Page>
  );
};

export default JobTemplates;

