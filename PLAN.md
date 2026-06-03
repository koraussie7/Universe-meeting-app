# Universe Meeting App — 엑기스 재구성 플랜

## 🔥 7개 소스 중복 제거 & 핵심 추출

### 중복 분석
| 기능 | instagram | MarketX | otter-peer | owncast | pixelfed | loops | not-only-fans |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 소셜 피드 | ✅ | - | - | - | ✅ | ✅ | ✅ |
| 실시간 채팅 | ✅ | - | - | ✅ | - | - | - |
| WebRTC 화상 | - | - | ✅ | - | - | - | - |
| 라이브 스트리밍 | - | - | - | ✅ | - | - | - |
| 숏폼 비디오 | ✅ | - | - | - | - | ✅ | - |
| 구독/페이월 | - | - | - | - | - | - | ✅ |
| 결제(Stripe) | - | ✅ | - | - | - | - | - |
| E2E 암호화 | - | - | ✅ | - | - | - | - |
| ActivityPub | - | - | - | - | ✅ | - | - |
| 미디어 트랜스코딩 | - | - | - | ✅ | - | ✅ | - |

---

## 🎯 최종 4대 핵심 모듈 (중복 제거)

### 1. 🎥 Live — 실시간 미팅 + 스트리밍
- **소스**: otter-peer(WebRTC) + owncast(RTMP/HLS)
- **선택 이유**: WebRTC는 otter-peer가 P2P로 경량, RTMP/HLS는 owncast가 Go로 검증됨
- **삭제 사유**: instagram/loops/pixelfed는 이 기능 없음

### 2. 📱 Feed — 소셜 피드 + 숏폼
- **소스**: instagram-mern(소셜피드) + loops-server(숏폼FFmpeg)
- **선택 이유**: instagram은 Socket.IO 실시간 피드, loops는 FFmpeg 파이프라인
- **중복 제거**: pixelfed(피드), not-only-fans(피드), MarketX(없음) → 과감히 삭제

### 3. 💰 Monetize — 구독 + 결제
- **소스**: not-only-fans(구독모델) + MarketX(Escrow) → **우리 건 225 onlyfans-service로 대체**
- **선택 이유**: 이미 Stripe+Prisma+PeerTube 연동 완료된 서비스 있음
- **중복 제거**: not-only-fans의 PHP/ETH 결제, MarketX의 결제 전부 → 225 모듈로 통합

### 4. 🌐 Federate — 연합 프로토콜
- **소스**: pixelfed(ActivityPub)
- **선택 이유**: pixelfed는 Mastodon과 호환되는 유일한 ActivityPub 구현체
- **삭제 사유**: 나머지 6개는 연합 기능 없음

---

## 🗑️ 과감히 버리는 것

| 버릴 것 | 이유 |
|---------|------|
| **pixelfed 전체 피드/미디어** | instagram-mern + loops로 대체, ActivityPub만 추출 |
| **MarketX 결제/Escrow** | 225 onlyfans-service가 더 완성도 높음 |
| **MarketX 사기탐지 AI** | MVP에서 과잉, 나중에 추가 |
| **not-only-fans PHP 백엔드** | NestJS로 통일, 구독 모델만 개념 차용 |
| **not-only-fans ETH 결제** | Stripe로 통일 |
| **owncast 프론트엔드** | React로 통일 |
| **loops-server 피드 로직** | instagram 피드로 통일, FFmpeg만 추출 |
| **instagram-mern Redux** | Zustand로 경량화 |
| **instagram-mern MongoDB** | PostgreSQL로 통일 |
| **otter-peer Kademlia DHT** | MVP에서 과잉, 중앙 시그널링 서버로 충분 |

---

## 🧬 최종 기술 스택 (통합)

```
언어/런타임:   TypeScript (전체 통일)
백엔드:        NestJS monolith → 필요시 MSA
프론트엔드:    React + Vite + TailwindCSS
모바일:        React Native (추후)
DB:            PostgreSQL + Prisma
캐시/큐:       Redis + Bull
실시간:        Socket.IO
화상회의:      WebRTC + LiveKit SFU
스트리밍:      Go RTMP→HLS 서버 (owncast 경량화)
미디어:        FFmpeg (loops 파이프라인)
저장소:        S3 (MinIO)
연합:          ActivityPub (pixelfed 구현)
결제:          Stripe (225 onlyfans-service 프록시)
인증:          JWT + OAuth2
```

---

## 📋 8주 실행 플랜

### Phase 1: Foundation (Week 1-2)
```
모노레포 셋업 ──► NestJS 스캐폴딩 ──► React 스캐폴딩
                                       │
PostgreSQL + Redis + MinIO ────────────┘
       │
  Auth (JWT) + User CRUD + Prisma 스키마
```

### Phase 2: Live (Week 3-4)
```
WebRTC 시그널링 ──► 1:1 통화 ──► 그룹 통화 (LiveKit SFU)
                                        │
RTMP 수신 서버 ──► HLS 변환 ──► 라이브 채팅
```

### Phase 3: Feed (Week 5-6)
```
포스트 CRUD ──► 이미지/비디오 업로드 ──► 좋아요/댓글
                                            │
FFmpeg 트랜스코딩 ──► 숏폼 피드 ──► 추천 알고리즘
```

### Phase 4: Monetize + Federate (Week 7-8)
```
225 결제 API 연동 ──► 구독 티어 ──► 페이월
                                        │
ActivityPub 구현 ──► Mastodon/Pixelfed 연동 ──► WebFinger
```

---

## 📁 디렉토리 구조 (예상)

```
universe-meeting-app/
├── packages/
│   ├── api/               # NestJS 백엔드
│   │   ├── src/
│   │   │   ├── auth/      # JWT + OAuth2
│   │   │   ├── users/     # 유저 CRUD
│   │   │   ├── live/      # WebRTC 시그널링 + RTMP 관리
│   │   │   ├── feed/      # 포스트 + 피드
│   │   │   ├── media/     # FFmpeg + S3 업로드
│   │   │   ├── payment/   # 225 onlyfans-service 프록시
│   │   │   ├── federation/# ActivityPub
│   │   │   └── prisma/    # DB 스키마
│   │   └── package.json
│   ├── web/               # React 프론트엔드
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── live/  # 미팅 UI + 스트리밍
│   │   │   │   ├── feed/  # 피드 + 숏폼
│   │   │   │   ├── profile/
│   │   │   │   └── subscribe/
│   │   │   └── shared/    # 공통 컴포넌트
│   │   └── package.json
│   ├── stream-server/     # Go RTMP→HLS (owncast 경량화)
│   └── shared/            # 공통 타입, 유틸
├── docker-compose.yml
├── turbo.json
└── package.json
```
