import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { FiX, FiDownload, FiMapPin, FiCalendar, FiBriefcase, FiBook, FiGlobe, FiShield, FiCheckCircle, FiClock, FiUser, FiAward, FiAlertCircle, FiFileText, FiEye, FiChevronLeft } from 'react-icons/fi';
import { Account } from '../services/accountsApi';
import partyProfileApi, { PartyProfile } from '../services/partyProfileApi';

const PARTY_BASE = import.meta.env.VITE_PARTY_SERVICE || 'https://stage-party.besewonline.com';

interface Props {
  account: Account;
  onClose: () => void;
}

const UserProfileModal: React.FC<Props> = ({ account, onClose }) => {
  const [profile, setProfile] = useState<PartyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'education' | 'experience'>('overview');
  const [docViewer, setDocViewer] = useState<{ url: string; name: string } | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setErrorDetail(null);
    partyProfileApi.getByPartyId(account.party_id)
      .then(data => { setProfile(data); setLoading(false); })
      .catch((err: any) => {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || 'Unknown error';
        if (status === 403) {
          setError('Access restricted');
          setErrorDetail(`Party profile access denied (403). The admin role may not have cross-user profile access on this endpoint. Account data shown below is from the accounts service.`);
        } else if (status === 404) {
          setError('Profile not found');
          setErrorDetail(`No party profile exists yet for party ID: ${account.party_id}`);
        } else {
          setError('Could not load party profile');
          setErrorDetail(msg);
        }
        setLoading(false);
      });
  }, [account.party_id]);

  const buildUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return `${PARTY_BASE}${path}`;
    // For relative photo paths, use the company-data/file endpoint
    return `${PARTY_BASE}/company-data/file/${path}`;
  };

  const getDocUrl = (e: { [key: string]: any }) => {
    const raw =
      e.document || e.certificate || e.file || e.edu_document ||
      e.education_document || e.attachment || e.doc || e.fileUrl ||
      e.file_url || e.documentUrl || e.document_url || e.upload ||
      e.uploaded_file || e.edu_file || e.cert || e.cert_file ||
      e.certification || e.transcript || e.diploma;
    return buildUrl(raw);
  };

  const isPdf = (url: string) => url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('pdf');
  const isImage = (url: string) => /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(url);

  const photoUrl = buildUrl(profile?.photo);
  const resumeUrl = buildUrl(profile?.resume_file_upload);

  // Debug logging
  useEffect(() => {
    if (profile) {
      console.log('[UserProfileModal Debug]', {
        partyId: account.party_id,
        profilePhotoField: profile.photo,
        builtPhotoUrl: photoUrl,
        profileLoaded: true
      });
    }
  }, [profile, photoUrl, account.party_id]);

  const exp = profile?.experience?.length ? profile.experience : profile?.experiance || [];
  const edu = profile?.education || [];
  const isVerified = profile?.verfied || profile?.auth_verfied || account.is_verified || account.verified;

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—';

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        {/* Header */}
        <ModalHeader>
          <HeaderLeft>
            {loading ? (
              <AvatarSkeleton />
            ) : (photoUrl && !avatarLoadError) ? (
              <ModalAvatar 
                src={photoUrl} 
                alt={account.profile_name}
                onError={() => {
                  console.log('[UserProfileModal] Image load failed for:', photoUrl);
                  setAvatarLoadError(true);
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <AvatarFallback>{account.profile_name.charAt(0).toUpperCase()}</AvatarFallback>
            )}
            <HeaderInfo>
              <ModalName>{account.profile_name}</ModalName>
              <ModalMeta>
                <MetaItem><FiUser size={12} />{account.party_type?.name || '—'}</MetaItem>
                {(profile?.city || profile?.country) && (
                  <MetaItem><FiMapPin size={12} />{[profile.city, profile.country].filter(Boolean).join(', ')}</MetaItem>
                )}
              </ModalMeta>
              <BadgeRow>
                {isVerified
                  ? <VerifiedBadge><FiCheckCircle size={11} /> Verified</VerifiedBadge>
                  : <PendingBadge><FiClock size={11} /> Pending</PendingBadge>
                }
                {profile?.is_trusted && <TrustedBadge><FiShield size={11} /> Trusted</TrustedBadge>}
                {profile?.open_to_work && <OpenBadge><FiBriefcase size={11} /> Open to work</OpenBadge>}
                <RoleBadge $role={account.role}>{account.role}</RoleBadge>
              </BadgeRow>
            </HeaderInfo>
          </HeaderLeft>
          <HeaderRight>
            {resumeUrl && (
              <DownloadBtn href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <FiDownload size={14} /> Resume
              </DownloadBtn>
            )}
            <CloseBtn onClick={onClose}><FiX size={18} /></CloseBtn>
          </HeaderRight>
        </ModalHeader>

        {/* Contact strip — only show extra party profile fields not in account info */}
        {!loading && profile && (profile.date_of_birth || profile.worker_type_preference) && (
          <ContactStrip>
            {profile.date_of_birth && <ContactItem><FiCalendar size={12} />Born {formatDate(profile.date_of_birth)}</ContactItem>}
            {profile.worker_type_preference && <ContactItem><FiBriefcase size={12} />{profile.worker_type_preference}</ContactItem>}
          </ContactStrip>
        )}

        {/* Tabs */}
        <Tabs>
          {(['overview', 'education', 'experience'] as const).map(t => (
            <Tab key={t} $active={activeTab === t} onClick={() => setActiveTab(t)}>
              {t === 'overview' ? <FiUser size={13} /> : t === 'education' ? <FiBook size={13} /> : <FiBriefcase size={13} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'education' && edu.length > 0 && <TabCount>{edu.length}</TabCount>}
              {t === 'experience' && exp.length > 0 && <TabCount>{exp.length}</TabCount>}
            </Tab>
          ))}
        </Tabs>

        {/* Body */}
        <ModalBody>
          {loading && (
            <LoadingWrap>
              <Spinner /><span>Loading profile…</span>
            </LoadingWrap>
          )}
          {error && activeTab !== 'overview' && (
            <Empty><FiAlertCircle size={28} color="#d69e2e" /><p>{error}</p><p style={{fontSize:11,color:'#a0aec0'}}>{errorDetail}</p></Empty>
          )}

          {!loading && activeTab === 'overview' && (
            <Grid2>
              {/* Always show account info from accounts service */}
              <InfoCard>
                <InfoCardTitle><FiUser size={13} /> Account Info</InfoCardTitle>
                <InfoRow><InfoLabel>Account ID</InfoLabel><InfoVal><Mono>{account.account_id}</Mono></InfoVal></InfoRow>
                <InfoRow><InfoLabel>Party ID</InfoLabel><InfoVal><Mono>{account.party_id}</Mono></InfoVal></InfoRow>
                <InfoRow><InfoLabel>Name</InfoLabel><InfoVal>{account.profile_name}</InfoVal></InfoRow>
                {account.email && <InfoRow><InfoLabel>Email</InfoLabel><InfoVal>{account.email}</InfoVal></InfoRow>}
                {(account.phone || account.phonenumber) && <InfoRow><InfoLabel>Phone</InfoLabel><InfoVal>{account.phone || account.phonenumber}</InfoVal></InfoRow>}
                <InfoRow><InfoLabel>Role</InfoLabel><InfoVal style={{textTransform:'capitalize'}}>{account.role}</InfoVal></InfoRow>
                <InfoRow><InfoLabel>Status</InfoLabel><InfoVal style={{textTransform:'capitalize'}}>{account.status.replace('_',' ')}</InfoVal></InfoRow>
                <InfoRow><InfoLabel>Party Type</InfoLabel><InfoVal>{account.party_type?.name || '—'}</InfoVal></InfoRow>
                <InfoRow><InfoLabel>Joined</InfoLabel><InfoVal>{new Date(account.date).toLocaleString()}</InfoVal></InfoRow>
              </InfoCard>

              {/* Party profile data — shown only if loaded successfully */}
              {profile ? (
                <InfoCard>
                  <InfoCardTitle><FiMapPin size={13} /> Profile Details</InfoCardTitle>
                  <InfoRow><InfoLabel>Full Name</InfoLabel><InfoVal>{[profile.name, profile.last_name].filter(Boolean).join(' ') || '—'}</InfoVal></InfoRow>
                  <InfoRow><InfoLabel>Gender</InfoLabel><InfoVal>{profile.sex || '—'}</InfoVal></InfoRow>
                  <InfoRow><InfoLabel>Marital</InfoLabel><InfoVal>{profile.martial_status || '—'}</InfoVal></InfoRow>
                  <InfoRow><InfoLabel>Country</InfoLabel><InfoVal>{profile.country || '—'}</InfoVal></InfoRow>
                  <InfoRow><InfoLabel>City</InfoLabel><InfoVal>{profile.city || '—'}</InfoVal></InfoRow>
                  {profile.phone_number && <InfoRow><InfoLabel>Phone</InfoLabel><InfoVal>{profile.phone_number}</InfoVal></InfoRow>}
                  {profile.date_of_birth && <InfoRow><InfoLabel>Born</InfoLabel><InfoVal>{formatDate(profile.date_of_birth)}</InfoVal></InfoRow>}
                  {profile.worker_type_preference && <InfoRow><InfoLabel>Worker Type</InfoLabel><InfoVal style={{textTransform:'capitalize'}}>{profile.worker_type_preference}</InfoVal></InfoRow>}
                </InfoCard>
              ) : error ? (
                <InfoCard>
                  <InfoCardTitle><FiAlertCircle size={13} color="#d69e2e" /> Party Profile</InfoCardTitle>
                  <NoProfileNote>
                    <FiAlertCircle size={14} />
                    <span>{error} — {errorDetail}</span>
                  </NoProfileNote>
                </InfoCard>
              ) : null}

              {profile && (
                <InfoCard>
                  <InfoCardTitle><FiAward size={13} /> Stats</InfoCardTitle>
                  <StatGrid>
                    <StatBox><StatNum>{profile.number_of_applied ?? 0}</StatNum><StatLbl>Applied</StatLbl></StatBox>
                    <StatBox><StatNum>{profile.number_of_offered ?? 0}</StatNum><StatLbl>Offered</StatLbl></StatBox>
                    <StatBox><StatNum>{profile.number_of_hired ?? 0}</StatNum><StatLbl>Hired</StatLbl></StatBox>
                    <StatBox><StatNum>{profile.number_of_completed_projects ?? 0}</StatNum><StatLbl>Completed</StatLbl></StatBox>
                  </StatGrid>
                </InfoCard>
              )}

              {profile?.lang_skill && profile.lang_skill.length > 0 && (
                <InfoCard style={{ gridColumn: 'span 2' }}>
                  <InfoCardTitle><FiGlobe size={13} /> Languages</InfoCardTitle>
                  <TagWrap>
                    {profile.lang_skill.map((l, i) => <Tag key={i}>{l}</Tag>)}
                  </TagWrap>
                </InfoCard>
              )}

              {profile?.social_media_links && profile.social_media_links.length > 0 && (
                <InfoCard style={{ gridColumn: 'span 2' }}>
                  <InfoCardTitle><FiGlobe size={13} /> Social Links</InfoCardTitle>
                  <LinkList>
                    {profile.social_media_links.map((l, i) => (
                      <SocialLink key={i} href={l} target="_blank" rel="noopener noreferrer">{l}</SocialLink>
                    ))}
                  </LinkList>
                </InfoCard>
              )}
            </Grid2>
          )}

          {!loading && !error && activeTab === 'education' && (
            edu.length === 0
              ? <Empty><FiBook size={32} /><p>No education records</p></Empty>
              : docViewer
                ? (
                  <DocViewerWrap>
                    <DocViewerBar>
                      <BackBtn onClick={() => setDocViewer(null)}>
                        <FiChevronLeft size={15} /> Back to Education
                      </BackBtn>
                      <DocViewerName>{docViewer.name}</DocViewerName>
                      <DocViewerActions>
                        <DownloadBtn href={docViewer.url} target="_blank" rel="noopener noreferrer" download>
                          <FiDownload size={13} /> Download
                        </DownloadBtn>
                        <DownloadBtn href={docViewer.url} target="_blank" rel="noopener noreferrer" style={{ background: '#805ad5' }}>
                          <FiEye size={13} /> Open in Tab
                        </DownloadBtn>
                      </DocViewerActions>
                    </DocViewerBar>
                    {isPdf(docViewer.url) ? (
                      <DocFrame src={docViewer.url} title={docViewer.name} />
                    ) : isImage(docViewer.url) ? (
                      <DocImageWrap>
                        <DocImage src={docViewer.url} alt={docViewer.name}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </DocImageWrap>
                    ) : (
                      <DocFallback>
                        <FiFileText size={48} color="#a0aec0" />
                        <p>Cannot preview this file type.</p>
                        <DownloadBtn href={docViewer.url} target="_blank" rel="noopener noreferrer">
                          <FiDownload size={13} /> Download to View
                        </DownloadBtn>
                      </DocFallback>
                    )}
                  </DocViewerWrap>
                )
                : (
                  <Timeline>
                    {edu.map((e, i) => {
                      const docUrl = getDocUrl(e);
                      return (
                        <TimelineItem key={i}>
                          <TimelineDot />
                          <TimelineContent>
                            <TimelineTitle>{e.institute}</TimelineTitle>
                            <TimelineSubtitle>{e.level?.replace(/_/g, ' ')} · {e.fieldOfStudies}</TimelineSubtitle>
                            <TimelineMeta>
                              {formatDate(e.start_date)} — {e.graduated ? formatDate(e.end_date) : 'Present'}
                              {e.gpa && <GpaBadge>GPA {e.gpa}</GpaBadge>}
                              {e.graduated && <GpaBadge style={{ background: '#c6f6d5', color: '#276749' }}>Graduated</GpaBadge>}
                            </TimelineMeta>
                            {docUrl ? (
                              <DocBtn onClick={() => setDocViewer({ url: docUrl, name: `${e.institute} — ${e.level}` })}>
                                <FiFileText size={13} /> View Document
                              </DocBtn>
                            ) : (
                              <NoDocNote><FiAlertCircle size={11} /> No document uploaded</NoDocNote>
                            )}
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })}
                  </Timeline>
                )
          )}

          {!loading && !error && activeTab === 'experience' && (
            exp.length === 0
              ? <Empty><FiBriefcase size={32} /><p>No experience records</p></Empty>
              : <Timeline>
                  {exp.map((e, i) => (
                    <TimelineItem key={i}>
                      <TimelineDot $color="#3182ce" />
                      <TimelineContent>
                        <TimelineTitle>{e.position} <span style={{ fontWeight: 400, color: '#718096' }}>@ {e.company}</span></TimelineTitle>
                        <TimelineSubtitle>{e.level}{e.no_of_years ? ` · ${e.no_of_years}y` : ''}</TimelineSubtitle>
                        <TimelineMeta>
                          {formatDate(e.start_date)} — {e.is_current ? 'Present' : formatDate(e.end_date)}
                        </TimelineMeta>
                        {e.description && <TimelineDesc>{e.description}</TimelineDesc>}
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
          )}
        </ModalBody>
      </Modal>
    </Overlay>,
    document.body
  );
};

export default UserProfileModal;

// ── Animations ──
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;
const spin = keyframes`to { transform: rotate(360deg); }`;

// ── Styled Components ──
const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.55);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.15s ease;
`;
const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 100%; max-width: 720px;
  max-height: 88vh;
  display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  animation: ${slideUp} 0.2s ease;
  overflow: hidden;
`;
const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #edf2f7;
  gap: 12px;
`;
const HeaderLeft = styled.div`display: flex; gap: 16px; align-items: flex-start; flex: 1; min-width: 0;`;
const HeaderRight = styled.div`display: flex; gap: 8px; align-items: center; flex-shrink: 0;`;
const ModalAvatar = styled.img`
  width: 80px; height: 80px; border-radius: 50%;
  object-fit: cover; border: 3px solid #e2e8f0; flex-shrink: 0;
  background: #f7fafc;
`;
const AvatarFallback = styled.div`
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg, #4299e1, #667eea);
  color: white; font-size: 32px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
`;
const AvatarSkeleton = styled.div`
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%);
  background-size: 200% 100%;
  flex-shrink: 0;
`;
const HeaderInfo = styled.div`display: flex; flex-direction: column; gap: 6px; min-width: 0;`;
const ModalName = styled.h2`font-size: 20px; font-weight: 700; color: #1a202c; margin: 0;`;
const ModalMeta = styled.div`display: flex; gap: 12px; flex-wrap: wrap;`;
const MetaItem = styled.span`display: flex; align-items: center; gap: 4px; font-size: 12px; color: #718096;`;
const BadgeRow = styled.div`display: flex; gap: 6px; flex-wrap: wrap;`;
const VerifiedBadge = styled.span`display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:#f0fff4;color:#276749;border:1px solid #9ae6b4;`;
const PendingBadge = styled.span`display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:#fffbeb;color:#92400e;border:1px solid #fbd38d;`;
const TrustedBadge = styled.span`display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:#ebf8ff;color:#2b6cb0;border:1px solid #bee3f8;`;
const OpenBadge = styled.span`display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;background:#f0fff4;color:#276749;border:1px solid #9ae6b4;`;
const RoleBadge = styled.span<{ $role: string }>`
  display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;
  background:${p => p.$role==='admin'?'#fff5f5':p.$role==='agency'?'#fffbeb':'#ebf8ff'};
  color:${p => p.$role==='admin'?'#c53030':p.$role==='agency'?'#b7791f':'#2b6cb0'};
  border:1px solid ${p => p.$role==='admin'?'#feb2b2':p.$role==='agency'?'#f6e05e':'#bee3f8'};
`;
const DownloadBtn = styled.a`
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 14px;border-radius:8px;
  background:#4299e1;color:white;
  font-size:13px;font-weight:600;
  text-decoration:none;
  transition:background 0.15s;
  &:hover{background:#2b6cb0;}
`;
const CloseBtn = styled.button`
  width:32px;height:32px;border-radius:8px;border:none;
  background:#f7fafc;color:#718096;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:all 0.15s;
  &:hover{background:#e53e3e;color:white;}
`;
const ContactStrip = styled.div`
  display:flex;gap:16px;flex-wrap:wrap;
  padding:10px 24px;background:#f7fafc;
  border-bottom:1px solid #edf2f7;
`;
const ContactItem = styled.span`display:flex;align-items:center;gap:5px;font-size:12px;color:#4a5568;`;
const Tabs = styled.div`
  display:flex;gap:0;
  padding:0 24px;
  border-bottom:2px solid #edf2f7;
`;
const Tab = styled.button<{ $active: boolean }>`
  display:flex;align-items:center;gap:6px;
  padding:12px 16px;border:none;background:none;cursor:pointer;
  font-size:13px;font-weight:600;
  color:${p => p.$active ? '#4299e1' : '#a0aec0'};
  border-bottom:2px solid ${p => p.$active ? '#4299e1' : 'transparent'};
  margin-bottom:-2px;
  transition:all 0.15s;
  &:hover{color:#4299e1;}
`;
const TabCount = styled.span`
  background:#edf2f7;color:#718096;
  border-radius:10px;padding:0 6px;font-size:10px;font-weight:700;
`;
const ModalBody = styled.div`flex:1;overflow-y:auto;padding:20px 24px;`;
const LoadingWrap = styled.div`
  display:flex;align-items:center;justify-content:center;gap:10px;
  padding:48px;color:#a0aec0;font-size:14px;
`;
const Spinner = styled.span`
  width:20px;height:20px;border-radius:50%;
  border:2px solid #e2e8f0;border-top-color:#4299e1;
  display:inline-block;
  animation:${spin} 0.7s linear infinite;
`;
const NoProfileNote = styled.div`
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 12px; color: #92400e; line-height: 1.5;
  background: #fffbeb; border-radius: 8px; padding: 10px;
  border: 1px solid #fbd38d;
  svg { flex-shrink: 0; margin-top: 1px; }
`;
const Grid2 = styled.div`
  display:grid;grid-template-columns:1fr 1fr;gap:16px;
  @media(max-width:560px){grid-template-columns:1fr;}
`;
const InfoCard = styled.div`
  background:#f7fafc;border-radius:12px;padding:16px;
  border:1px solid #edf2f7;
`;
const InfoCardTitle = styled.div`
  display:flex;align-items:center;gap:6px;
  font-size:11px;font-weight:700;color:#718096;
  text-transform:uppercase;letter-spacing:0.6px;
  margin-bottom:12px;
`;
const InfoRow = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:5px 0;border-bottom:1px solid #edf2f7;
  &:last-child{border-bottom:none;}
`;
const InfoLabel = styled.span`font-size:12px;color:#a0aec0;font-weight:500;`;
const InfoVal = styled.span`font-size:13px;color:#2d3748;font-weight:500;text-align:right;`;
const Mono = styled.span`font-family:monospace;font-size:11px;background:#edf2f7;padding:2px 6px;border-radius:4px;`;
const StatGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:10px;`;
const StatBox = styled.div`
  background:white;border-radius:8px;padding:12px;text-align:center;
  border:1px solid #edf2f7;
`;
const StatNum = styled.div`font-size:22px;font-weight:700;color:#2d3748;`;
const StatLbl = styled.div`font-size:11px;color:#a0aec0;font-weight:500;margin-top:2px;`;
const TagWrap = styled.div`display:flex;gap:6px;flex-wrap:wrap;`;
const Tag = styled.span`
  padding:3px 10px;border-radius:20px;font-size:12px;font-weight:500;
  background:#ebf8ff;color:#2b6cb0;border:1px solid #bee3f8;
`;
const LinkList = styled.div`display:flex;flex-direction:column;gap:4px;`;
const SocialLink = styled.a`font-size:12px;color:#4299e1;text-decoration:none;word-break:break-all;&:hover{text-decoration:underline;}`;
const Empty = styled.div`
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:48px;color:#cbd5e0;gap:8px;
  p{font-size:14px;margin:0;}
`;
const Timeline = styled.div`display:flex;flex-direction:column;gap:0;`;
const TimelineItem = styled.div`
  display:flex;gap:16px;padding-bottom:20px;
  position:relative;
  &:not(:last-child)::before {
    content:'';position:absolute;left:7px;top:16px;bottom:0;
    width:2px;background:#edf2f7;
  }
`;
const TimelineDot = styled.div<{ $color?: string }>`
  width:16px;height:16px;border-radius:50%;flex-shrink:0;margin-top:2px;
  background:${p => p.$color || '#38a169'};
  border:2px solid white;
  box-shadow:0 0 0 2px ${p => p.$color || '#38a169'};
`;
const TimelineContent = styled.div`flex:1;min-width:0;`;
const TimelineTitle = styled.div`font-size:14px;font-weight:600;color:#1a202c;`;
const TimelineSubtitle = styled.div`font-size:12px;color:#718096;margin-top:2px;text-transform:capitalize;`;
const TimelineMeta = styled.div`
  display:flex;align-items:center;gap:8px;
  font-size:11px;color:#a0aec0;margin-top:4px;
`;
const TimelineDesc = styled.div`font-size:12px;color:#4a5568;margin-top:6px;line-height:1.5;`;
const GpaBadge = styled.span`
  background:#fef3c7;color:#92400e;
  border-radius:4px;padding:1px 6px;font-size:10px;font-weight:700;
`;
const DocBtn = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 8px; padding: 5px 12px;
  border-radius: 6px; border: 1.5px solid #bee3f8;
  background: #ebf8ff; color: #2b6cb0;
  font-size: 12px; font-weight: 600; cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #4299e1; color: white; border-color: #4299e1; }
`;
const NoDocNote = styled.div`
  display: inline-flex; align-items: center; gap: 5px;
  margin-top: 8px; font-size: 11px; color: #a0aec0;
`;
const DocViewerWrap = styled.div`
  display: flex; flex-direction: column; gap: 0;
  border-radius: 10px; overflow: hidden;
  border: 1px solid #e2e8f0;
`;
const DocViewerBar = styled.div`
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 10px 14px;
  background: #f7fafc; border-bottom: 1px solid #e2e8f0;
`;
const BackBtn = styled.button`
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 10px; border-radius: 6px;
  border: 1px solid #e2e8f0; background: white;
  font-size: 12px; font-weight: 600; color: #4a5568; cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #edf2f7; }
`;
const DocViewerName = styled.span`
  flex: 1; font-size: 13px; font-weight: 600; color: #2d3748;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const DocViewerActions = styled.div`display: flex; gap: 6px; flex-shrink: 0;`;
const DocFrame = styled.iframe`
  width: 100%; height: 520px; border: none; background: #f7fafc;
`;
const DocImageWrap = styled.div`
  padding: 16px; background: #f7fafc;
  display: flex; justify-content: center; align-items: flex-start;
  min-height: 300px;
`;
const DocImage = styled.img`
  max-width: 100%; max-height: 500px;
  border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);
`;
const DocFallback = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; padding: 48px; background: #f7fafc;
  p { font-size: 14px; color: #718096; margin: 0; }
`;
