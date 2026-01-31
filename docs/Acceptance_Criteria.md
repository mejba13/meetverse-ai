# MeetVerse AI - Acceptance Criteria

## Core Meeting Features

### AC-1: Video Conferencing

#### AC-1.1: Join Meeting
- [ ] User can join meeting via link without account (guest mode)
- [ ] User sees camera/mic preview before joining
- [ ] User can select audio/video devices before joining
- [ ] User can set display name before joining
- [ ] Join latency is under 3 seconds after clicking "Join"
- [ ] User sees other participants within 2 seconds of joining

#### AC-1.2: Video Quality
- [ ] Video displays at selected quality (up to 4K)
- [ ] Adaptive bitrate reduces quality gracefully on poor connections
- [ ] Video maintains minimum 24fps at 720p
- [ ] Gallery view displays up to 49 participants per page
- [ ] Page navigation available for meetings > 49 participants

#### AC-1.3: Audio
- [ ] Audio latency is under 150ms
- [ ] Echo cancellation works without feedback loops
- [ ] Noise cancellation removes background noise effectively
- [ ] User can mute/unmute with keyboard shortcut (M key)
- [ ] Visual indicator shows when user is muted
- [ ] Push-to-talk mode available

#### AC-1.4: Screen Sharing
- [ ] User can share entire screen
- [ ] User can share specific application window
- [ ] User can share browser tab with audio
- [ ] Viewers see screen share within 1 second of start
- [ ] Annotation tools available during screen share
- [ ] Multiple screen shares supported (configurable by host)

#### AC-1.5: Meeting Controls
- [ ] Host can mute/unmute participants
- [ ] Host can remove participants
- [ ] Host can lock meeting
- [ ] Host can enable/disable waiting room
- [ ] Host can transfer host role
- [ ] Participants can raise hand
- [ ] Reactions animate and dismiss automatically

### AC-2: AI Features

#### AC-2.1: Real-time Transcription
- [ ] Transcription begins within 3 seconds of meeting start
- [ ] Text appears within 500ms of speech
- [ ] Speaker identification is accurate > 90% of time
- [ ] Confidence score visible for uncertain segments
- [ ] User can correct transcription errors
- [ ] Transcription supports 100+ languages
- [ ] Language auto-detection works for mixed-language meetings

#### AC-2.2: AI Meeting Co-Pilot
- [ ] Co-Pilot available via sidebar panel
- [ ] User can ask questions about meeting content
- [ ] Co-Pilot responds within 3 seconds
- [ ] Responses include source transcript references
- [ ] Co-Pilot can access organization knowledge base
- [ ] Co-Pilot suggests relevant talking points

#### AC-2.3: Action Item Detection
- [ ] Action items extracted with > 85% accuracy
- [ ] Assignee detected from context
- [ ] Due dates extracted when mentioned
- [ ] User can confirm/edit/reject detected items
- [ ] Items link to source transcript timestamp
- [ ] Manual action items can be added

#### AC-2.4: Meeting Summary
- [ ] Summary generated within 2 minutes of meeting end
- [ ] Executive brief format under 250 words
- [ ] Detailed notes format includes all key points
- [ ] Action-focused format lists all commitments
- [ ] Summary emailed to all participants
- [ ] Summary accessible from meeting record

#### AC-2.5: Smart Highlights
- [ ] Key decisions automatically flagged
- [ ] Important quotes extracted
- [ ] Highlight timestamps allow direct playback jump
- [ ] User can manually mark highlights
- [ ] Highlights appear in summary

### AC-3: Recording

#### AC-3.1: Cloud Recording
- [ ] Recording starts within 5 seconds of button press
- [ ] Recording indicator visible to all participants
- [ ] Consent notification shown when recording starts
- [ ] Recording includes all video layouts
- [ ] Recording includes screen shares
- [ ] Recording includes audio from all participants

#### AC-3.2: Playback
- [ ] Recording available within 30 minutes of meeting end
- [ ] Playback supports variable speed (0.5x - 2x)
- [ ] Transcription syncs with playback position
- [ ] Click on transcript jumps to that playback moment
- [ ] Recording shareable via link with permissions
- [ ] Download available (host/admin only)

### AC-4: Chat

#### AC-4.1: In-Meeting Chat
- [ ] Messages delivered within 1 second
- [ ] File sharing supports common formats (PDF, DOC, images)
- [ ] Files under 25MB upload successfully
- [ ] Threaded replies supported
- [ ] Reactions (emoji) on messages
- [ ] Chat history persists for rejoining participants
- [ ] Private messaging between participants
- [ ] Chat exportable after meeting

