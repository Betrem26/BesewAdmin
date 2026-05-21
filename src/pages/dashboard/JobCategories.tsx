import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  FiPlus, FiTrash2, FiEdit2, FiRefreshCw, FiSearch,
  FiTag, FiImage, FiX, FiCheck, FiAlertTriangle,
} from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
} from "../../store/features/jobCategoriesSlice";
import { resolveIconUrl, JobCategory } from "../../services/jobCategoryApi";
import { toast } from "react-toastify";

// ── Animations ─────────────────────────────────────────────────────────────
const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}`;
const shimmer = keyframes`0%{background-position:-400px 0}100%{background-position:400px 0}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

// ── Layout ─────────────────────────────────────────────────────────────────
const Page = styled.div`max-width:1400px;animation:${fadeIn} 0.3s ease;`;

const PageHeader = styled.div`
  display:flex;justify-content:space-between;align-items:flex-start;
  margin-bottom:28px;flex-wrap:wrap;gap:16px;
`;
const TitleBlock = styled.div``;
const PageTitle = styled.h1`
  font-size:26px;font-weight:700;color:#1e293b;
  display:flex;align-items:center;gap:10px;margin:0 0 4px;
`;
const PageSub = styled.p`font-size:13px;color:#64748b;margin:0;`;

const HeaderActions = styled.div`display:flex;gap:10px;flex-wrap:wrap;`;

// ── Toolbar ────────────────────────────────────────────────────────────────
const Toolbar = styled.div`
  background:white;border-radius:12px;padding:16px 20px;
  margin-bottom:24px;box-shadow:0 1px 4px rgba(0,0,0,0.06);
  display:flex;gap:12px;flex-wrap:wrap;align-items:center;
`;
const SearchWrap = styled.div`
  position:relative;flex:1;min-width:200px;
  svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;}
`;
const SearchInput = styled.input`
  width:100%;padding:9px 12px 9px 36px;border:1px solid #e2e8f0;
  border-radius:8px;font-size:14px;outline:none;
  &:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.1);}
`;
const FilterSelect = styled.select`
  padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;
  font-size:14px;background:white;cursor:pointer;outline:none;
  &:focus{border-color:#3b82f6;}
`;
const CountBadge = styled.span`
  background:#f1f5f9;color:#475569;border-radius:20px;
  padding:4px 12px;font-size:13px;font-weight:600;white-space:nowrap;
`;

// ── Buttons ────────────────────────────────────────────────────────────────
const Btn = styled.button<{ $variant?: "primary"|"danger"|"ghost" }>`
  display:inline-flex;align-items:center;gap:6px;
  padding:9px 18px;border:none;border-radius:8px;
  font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;
  ${p => p.$variant === "primary" && css`background:#3b82f6;color:white;&:hover{background:#2563eb;}`}
  ${p => p.$variant === "danger"  && css`background:#fee2e2;color:#dc2626;&:hover{background:#fecaca;}`}
  ${p => (!p.$variant || p.$variant === "ghost") && css`background:#f1f5f9;color:#475569;&:hover{background:#e2e8f0;}`}
  &:disabled{opacity:0.5;cursor:not-allowed;}
  svg{flex-shrink:0;}
`;
const SpinIcon = styled(FiRefreshCw)<{ $spin?: boolean }>`
  ${p => p.$spin && css`animation:${spin} 1s linear infinite;`}
`;

// ── Stats row ──────────────────────────────────────────────────────────────
const StatsRow = styled.div`display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;`;
const StatChip = styled.div<{ $color: string }>`
  background:white;border-radius:10px;padding:14px 20px;
  box-shadow:0 1px 4px rgba(0,0,0,0.06);flex:1;min-width:120px;
  border-left:4px solid ${p => p.$color};
`;
const ChipNum = styled.div`font-size:24px;font-weight:800;color:#1e293b;`;
const ChipLbl = styled.div`font-size:12px;color:#64748b;font-weight:500;margin-top:2px;`;

