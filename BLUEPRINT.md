# Universe Meeting App — 7개 오픈소스 엑기스 분석

## 🧬 소스별 추출 유전자

### 1. jigar-sable/instagram-mern
- **기술**: React + Node.js + Express + MongoDB + Socket.IO + Redux
- **핵심**: 실시간 인터랙션(좋아요/댓글/팔로우), 소켓 기반 채팅, 스토리/피드 UI 패턴
- **가져갈 것**: 실시간 소켓 아키텍처, 소셜 피드 UI 패턴, 이미지 업로드 파이프라인

### 2. MarketXpress/MarketX-backend
- **기술**: NestJS + TypeScript + PostgreSQL + Redis + Bull Queue + RabbitMQ
- **핵심**: 고동시성 트랜잭션, Escrow 에스크로, 사기 탐지 AI, 추천 엔진, WebSocket 알림
- **가져갈 것**: NestJS 모듈러 아키텍처, Redis 기반 rate limiting, Job Queue 패턴, 실시간 알림 디스패처

### 3. OtterPeer/otter-peer
- **기술**: React Native + WebRTC + Kademlia DHT + AES-256 E2EE
- **핵심**: P2P WebRTC 직접 연결, E2E 암호화 채팅, DHT 기반 라우팅, 온디바이스 AI 추천
- **가져갈 것**: WebRTC 화상회의 코어, E2E 암호화, P2P 시그널링 서버, DHT 분산 라우팅

### 4. owncast/owncast
- **기술**: Go + React + RTMP + HLS + WebSocket
- **핵심**: 셀프호스트 라이브 스트리밍, RTMP 수신 → HLS 변환, 실시간 채팅, 1인 방송
- **가져갈 것**: RTMP→HLS 스트리밍 파이프라인, 라이브 채팅 시스템, 경량 Go 서버

### 5. pixelfed/pixelfed
- **기술**: Laravel PHP + Vue.js + ActivityPub + S3
- **핵심**: 연합형 사진 공유, ActivityPub 프로토콜, S3 미디어 저장, 인스타그램 대안
- **가져갈 것**: ActivityPub 연합 프로토콜, 미디어 최적화 파이프라인, 컬렉션/앨범 구조

### 6. joinloops/loops-server
- **기술**: Node.js + Express + PostgreSQL + Redis + FFmpeg
- **핵심**: 숏폼 비디오 플랫폼, FFmpeg 트랜스코딩, 바이럴 피드 알고리즘, 업로드 파이프라인
- **가져갈 것**: FFmpeg 미디어 처리, 바이럴 알고리즘, 숏폼 UI 패턴

### 7. easychen/not-only-fans
- **기술**: PHP Laravel + React + Docker + Crypto(ETH)
- **핵심**: 구독 페이월, 암호화폐 결제, 크리에이터 멤버십, 셀프 호스트 구독 플랫폼
- **가져갈 것**: 구독/페이월 시스템, 크리에이터-팬 관계 모델, 암호화폐 결제 연동

---

## 🎯 Universe Meeting App — 핵심 설계 청사진

### 정체성
**"연합형(Federated) 실시간 미팅 + 소셜 콘텐츠 플랫폼"**
→ Zoom + Instagram + OnlyFans + Twitch 를 오픈소스로 섞은 셀프호스트 가능한 통합 커뮤니케이션 허브

### 핵심 기술 스택
| 레이어 | 선택 | 출처 |
|--------|------|------|
| **백엔드 프레임워크** | NestJS (TypeScript) | MarketX |
| **데이터베이스** | PostgreSQL + Redis | MarketX + Loops |
| **실시간 통신** | Socket.IO + WebSocket | Instagram-MERN |
| **화상회의** | WebRTC + LiveKit | OtterPeer |
| **라이브 스트리밍** | RTMP → HLS (Go 서버) | Owncast |
| **연합 프로토콜** | ActivityPub | Pixelfed |
| **미디어 처리** | FFmpeg | Loops |
| **프론트엔드** | React + Tailwind | Instagram-MERN |
| **모바일** | React Native | OtterPeer |
| **결제/구독** | Crypto(ETH) + Stripe | Not-Only-Fans + MarketX |
| **E2E 암호화** | AES-256 + RSA | OtterPeer |

### 핵심 기능 (MVP)
1. **실시간 미팅** — WebRTC 기반 화상회의 (1:1, 그룹, 웨비나)
2. **라이브 스트리밍** — RTMP 수신 → HLS 송출 + 실시간 채팅
3. **숏폼 피드** — 바이럴 알고리즘 기반 비디오 피드
4. **크리에이터 구독** — 페이월, 멤버십 티어, ETH 결제
5. **소셜 연합** — ActivityPub으로 타 인스턴스와 연동
6. **E2E 메시징** — 암호화된 1:1/그룹 채팅
7. **AI 추천** — 온디바이스 + 서버사이드 추천 엔진

### 결제 모듈 (225 Main 서버 `/opt/onlyfans-service` 재활용)
기존 NestJS + Stripe + Prisma + PeerTube 연동 모듈:
- **Stripe 구독**: `POST /api/v1/payments/subscribe/:creatorId`
- **Stripe 팁**: `POST /api/v1/payments/tip/:creatorId`
- **Stripe Webhook**: `POST /api/v1/payments/webhook`
- **구독 관리**: `GET /api/v1/payments/my-subscriptions`, `POST cancel/:id`
- **접근 제어**: `GET /api/v1/payments/check-access/:videoId`
- **DB**: User, Creator, Subscription, Post, Tip, Like (Prisma + PostgreSQL)

→ Universe Meeting App은 이 결제 API를 내부 프록시로 호출 (Tailscale)

### 서비스 아키텍처
```
┌─────────────────────────────────────────────────────┐
│              React Frontend                         │
│  (Meeting UI + Feed + Profile + Streaming)          │
└──────────────────┬──────────────────────────────────┘
                   │ Socket.IO + REST
┌──────────────────▼──────────────────────────────────┐
│           NestJS API Gateway (110 서버)              │
│  ┌──────────┬──────────┬──────────┬──────────────┐ │
│  │  Auth    │  Queue   │  Rate    │  Payment     │ │
│  │  (JWT)   │  (Bull)  │  Limiter │  Proxy ──────┼─┼──► 225 Main:4000
│  └──────────┴──────────┴──────────┴──────────────┘ │   │  Stripe +
└──────┬──────────┬──────────┬────────────────────────┘   │  PeerTube
       │          │          │
┌──────▼──┐ ┌─────▼────┐ ┌──▼──────────────┐
│ WebRTC  │ │  RTMP/HLS│ │ ActivityPub     │
│ (LiveKit│ │  (Go     │ │ (Federation)    │
│  SFU)   │ │  Server) │ │                 │
└─────────┘ └──────────┘ └─────────────────┘
       │          │          │
┌──────▼──────────▼──────────▼────────────────┐   ┌─────────────────────┐
│         PostgreSQL + Redis + S3 (110)       │   │ 225 Main (결제)      │
└─────────────────────────────────────────────┘   │ NestJS + Stripe      │
                                                  │ Port 4000            │
                                                  └─────────────────────┘
```