### AC-5: Integrations

#### AC-5.1: Calendar Integration
- [ ] Google Calendar events sync bidirectionally
- [ ] Outlook Calendar events sync bidirectionally
- [ ] Meeting link auto-added to calendar event
- [ ] Calendar shows upcoming meetings on dashboard
- [ ] One-click join from calendar event

#### AC-5.2: Project Tool Integration
- [ ] Action items push to Asana as tasks
- [ ] Action items push to Jira as issues
- [ ] Action items push to Trello as cards
- [ ] Action items push to Notion as items
- [ ] Assignee mapping works correctly
- [ ] Due dates transfer correctly

#### AC-5.3: Communication Integration
- [ ] Meeting summaries post to configured Slack channel
- [ ] Action items post to configured Slack channel
- [ ] Meeting notifications sent via Slack
- [ ] Same functionality for Microsoft Teams

---

## User Experience

### AC-6: Performance

- [ ] Page load (First Contentful Paint) under 2 seconds
- [ ] Interaction response under 100ms
- [ ] No UI jank during video calls (60fps)
- [ ] Works on 5 Mbps connection
- [ ] Graceful degradation on slow connections

### AC-7: Accessibility

- [ ] WCAG 2.1 AA compliance
- [ ] Full keyboard navigation
- [ ] Screen reader compatible
- [ ] High contrast mode available
- [ ] Minimum 4.5:1 color contrast ratios
- [ ] Focus indicators visible
- [ ] Live captions available

### AC-8: Responsive Design

- [ ] Full functionality on desktop (1024px+)
- [ ] Adapted layout on tablet (768px - 1023px)
- [ ] Mobile-optimized layout (< 768px)
- [ ] Touch-friendly controls on mobile
- [ ] Portrait and landscape orientations supported

---

## Authentication & Security

### AC-9: Authentication

- [ ] Email/password registration works
- [ ] Email verification required
- [ ] Google OAuth works
- [ ] Microsoft OAuth works
- [ ] GitHub OAuth works
- [ ] SSO (SAML 2.0) works for Enterprise
- [ ] MFA enrollment and verification works
- [ ] Password reset flow works
- [ ] Session expires after configured timeout
- [ ] Concurrent session limit enforced

### AC-10: Security

- [ ] All traffic over HTTPS (TLS 1.3)
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens expire in 15 minutes
- [ ] Refresh tokens rotate on use
- [ ] CSRF protection on all forms
- [ ] Rate limiting on auth endpoints
- [ ] Audit log captures security events

---

## Admin Features

### AC-11: User Management

- [ ] Admin can view all users
- [ ] Admin can search/filter users
- [ ] Admin can change user roles
- [ ] Admin can suspend/activate users
- [ ] Admin can reset user passwords
- [ ] Admin can view user meeting history

### AC-12: Analytics Dashboard

- [ ] Overview shows key metrics (users, meetings, AI usage)
- [ ] Meeting trends chart shows daily/weekly/monthly
- [ ] Duration analytics show average meeting length
- [ ] Peak usage times displayed
- [ ] AI usage metrics (transcription minutes, queries)
- [ ] Export reports as CSV

### AC-13: Organization Settings

- [ ] Org profile editable (name, logo)
- [ ] Default meeting settings configurable
- [ ] Data retention policies configurable
- [ ] IP allowlisting configurable
- [ ] SSO configuration UI

---

## MVP Scope Boundary

### MVP Includes (Phase 1)
- [x] Video conferencing (HD, up to 50 participants)
- [x] Screen sharing (basic, no annotation)
- [x] Real-time transcription (English only)
- [x] Basic AI summaries
- [x] Action item detection (basic)
- [x] Cloud recording
- [x] In-meeting chat
- [x] Email/password + OAuth authentication
- [x] Basic dashboard
- [x] Meeting scheduling

### Post-MVP (Phase 2+)
- [ ] 4K video
- [ ] 200 participants
- [ ] Annotation tools
- [ ] Multi-language transcription (100+ languages)
- [ ] AI Co-Pilot with knowledge base
- [ ] Sentiment analysis
- [ ] Live translation
- [ ] Calendar integrations
- [ ] Project tool integrations
- [ ] Admin dashboard
- [ ] SSO
- [ ] E2EE
- [ ] Mobile apps
- [ ] Breakout rooms
