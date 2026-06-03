# Universe Meeting App — 개발 플랜

## 1단계: 프로젝트 셋업 (Week 1)
- [ ] 모노레포 구조 설계 (pnpm workspace)
- [ ] NestJS 백엔드 스캐폴딩
- [ ] React 프론트엔드 스캐폴딩 (Vite + Tailwind)
- [ ] Docker Compose 개발환경 (PostgreSQL, Redis, MinIO)
- [ ] ESLint + Prettier + Husky 설정
- [ ] GitHub Actions CI/CD 파이프라인

## 2단계: 코어 인증 + 유저 (Week 1-2)
- [ ] JWT 인증 시스템 (NestJS Auth module)
- [ ] 유저 프로필 CRUD
- [ ] Redis 세션 관리
- [ ] Role 기반 접근 제어 (RBAC)

## 3단계: 실시간 미팅 (Week 2-3)
- [ ] WebRTC 시그널링 서버 (Socket.IO)
- [ ] LiveKit SFU 연동 or 자체 SFU
- [ ] 1:1 화상 통화
- [ ] 그룹 미팅 (최대 25인)
- [ ] 화면 공유
- [ ] 미팅 링크 생성/참여

## 4단계: 소셜 피드 (Week 3-4)
- [ ] 포스트 CRUD (텍스트, 이미지, 비디오)
- [ ] 좋아요, 댓글, 공유 (Socket.IO 실시간)
- [ ] 팔로우/언팔로우 시스템
- [ ] Infinite scroll 피드
- [ ] 이미지 업로드 + S3 저장

## 5단계: 라이브 스트리밍 (Week 4-5)
- [ ] RTMP 수신 서버 (Go or Node.js FFmpeg)
- [ ] HLS 변환 + 송출
- [ ] 실시간 채팅 (WebSocket)
- [ ] 방송 녹화 + VOD 저장
- [ ] RTMP 키 발급

## 6단계: 숏폼 비디오 (Week 5-6)
- [ ] FFmpeg 트랜스코딩 파이프라인
- [ ] 바이럴 추천 알고리즘
- [ ] 스와이프 숏폼 UI
- [ ] 비디오 좋아요/댓글

## 7단계: 크리에이터 구독 (Week 6-7)
- [ ] 구독 티어 시스템
- [ ] ETH/USDT 결제 연동
- [ ] 페이월 콘텐츠 게이트
- [ ] 수익 대시보드
- [ ] 정산 시스템

## 8단계: 연합 (Week 7-8)
- [ ] ActivityPub 프로토콜 구현
- [ ] Mastodon/Pixelfed와 연동
- [ ] ActivityPub Inbox/Outbox
- [ ] WebFinger 지원

## 9단계: 보안 + 성능 (Week 8-9)
- [ ] E2E 암호화 메시징
- [ ] Redis Rate Limiting
- [ ] Bull Job Queue (이메일, 알림, 트랜스코딩)
- [ ] AI 사기/스팸 탐지
- [ ] CDN + 캐싱 최적화

## 10단계: 출시 준비 (Week 9-10)
- [ ] 셀프 호스트 가이드
- [ ] Docker 원클릭 배포
- [ ] 모바일 앱 (React Native)
- [ ] 문서화 + API 레퍼런스
- [ ] 로드 테스트
