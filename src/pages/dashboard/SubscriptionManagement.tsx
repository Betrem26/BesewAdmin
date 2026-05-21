import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiRefreshCw, FiX, FiStar, FiThumbsUp } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { subscriptionApi } from '../../services/subscriptionApi';
import { handleApiError } from '../../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubscriptionOption {
  _id: string;
  type: string;
  period: string;
  durationInDays: number;
  price: number;
  features: string[];
  description?: string;
  isActive?: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
  sortOrder?: number;
  maxFeatures?: number;
  validFrom?: string;
  validTo?: string;
  metadata?: Record<string, any>;
  aiCoachCredits?: number;
  createdAt?: string;
  updatedAt?: string;
  updated_at?: string;
  __v?: number;
}

const EMPTY_FORM = {
  type: '',
  period: '',
  durationInDays: 30,
  price: 0,
  description: '',
  features: [] as string[],
  isActive: false,
  isPopular: false,
  isRecommended: false,
  sortOrder: 0,
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`max-width: 1600px; margin: 0 auto;`;

const PageHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
`;

const PageTitle = styled.h1`
  font-size: 28px; font-weight: 700; color: #1a202c; margin: 0;
`;

const Btn = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 18px; border-radius: 8px; border: none;
  font-size: 14px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$variant === 'primary' ? '#3b82f6' : '#f1f5f9'};
  color: ${p => p.$variant === 'primary' ? '#fff' : '#374151'};
  &:hover { opacity: 0.88; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const TableCard = styled.div`
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;
`;

const Table = styled.table`width: 100%; border-collapse: collapse;`;

const Th = styled.th`
  background: #f8fafc; padding: 14px 16px; text-align: left;
  font-size: 12px; font-weight: 700; color: #6b7280;
  text-transform: uppercase; letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb; white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  &:hover { background: #f8fafc; }
  &:last-child { border-bottom: none; }
`;

const Td = styled.td`padding: 14px 16px; font-size: 14px; color: #374151; vertical-align: top;`;

const Badge = styled.span<{ $color: string }>`
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
  background: ${p => p.$color + '22'}; color: ${p => p.$color};
`;

const FeatureTag = styled.span`
  display: inline-block; background: #eff6ff; color: #3b82f6;
  border-radius: 4px; padding: 2px 8px; font-size: 11px; margin: 2px;
`;

const Toggle = styled.label`
  position: relative; display: inline-block; width: 42px; height: 22px;
  input { opacity: 0; width: 0; height: 0; }
  span {
    position: absolute; cursor: pointer; inset: 0;
    background: #d1d5db; border-radius: 22px; transition: 0.3s;
    &::before {
      content: ''; position: absolute; height: 16px; width: 16px;
      left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s;
    }
  }
  input:checked + span { background: #10b981; }
  input:checked + span::before { transform: translateX(20px); }
`;

// ─── Modal ────────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const Modal = styled.div`
  background: #fff; border-radius: 14px; width: 560px; max-width: 95vw;
  max-height: 90vh; overflow-y: auto; padding: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
`;

const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
  h2 { font-size: 20px; font-weight: 700; color: #1a202c; margin: 0; }
`;

const FormGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px;`;

const FormGroup = styled.div<{ $full?: boolean }>`
  display: flex; flex-direction: column; gap: 6px;
  ${p => p.$full && 'grid-column: 1 / -1;'}
`;

const Label = styled.label`font-size: 13px; font-weight: 600; color: #374151;`;

const Input = styled.input`
  padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; transition: border-color 0.2s;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px #3b82f620; }
`;

const Select = styled.select`
  padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; background: #fff; cursor: pointer;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px #3b82f620; }
`;

const Textarea = styled.textarea`
  padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px;
  font-size: 14px; resize: vertical; min-height: 72px;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px #3b82f620; }
`;

const CheckRow = styled.label`
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  font-size: 14px; color: #374151;
  input { width: 16px; height: 16px; cursor: pointer; }
`;

const FeatureRow = styled.div`display: flex; gap: 8px; margin-bottom: 8px;`;

const FeatureList = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;
`;

const RemovableTag = styled.span`
  display: inline-flex; align-items: center; gap: 4px;
  background: #eff6ff; color: #3b82f6; border-radius: 4px;
  padding: 3px 8px; font-size: 12px;
  button { background: none; border: none; cursor: pointer; color: #6b7280; padding: 0; line-height: 1; }
`;

const ModalFooter = styled.div`
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
`;

const Spinner = styled.div`
  text-align: center; padding: 48px; color: #6b7280; font-size: 15px;
`;

// Confirm dialog
const ConfirmBox = styled.div`
  background: #fff; border-radius: 12px; padding: 28px; width: 380px; max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25); text-align: center;
  h3 { font-size: 18px; font-weight: 700; color: #1a202c; margin: 0 0 10px; }
  p  { font-size: 14px; color: #6b7280; margin: 0 0 24px; line-height: 1.5; }
`;
const ConfirmActions = styled.div`display: flex; justify-content: center; gap: 12px;`;

// Feature cell — fixed width, scrollable when many items
const FeatureCell = styled.div`
  max-width: 260px; max-height: 110px; overflow-y: auto;
  display: flex; flex-wrap: wrap; gap: 4px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const SubscriptionManagement: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionOption[]>([]);
  const [popularIds, setPopularIds] = useState<Set<string>>(new Set());
  const [recommendedIds, setRecommendedIds] = useState<Set<string>>(new Set());
  const [types, setTypes] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SubscriptionOption | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [confirmDeactivate, setConfirmDeactivate] = useState<SubscriptionOption | null>(null);

  const loadPlanById = async (id: string) => {
    const res = await subscriptionApi.getById(id);
    return res.data as SubscriptionOption;
  };

  const hydrateIsActiveFromDetails = async (
    incoming: SubscriptionOption[],
  ): Promise<SubscriptionOption[]> => {
    const idsMissingState = incoming
      .filter(p => p.isActive === undefined)
      .map(p => p._id);

    if (idsMissingState.length === 0) {
      return incoming;
    }

    const details = await Promise.allSettled(
      idsMissingState.map(id => loadPlanById(id))
    );

    const detailMap = new Map<string, SubscriptionOption>();
    details.forEach(item => {
      if (item.status === 'fulfilled') {
        detailMap.set(item.value._id, item.value);
      }
    });

    return incoming.map(p => ({
      ...p,
      isActive: p.isActive ?? detailMap.get(p._id)?.isActive ?? false,
    }));
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [plansRes, popularRes, recommendedRes, typesRes, periodsRes] = await Promise.allSettled([
        subscriptionApi.getAll(),
        subscriptionApi.getPopular(),
        subscriptionApi.getRecommended(),
        subscriptionApi.getTypes(),
        subscriptionApi.getPeriods(),
      ]);

      // Build popular and recommended ID sets first
      const newPopularIds = new Set<string>();
      const newRecommendedIds = new Set<string>();

      if (popularRes.status === 'fulfilled') {
        (popularRes.value.data as SubscriptionOption[]).forEach(p => newPopularIds.add(p._id));
      }
      if (recommendedRes.status === 'fulfilled') {
        (recommendedRes.value.data as SubscriptionOption[]).forEach(p => newRecommendedIds.add(p._id));
      }

      setPopularIds(newPopularIds);
      setRecommendedIds(newRecommendedIds);

      if (plansRes.status === 'fulfilled') {
        const incoming: SubscriptionOption[] = plansRes.value.data;
        // Hydrate isActive from individual plan details (GET /subscription-options doesn't return it)
        const hydrated = await hydrateIsActiveFromDetails(incoming);
        setPlans(prev => {
          const existingMap = new Map(prev.map(p => [p._id, p]));
          return hydrated.map(p => ({
            ...p,
            isActive:      p.isActive ?? existingMap.get(p._id)?.isActive ?? false,
            isPopular:     newPopularIds.has(p._id),
            isRecommended: newRecommendedIds.has(p._id),
          }));
        });
      }

      if (typesRes.status === 'fulfilled') {
        const raw = typesRes.value.data;
        const list: string[] = Array.isArray(raw?.types)
          ? raw.types.map((t: any) => t.type ?? t)
          : Array.isArray(raw) ? raw : [];
        setTypes(list);
      }
      if (periodsRes.status === 'fulfilled') {
        const raw = periodsRes.value.data;
        const list: string[] = Array.isArray(raw)
          ? raw.map((p: any) => (typeof p === 'string' ? p : p.period ?? p.value ?? JSON.stringify(p)))
          : [];
        setPeriods(list);
      }
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setNewFeature('');
    setShowModal(true);
  };

  const openEdit = async (plan: SubscriptionOption) => {
    setLoading(true);
    try {
      const fullPlan = await loadPlanById(plan._id);
      setEditing(fullPlan);
      setForm({
        type: fullPlan.type,
        period: fullPlan.period,
        durationInDays: fullPlan.durationInDays,
        price: fullPlan.price,
        description: fullPlan.description ?? '',
        features: [...(fullPlan.features || [])],
        isActive: fullPlan.isActive ?? true,
        isPopular: fullPlan.isPopular ?? false,
        isRecommended: fullPlan.isRecommended ?? false,
        sortOrder: fullPlan.sortOrder ?? 0,
      });
      setNewFeature('');
      setShowModal(true);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    const f = newFeature.trim();
    if (f && !form.features.includes(f)) {
      setForm(prev => ({ ...prev, features: [...prev.features, f] }));
    }
    setNewFeature('');
  };

  const removeFeature = (idx: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.type || !form.period) { toast.warn('Type and Period are required'); return; }
    setSaving(true);
    try {
      if (editing) {
        // Spread ALL fields from the full editing plan, override with form values.
        // This ensures no backend-required field (aiCoachCredits, jobPostsPerYear, etc.) is dropped.
        const { _id: _eid, createdAt, updatedAt, updated_at, __v, ...editingRest } = editing as any;
        const payload: Record<string, any> = {
          ...editingRest,
          durationInDays: form.durationInDays,
          price:          form.price,
          features:       form.features || [],
          description:    form.description || '',
          isActive:       Boolean(form.isActive),
          isPopular:      Boolean(form.isPopular),
          isRecommended:  Boolean(form.isRecommended),
          sortOrder:      form.sortOrder ?? 0,
        };
        await subscriptionApi.update(editing._id, payload);
        toast.success('Plan updated successfully');
      } else {
        await subscriptionApi.create(form);
        toast.success('Plan created successfully');
      }
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      const errorData = err?.response?.data;
      let detail = handleApiError(err);
      if (errorData?.message) detail = errorData.message;
      else if (errorData?.error) detail = errorData.error;
      toast.error(detail);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (plan: SubscriptionOption) => {
    const active = !!plan.isActive;
    // Show confirm dialog only when deactivating an active plan
    if (active) {
      setConfirmDeactivate(plan);
      return;
    }
    await executeToggle(plan);
  };

  const executeToggle = async (plan: SubscriptionOption) => {
    setConfirmDeactivate(null);
    setTogglingId(plan._id);
    try {
      const res = await subscriptionApi.toggleActive(plan._id);
      // The toggle endpoint returns the updated plan with isActive
      const returned = res.data as SubscriptionOption;
      const newIsActive = returned?.isActive ?? !plan.isActive;

      // Patch local state immediately with the confirmed isActive value
      // (GET /subscription-options may not return isActive, so we preserve it here)
      setPlans(prev =>
        prev.map(p => p._id === plan._id ? { ...p, isActive: newIsActive } : p)
      );
      toast.success(`Plan ${newIsActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setTogglingId(null);
    }
  };

  const handleFlagUpdate = async (
    plan: SubscriptionOption,
    field: 'isPopular' | 'isRecommended',
    value: boolean,
  ) => {
    setTogglingId(plan._id);

    // Optimistic UI update immediately
    if (field === 'isPopular') {
      setPopularIds(prev => {
        const next = new Set(prev);
        value ? next.add(plan._id) : next.delete(plan._id);
        return next;
      });
    } else {
      setRecommendedIds(prev => {
        const next = new Set(prev);
        value ? next.add(plan._id) : next.delete(plan._id);
        return next;
      });
    }
    setPlans(prev => prev.map(p => p._id === plan._id ? { ...p, [field]: value } : p));

    try {
      // Send minimal payload with only the flag being updated
      // This avoids validation issues with the backend
      const payload: Record<string, any> = {
        [field]: value,
      };

      console.log('📤 Flag update payload:', JSON.stringify(payload, null, 2));

      await subscriptionApi.update(plan._id, payload);
      toast.success(`${field === 'isPopular' ? '⭐ Popular' : '👍 Recommended'} ${value ? 'enabled' : 'disabled'}`);

    } catch (err: any) {
      // Revert optimistic update on failure
      if (field === 'isPopular') {
        setPopularIds(prev => {
          const next = new Set(prev);
          value ? next.delete(plan._id) : next.add(plan._id);
          return next;
        });
      } else {
        setRecommendedIds(prev => {
          const next = new Set(prev);
          value ? next.delete(plan._id) : next.add(plan._id);
          return next;
        });
      }
      setPlans(prev => prev.map(p => p._id === plan._id ? { ...p, [field]: !value } : p));

      const errorData = err?.response?.data;
      let detail = 'Failed to update';
      if (errorData?.message) detail = errorData.message;
      else if (errorData?.error) detail = errorData.error;
      else if (Array.isArray(errorData?.errors)) detail = errorData.errors.join(', ');
      else if (errorData) detail = JSON.stringify(errorData);

      console.error('❌ Flag update failed:', { status: err?.response?.status, data: errorData });
      toast.error(`Failed: ${detail}`);
    } finally {
      setTogglingId(null);
    }
  };

  const typeColor: Record<string, string> = {
    free: '#10b981', trial: '#f59e0b', standard: '#3b82f6',
    professional: '#8b5cf6', enterprise: '#ef4444', corporate: '#1e40af', growth: '#06b6d4',
  };

  const filteredPlans = search.trim()
    ? plans.filter(p =>
        p.type.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : plans;

  return (
    <Container>
      <PageHeader>
        <PageTitle>Subscription Management</PageTitle>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <Input
            placeholder="Search by type or description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260, margin: 0 }}
          />
          <Btn onClick={loadData} disabled={loading}><FiRefreshCw /> Refresh</Btn>
          <Btn $variant="primary" onClick={openCreate}><FiPlus /> New Plan</Btn>
        </div>
      </PageHeader>

      <TableCard>
        {loading ? (
          <Spinner>Loading subscription plans…</Spinner>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Plan Type</Th>
                  <Th>Price (ETB)</Th>
                  <Th>Duration (Days)</Th>
                  <Th>Period</Th>
                  <Th>Plan Details</Th>
                  <Th>Flags</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map(plan => (
                  <Tr key={plan._id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Badge $color={typeColor[plan.type] ?? '#6b7280'}>
                          {plan.type.toUpperCase()}
                        </Badge>
                        {popularIds.has(plan._id) && (
                          <Badge $color="#f59e0b"><FiStar size={10} /> Popular</Badge>
                        )}
                        {recommendedIds.has(plan._id) && (
                          <Badge $color="#8b5cf6"><FiThumbsUp size={10} /> Recommended</Badge>
                        )}
                      </div>
                      {plan.description && (
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, maxWidth: 200 }}>
                          {plan.description}
                        </div>
                      )}
                    </Td>
                    <Td>
                      {plan.price === 0
                        ? <Badge $color="#10b981">Free</Badge>
                        : <span style={{ fontWeight: 700, color: '#1a202c' }}>
                            {plan.price.toLocaleString()} ETB
                          </span>
                      }
                    </Td>
                    <Td>{plan.durationInDays}</Td>
                    <Td style={{ textTransform: 'capitalize' }}>{plan.period}</Td>
                    <Td>
                      <FeatureCell>
                        {plan.features.map((f, i) => <FeatureTag key={i}>{f}</FeatureTag>)}
                      </FeatureCell>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <CheckRow>
                          <input
                            type="checkbox"
                            checked={popularIds.has(plan._id)}
                            onChange={e => handleFlagUpdate(plan, 'isPopular', e.target.checked)}
                          />
                          Popular
                        </CheckRow>
                        <CheckRow>
                          <input
                            type="checkbox"
                            checked={recommendedIds.has(plan._id)}
                            onChange={e => handleFlagUpdate(plan, 'isRecommended', e.target.checked)}
                          />
                          Recommended
                        </CheckRow>
                      </div>
                    </Td>
                    <Td>
                      <Toggle>
                        <input
                          type="checkbox"
                          checked={plan.isActive ?? false}
                          disabled={togglingId === plan._id}
                          onChange={() => handleToggle(plan)}
                        />
                        <span />
                      </Toggle>
                      <div style={{ fontSize: 11, color: plan.isActive ? '#10b981' : '#9ca3af', marginTop: 4 }}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </Td>
                    <Td>
                      <Btn onClick={() => openEdit(plan)} style={{ padding: '7px 12px' }}>
                        <FiEdit2 size={14} /> Edit
                      </Btn>
                    </Td>
                  </Tr>
                ))}
                {filteredPlans.length === 0 && (
                  <tr><Td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>
                    {search ? `No plans match "${search}"` : 'No subscription plans found'}
                  </Td></tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </TableCard>

      {/* ── Modal ── */}
      {showModal && (
        <Overlay onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <Modal>
            <ModalHeader>
              <h2>{editing ? 'Edit Plan' : 'New Subscription Plan'}</h2>
              <Btn onClick={() => setShowModal(false)} style={{ padding: '6px 10px' }}><FiX /></Btn>
            </ModalHeader>

            <FormGrid>
              <FormGroup>
                <Label>Type *</Label>
                <Select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="">Select type…</option>
                  {types.length > 0
                    ? types.map(t => <option key={t} value={t}>{t}</option>)
                    : ['free', 'trial', 'standard', 'growth', 'professional', 'enterprise', 'corporate'].map(t =>
                        <option key={t} value={t}>{t}</option>
                      )
                  }
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Period *</Label>
                <Select value={form.period} onChange={e => setForm(p => ({ ...p, period: e.target.value }))}>
                  <option value="">Select period…</option>
                  {periods.length > 0
                    ? periods.map(p => <option key={p} value={p}>{p}</option>)
                    : ['monthly', 'quarterly', 'half_annual', 'annual'].map(p =>
                        <option key={p} value={p}>{p}</option>
                      )
                  }
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Price (ETB)</Label>
                <Input type="number" min={0} value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} />
              </FormGroup>

              <FormGroup>
                <Label>Duration (Days)</Label>
                <Input type="number" min={1} value={form.durationInDays}
                  onChange={e => setForm(p => ({ ...p, durationInDays: Number(e.target.value) }))} />
              </FormGroup>

              <FormGroup>
                <Label>Sort Order</Label>
                <Input type="number" min={0} value={form.sortOrder}
                  onChange={e => setForm(p => ({ ...p, sortOrder: Number(e.target.value) }))} />
              </FormGroup>

              <FormGroup style={{ justifyContent: 'flex-end', paddingBottom: 4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                  <CheckRow>
                    <input type="checkbox" checked={form.isActive}
                      onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
                    Active
                  </CheckRow>
                  <CheckRow>
                    <input type="checkbox" checked={form.isPopular}
                      onChange={e => setForm(p => ({ ...p, isPopular: e.target.checked }))} />
                    Popular
                  </CheckRow>
                  <CheckRow>
                    <input type="checkbox" checked={form.isRecommended}
                      onChange={e => setForm(p => ({ ...p, isRecommended: e.target.checked }))} />
                    Recommended
                  </CheckRow>
                </div>
              </FormGroup>

              <FormGroup $full>
                <Label>Description</Label>
                <Textarea value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </FormGroup>

              <FormGroup $full>
                <Label>Features</Label>
                <FeatureRow>
                  <Input
                    style={{ flex: 1 }}
                    placeholder="Add a feature…"
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Btn $variant="primary" onClick={addFeature} style={{ padding: '9px 14px' }}>
                    <FiPlus />
                  </Btn>
                </FeatureRow>
                <FeatureList>
                  {form.features.map((f, i) => (
                    <RemovableTag key={i}>
                      {f}
                      <button onClick={() => removeFeature(i)}><FiX size={11} /></button>
                    </RemovableTag>
                  ))}
                </FeatureList>
              </FormGroup>
            </FormGrid>

            <ModalFooter>
              <Btn onClick={() => setShowModal(false)}>Cancel</Btn>
              <Btn $variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update Plan' : 'Create Plan'}
              </Btn>
            </ModalFooter>
          </Modal>
        </Overlay>
      )}
      {/* ── Deactivation Confirm Dialog ── */}
      {confirmDeactivate && (
        <Overlay onClick={() => setConfirmDeactivate(null)}>
          <ConfirmBox onClick={e => e.stopPropagation()}>
            <h3>Deactivate Plan?</h3>
            <p>
              You are about to deactivate the <strong>{confirmDeactivate.type.toUpperCase()}</strong> ({confirmDeactivate.period}) plan.
              Users will no longer be able to subscribe to it. This can be re-activated at any time.
            </p>
            <ConfirmActions>
              <Btn onClick={() => setConfirmDeactivate(null)}>Cancel</Btn>
              <Btn
                $variant="primary"
                style={{ background: '#ef4444' }}
                onClick={() => executeToggle(confirmDeactivate)}
              >
                Yes, Deactivate
              </Btn>
            </ConfirmActions>
          </ConfirmBox>
        </Overlay>
      )}
    </Container>
  );
};

export default SubscriptionManagement;