// ── Grid ───────────────────────────────────────────────────────────────────
const Grid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px;
`;

const Card = styled.div`
  background:white;border-radius:14px;overflow:hidden;
  box-shadow:0 1px 4px rgba(0,0,0,0.06);
  transition:box-shadow 0.2s,transform 0.2s;animation:${fadeIn} 0.3s ease;
  &:hover{box-shadow:0 6px 20px rgba(0,0,0,0.1);transform:translateY(-2px);}
`;
const CardTop = styled.div`
  background:linear-gradient(135deg,#f8fafc,#f1f5f9);
  padding:24px;display:flex;align-items:center;justify-content:center;
  min-height:100px;position:relative;
`;
const CategoryIcon = styled.img`
  width:64px;height:64px;object-fit:contain;border-radius:10px;
`;
const IconPlaceholder = styled.div`
  width:64px;height:64px;background:#e2e8f0;border-radius:10px;
  display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:28px;
`;
const AdminBadge = styled.span`
  position:absolute;top:10px;right:10px;
  background:#dbeafe;color:#1d4ed8;border-radius:20px;
  padding:3px 10px;font-size:11px;font-weight:700;
`;
const CardBody = styled.div`padding:16px;`;
const CardName = styled.h3`font-size:15px;font-weight:700;color:#1e293b;margin:0 0 8px;`;
const TagRow = styled.div`display:flex;gap:6px;flex-wrap:wrap;`;
const Tag = styled.span<{ $color?: string }>`
  background:${p => p.$color || "#f1f5f9"};color:#475569;
  border-radius:6px;padding:3px 8px;font-size:11px;font-weight:600;
`;
const CardActions = styled.div`
  display:flex;gap:8px;padding:12px 16px;border-top:1px solid #f1f5f9;
`;
const IconBtn = styled.button<{ $danger?: boolean }>`
  flex:1;display:flex;align-items:center;justify-content:center;gap:5px;
  padding:7px;border:none;border-radius:7px;font-size:12px;font-weight:600;
  cursor:pointer;transition:background 0.15s;
  background:${p => p.$danger ? "#fee2e2" : "#f1f5f9"};
  color:${p => p.$danger ? "#dc2626" : "#475569"};
  &:hover{background:${p => p.$danger ? "#fecaca" : "#e2e8f0"};}
`;

// ── Skeleton ───────────────────────────────────────────────────────────────
const SkeletonCard = styled.div`
  border-radius:14px;height:220px;
  background:linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%);
  background-size:400px 100%;animation:${shimmer} 1.4s ease infinite;
`;

// ── Empty / Error ──────────────────────────────────────────────────────────
const EmptyBox = styled.div`
  text-align:center;padding:60px 20px;color:#94a3b8;
  background:white;border-radius:14px;box-shadow:0 1px 4px rgba(0,0,0,0.06);
`;
const EmptyIcon = styled.div`font-size:48px;margin-bottom:12px;`;
const EmptyTitle = styled.div`font-size:16px;font-weight:600;color:#64748b;margin-bottom:6px;`;
const EmptyBody = styled.div`font-size:13px;`;

const ErrorBanner = styled.div`
  background:#fef2f2;border-left:4px solid #ef4444;border-radius:10px;
  padding:14px 18px;margin-bottom:20px;color:#991b1b;font-size:14px;
  display:flex;align-items:center;gap:10px;
`;

// ── Modal / Drawer ─────────────────────────────────────────────────────────
const Overlay = styled.div<{ $open: boolean }>`
  display:${p => p.$open ? "flex" : "none"};
  position:fixed;inset:0;background:rgba(0,0,0,0.45);
  z-index:1000;align-items:center;justify-content:center;padding:20px;
`;
const Modal = styled.div`
  background:white;border-radius:16px;padding:32px;
  width:100%;max-width:480px;max-height:90vh;overflow-y:auto;
  box-shadow:0 20px 60px rgba(0,0,0,0.2);animation:${fadeIn} 0.2s ease;
`;
const ModalHeader = styled.div`
  display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;
`;
const ModalTitle = styled.h2`font-size:20px;font-weight:700;color:#1e293b;margin:0;`;
const CloseBtn = styled.button`
  background:none;border:none;cursor:pointer;color:#94a3b8;padding:4px;
  border-radius:6px;&:hover{background:#f1f5f9;color:#475569;}
`;
const FormGroup = styled.div`margin-bottom:18px;`;
const Label = styled.label`
  display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;
`;
const FormInput = styled.input`
  width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;
  font-size:14px;outline:none;box-sizing:border-box;
  &:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.1);}
`;
const FormSelect = styled.select`
  width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;
  font-size:14px;background:white;outline:none;cursor:pointer;
  &:focus{border-color:#3b82f6;}
`;
const FileLabel = styled.label`
  display:flex;align-items:center;gap:8px;padding:10px 14px;
  border:2px dashed #e2e8f0;border-radius:8px;cursor:pointer;
  font-size:13px;color:#64748b;transition:border-color 0.15s;
  &:hover{border-color:#3b82f6;color:#3b82f6;}
`;
const ModalActions = styled.div`display:flex;gap:10px;margin-top:24px;`;

// ── Confirmation Dialog ────────────────────────────────────────────────────
const ConfirmOverlay = styled.div<{ $open: boolean }>`
  display:${p => p.$open ? "flex" : "none"};
  position:fixed;inset:0;background:rgba(0,0,0,0.5);
  z-index:1100;align-items:center;justify-content:center;padding:20px;
  animation:${p => p.$open ? css`${fadeIn} 0.2s ease` : "none"};
`;

const ConfirmModal = styled.div`
  background:white;border-radius:16px;padding:32px;
  width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,0.3);
  animation:${fadeIn} 0.3s ease;
`;

const ConfirmHeader = styled.div`
  display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;
`;

const ConfirmIconBox = styled.div`
  width:48px;height:48px;border-radius:12px;
  background:#fee2e2;display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
`;

const ConfirmContent = styled.div`flex:1;`;

const ConfirmTitle = styled.h3`
  font-size:18px;font-weight:700;color:#1e293b;margin:0 0 8px;
`;

const ConfirmMessage = styled.p`
  font-size:14px;color:#64748b;margin:0 0 12px;line-height:1.5;
`;

const ConfirmItemName = styled.div`
  background:#f1f5f9;border-left:3px solid #ef4444;
  padding:10px 12px;border-radius:6px;font-size:13px;
  font-weight:600;color:#1e293b;margin-bottom:16px;
  word-break:break-word;
`;

const ConfirmWarning = styled.div`
  background:#fef9c3;border-left:3px solid #f59e0b;
  padding:10px 12px;border-radius:6px;font-size:12px;
  color:#92400e;margin-bottom:20px;display:flex;gap:8px;align-items:flex-start;
`;

const ConfirmActions = styled.div`
  display:flex;gap:10px;
  button{flex:1;}
`;

const ConfirmBtn = styled.button<{ $variant: "danger" | "secondary" }>`
  padding:10px 16px;border:none;border-radius:8px;
  font-size:14px;font-weight:600;cursor:pointer;transition:all 0.15s;
  ${p => p.$variant === "danger" && css`
    background:#ef4444;color:white;
    &:hover{background:#dc2626;}
    &:disabled{opacity:0.5;cursor:not-allowed;}
  `}
  ${p => p.$variant === "secondary" && css`
    background:#f1f5f9;color:#475569;
    &:hover{background:#e2e8f0;}
    &:disabled{opacity:0.5;cursor:not-allowed;}
  `}
  display:flex;align-items:center;justify-content:center;gap:6px;
`;

// ── Helpers ────────────────────────────────────────────────────────────────
const COMPANY_TYPES = [
  { value: "company",      label: "Company" },
  { value: "local_agency", label: "Local Agency" },
  { value: "Int_agency",   label: "Int. Agency" },
  { value: "bpo",          label: "BPO" },
  { value: "broker",       label: "Broker" },
];
const LANG_OPTS = ["English", "Amharic", "Oromiffa"];

const TYPE_COLORS: Record<string, string> = {
  company:      "#dbeafe",
  local_agency: "#dcfce7",
  Int_agency:   "#fef9c3",
  bpo:          "#fce7f3",
  broker:       "#ede9fe",
};

const LANG_COLORS: Record<string, string> = {
  English:  "#e0f2fe",
  Amharic:  "#fef3c7",
  Oromiffa: "#d1fae5",
};

// ── Component ──────────────────────────────────────────────────────────────

interface FormState {
  categoryName: string;
  companyType: string;
  langOpt: string;
  icon: File | null;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

const EMPTY_FORM: FormState = {
  categoryName: "",
  companyType: "local_agency",
  langOpt: "English",
  icon: null,
};

const EMPTY_CONFIRM: ConfirmDialogState = {
  isOpen: false,
  title: "",
  message: "",
  itemName: "",
  onConfirm: () => {},
  isDeleting: false,
};

const JobCategories: React.FC = () => {
  const dispatch = useAppDispatch();
  const { adminCategories, loading, error } = useAppSelector(s => s.jobCategories);

  const [search, setSearch]           = useState("");
  const [langFilter, setLangFilter]   = useState("all");
  const [typeFilter, setTypeFilter]   = useState("all");
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState<JobCategory | null>(null);
  const [form, setForm]               = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(EMPTY_CONFIRM);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load on mount and when filters change
  useEffect(() => {
    dispatch(fetchAdminCategories({
      langOpt:     langFilter !== "all" ? langFilter : undefined,
      companyType: typeFilter !== "all" ? typeFilter : undefined,
    }));
  }, [dispatch, langFilter, typeFilter]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const filtered = adminCategories.filter(c =>
    c.categoryName?.toLowerCase().includes(search.toLowerCase())
  );
  const adminCount = adminCategories.filter(c => c.addedByAdmin).length;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setIconPreview(null);
    setModalOpen(true);
  };

  const openEdit = (cat: JobCategory) => {
    setEditTarget(cat);
    setForm({
      categoryName: cat.categoryName,
      companyType:  cat.company_type,
      langOpt:      cat.lang_opt,
      icon:         null,
    });
    setIconPreview(resolveIconUrl(cat.icon) || null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditTarget(null); setIconPreview(null); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(f => ({ ...f, icon: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setIconPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryName.trim()) { toast.error("Category name is required"); return; }
    setSubmitting(true);
    try {
      if (editTarget) {
        await dispatch(updateCategory({
          id: editTarget._id,
          data: { categoryName: form.categoryName, companyType: form.companyType, langOpt: form.langOpt, icon: form.icon || undefined },
        })).unwrap();
        toast.success("Category updated");
      } else {
        await dispatch(createCategory({
          categoryName: form.categoryName,
          companyType:  form.companyType,
          langOpt:      form.langOpt,
          icon:         form.icon || undefined,
        })).unwrap();
        toast.success("Category created");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: JobCategory) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Category",
      message: "Are you sure you want to delete this job category? This action cannot be undone.",
      itemName: cat.categoryName,
      isDeleting: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isDeleting: true }));
        try {
          await dispatch(deleteCategory(cat._id)).unwrap();
          toast.success("Category deleted successfully");
          setConfirmDialog(EMPTY_CONFIRM);
        } catch (err: any) {
          toast.error(err?.message || "Failed to delete category");
          setConfirmDialog(EMPTY_CONFIRM);
        }
      },
    });
  };

  const closeConfirmDialog = () => {
    if (!confirmDialog.isDeleting) {
      setConfirmDialog(EMPTY_CONFIRM);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAdminCategories({
      langOpt:     langFilter !== "all" ? langFilter : undefined,
      companyType: typeFilter !== "all" ? typeFilter : undefined,
    }));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Page>
      {/* Header */}
      <PageHeader>
        <TitleBlock>
          <PageTitle><FiTag color="#3b82f6" /> Job Categories</PageTitle>
          <PageSub>Manage job categories displayed to employers and agencies</PageSub>
        </TitleBlock>
        <HeaderActions>
          <Btn onClick={handleRefresh} disabled={loading}>
            <SpinIcon size={14} $spin={loading} /> Refresh
          </Btn>
          <Btn $variant="primary" onClick={openCreate}>
            <FiPlus size={14} /> Add Category
          </Btn>
        </HeaderActions>
      </PageHeader>

      {/* Error */}
      {error && (
        <ErrorBanner>
          <FiAlertTriangle size={16} /> {error}
        </ErrorBanner>
      )}

      {/* Stats */}
      <StatsRow>
        <StatChip $color="#3b82f6">
          <ChipNum>{adminCategories.length}</ChipNum>
          <ChipLbl>Total Categories</ChipLbl>
        </StatChip>
        <StatChip $color="#10b981">
          <ChipNum>{adminCount}</ChipNum>
          <ChipLbl>Added by Admin</ChipLbl>
        </StatChip>
        <StatChip $color="#f59e0b">
          <ChipNum>{adminCategories.filter(c => c.lang_opt === "English").length}</ChipNum>
          <ChipLbl>English</ChipLbl>
        </StatChip>
        <StatChip $color="#8b5cf6">
          <ChipNum>{adminCategories.filter(c => c.lang_opt === "Amharic").length}</ChipNum>
          <ChipLbl>Amharic</ChipLbl>
        </StatChip>
        <StatChip $color="#ec4899">
          <ChipNum>{adminCategories.filter(c => c.lang_opt === "Oromiffa").length}</ChipNum>
          <ChipLbl>Oromiffa</ChipLbl>
        </StatChip>
      </StatsRow>

      {/* Toolbar */}
      <Toolbar>
        <SearchWrap>
          <FiSearch size={14} />
          <SearchInput
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchWrap>
        <FilterSelect value={langFilter} onChange={e => setLangFilter(e.target.value)}>
          <option value="all">All Languages</option>
          {LANG_OPTS.map(l => <option key={l} value={l}>{l}</option>)}
        </FilterSelect>
        <FilterSelect value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Company Types</option>
          {COMPANY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </FilterSelect>
        <CountBadge>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</CountBadge>
      </Toolbar>

      {/* Grid */}
      {loading ? (
        <Grid>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </Grid>
      ) : filtered.length === 0 ? (
        <EmptyBox>
          <EmptyIcon>📂</EmptyIcon>
          <EmptyTitle>No categories found</EmptyTitle>
          <EmptyBody>
            {search || langFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters."
              : "Click \"Add Category\" to create the first one."}
          </EmptyBody>
        </EmptyBox>
      ) : (
        <Grid>
          {filtered.map(cat => {
            const iconUrl = resolveIconUrl(cat.icon);
            return (
              <Card key={cat._id}>
                <CardTop>
                  {iconUrl
                    ? <CategoryIcon src={iconUrl} alt={cat.categoryName} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : <IconPlaceholder><FiTag /></IconPlaceholder>
                  }
                  {cat.addedByAdmin && <AdminBadge>Admin</AdminBadge>}
                </CardTop>
                <CardBody>
                  <CardName>{cat.categoryName}</CardName>
                  <TagRow>
                    <Tag $color={TYPE_COLORS[cat.company_type] || "#f1f5f9"}>
                      {COMPANY_TYPES.find(t => t.value === cat.company_type)?.label || cat.company_type}
                    </Tag>
                    <Tag $color={LANG_COLORS[cat.lang_opt] || "#f1f5f9"}>
                      {cat.lang_opt}
                    </Tag>
                  </TagRow>
                </CardBody>
                <CardActions>
                  <IconBtn onClick={() => openEdit(cat)}>
                    <FiEdit2 size={13} /> Edit
                  </IconBtn>
                  <IconBtn $danger onClick={() => handleDelete(cat)}>
                    <FiTrash2 size={13} /> Delete
                  </IconBtn>
                </CardActions>
              </Card>
            );
          })}
        </Grid>
      )}

      {/* Create / Edit Modal */}
      <Overlay $open={modalOpen} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
        <Modal>
          <ModalHeader>
            <ModalTitle>{editTarget ? "Edit Category" : "Add New Category"}</ModalTitle>
            <CloseBtn onClick={closeModal}><FiX size={20} /></CloseBtn>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Category Name *</Label>
              <FormInput
                placeholder="e.g. Software Development"
                value={form.categoryName}
                onChange={e => setForm(f => ({ ...f, categoryName: e.target.value }))}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Language</Label>
              <FormSelect value={form.langOpt} onChange={e => setForm(f => ({ ...f, langOpt: e.target.value }))}>
                {LANG_OPTS.map(l => <option key={l} value={l}>{l}</option>)}
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <Label>Company Type</Label>
              <FormSelect value={form.companyType} onChange={e => setForm(f => ({ ...f, companyType: e.target.value }))}>
                {COMPANY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <Label>Icon (optional)</Label>
              <FileLabel htmlFor="cat-icon">
                <FiImage size={16} />
                {form.icon ? form.icon.name : "Choose image (PNG, JPG, SVG)"}
              </FileLabel>
              <input
                id="cat-icon"
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {iconPreview && (
                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={iconPreview} alt="preview" style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <span style={{ fontSize: 12, color: "#64748b" }}>Preview</span>
                </div>
              )}
            </FormGroup>

            <ModalActions>
              <Btn type="button" onClick={closeModal} style={{ flex: 1 }}>Cancel</Btn>
              <Btn $variant="primary" type="submit" disabled={submitting} style={{ flex: 2 }}>
                {submitting ? "Saving..." : editTarget ? <><FiCheck size={14} /> Save Changes</> : <><FiPlus size={14} /> Create Category</>}
              </Btn>
            </ModalActions>
          </form>
        </Modal>
      </Overlay>

      {/* Confirmation Dialog */}
      <ConfirmOverlay $open={confirmDialog.isOpen} onClick={e => { if (e.target === e.currentTarget) closeConfirmDialog(); }}>
        <ConfirmModal>
          <ConfirmHeader>
            <ConfirmIconBox>
              <FiAlertTriangle size={24} color="#dc2626" />
            </ConfirmIconBox>
            <ConfirmContent>
              <ConfirmTitle>{confirmDialog.title}</ConfirmTitle>
              <ConfirmMessage>{confirmDialog.message}</ConfirmMessage>
            </ConfirmContent>
          </ConfirmHeader>

          {confirmDialog.itemName && (
            <ConfirmItemName>
              📁 {confirmDialog.itemName}
            </ConfirmItemName>
          )}

          <ConfirmWarning>
            <span style={{ marginTop: 2 }}>⚠️</span>
            <span>This action is permanent and cannot be reversed.</span>
          </ConfirmWarning>

          <ConfirmActions>
            <ConfirmBtn
              $variant="secondary"
              onClick={closeConfirmDialog}
              disabled={confirmDialog.isDeleting}
            >
              <FiX size={14} /> Cancel
            </ConfirmBtn>
            <ConfirmBtn
              $variant="danger"
              onClick={confirmDialog.onConfirm}
              disabled={confirmDialog.isDeleting}
            >
              {confirmDialog.isDeleting ? (
                <>
                  <SpinIcon size={14} $spin /> Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 size={14} /> Delete
                </>
              )}
            </ConfirmBtn>
          </ConfirmActions>
        </ConfirmModal>
      </ConfirmOverlay>
    </Page>
  );
};

export default JobCategories;
