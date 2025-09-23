# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 요구사항 (Korean Project Requirements)

1. 방향키로 얼음 이동 - Use arrow keys for ice movement
2. 소스코드 충분한 한글로 주석 및 코드 스플릿팅 - Add sufficient Korean comments and code splitting
3. css tailwind사용 - Use Tailwind CSS
4. 쓸모없는 소스는 제거 - Remove unnecessary source code
5. readme 파일 한글로 업데이트 - Update README file in Korean

## 개발 명령어 (Development Commands)

### 기본 개발 (Basic Development)
```bash
npm install          # 의존성 설치 (Install dependencies)
npm run dev          # 개발 서버 실행 (Start development server at http://localhost:5174)
npm run build        # 프로덕션 빌드 (Production build)
npm run preview      # 빌드된 앱 미리보기 (Preview built app)
```

### 타입 체킹 및 린팅 (Type Checking and Linting)
```bash
npx tsc --noEmit     # 타입 체킹만 실행 (Type check only)
```

## 아키텍처 개요 (Architecture Overview)

### 게임 구조 (Game Structure)
이 프로젝트는 **Phaser 3** 기반의 아이스 패스 메모리 퍼즐 게임입니다.

#### 핵심 파일 구조 (Core File Structure)
- `src/main.ts` - 게임 초기화 및 DOM 설정
- `src/config/GameConfig.ts` - 게임 설정 상수들 (타일 크기, 색상, 난이도 등)
- `src/types/GameTypes.ts` - TypeScript 인터페이스 정의

#### 씬 시스템 (Scene System)
게임은 4개의 주요 씬으로 구성되어 있습니다:

1. **Preloader** (`src/scenes/Preloader.ts`)
   - 게임 에셋 로드 및 텍스처 생성
   - `SpriteGenerator`를 사용하여 동적 텍스처 생성

2. **MainMenuScene** (`src/scenes/MainMenuScene.ts`)
   - 메인 메뉴 화면

3. **GamePlayScene** (`src/scenes/GamePlayScene.ts`)
   - 메인 게임 로직
   - 그리드 생성, 경로 생성, 플레이어 이동, 게임 상태 관리

4. **GameOverScene** (`src/scenes/GameOverScene.ts`)
   - 게임 오버 및 점수 표시

#### 게임 플로우 (Game Flow)
1. 게임 시작 → 안전한 경로를 일정 시간 표시
2. 경로 숨김 → 플레이어가 기억을 바탕으로 이동
3. 잘못된 타일 밟으면 얼음이 깨지고 추락
4. 올바른 경로로 도착지 도달하면 레벨 완료

#### 핵심 게임 메커니즘 (Core Game Mechanics)
- **방향키 이동**: 상하좌우 방향키로 한 칸씩 이동
- **점프**: 스페이스바 + 방향키로 2칸 점프
- **경로 기억**: 시작 전 안전한 경로를 기억해야 함
- **난이도 증가**: 레벨이 올라갈수록 그리드 크기 증가, 경로 표시 시간 감소

### 기술 스택 (Tech Stack)
- **게임 엔진**: Phaser 3.90.0
- **언어**: TypeScript 5.8.3
- **번들러**: Vite 4.5.14
- **CSS**: Tailwind CSS 4.1.13
- **빌드 도구**: esbuild (minification), terser

### 코드 스타일 가이드라인 (Code Style Guidelines)
- 모든 주석은 한국어로 작성할 것
- TypeScript strict 모드 사용
- 코드 스플리팅: Phaser는 별도 청크로 분리됨 (`vite.config.js` 참고)
- 컴포넌트별 파일 분리 원칙

### 게임 설정 (Game Configuration)
`GAME_CONFIG` 객체에서 모든 게임 설정을 중앙 관리:
- 타일 크기, 그리드 크기, 타이밍
- 색상 테마 (겨울/크리스탈 아이스 테마)
- 난이도 증가 설정
- 파티클 효과 설정

### 상태 관리 (State Management)
- `GameState`: 레벨, 점수, 생명, 그리드 크기 등
- `PlayerState`: 플레이어 위치, 이동 상태, 방향 등
- LocalStorage를 통한 최고 점수 저장

### 텍스처 시스템 (Texture System)
`SpriteGenerator` 유틸리티를 통해 런타임에 게임 텍스처를 동적 생성:
- 펭귄 캐릭터 스프라이트 (4방향)
- 얼음 타일 텍스처
- 안전 경로 텍스처
- 깨진 얼음 텍스처