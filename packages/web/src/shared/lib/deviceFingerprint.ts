/**
 * Device Fingerprint — 브라우저/기기 고유 식별자 생성
 * 
 * navigator + screen + canvas 조합으로 지문을 만들고 SHA-256 유사 해시로 변환.
 * 같은 기기 + 같은 브라우저면 항상 같은 ID 반환.
 * 시크릿모드/다른 브라우저 → 다른 ID.
 * 
 * 추후 이 fingerprint를 백엔드 계정과 연결 가능.
 */

function simpleHash(str: string): string {
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return (h1 >>> 0).toString(36) + (h2 >>> 0).toString(36);
}

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Universe.Fingerprint.X 🛜', 2, 15);
    ctx.fillStyle = 'rgba(102,204,0,0.7)';
    ctx.fillText('Universe.Fingerprint.X 🛜', 4, 17);
    return canvas.toDataURL();
  } catch {
    return '';
  }
}

export function getDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.hardwareConcurrency ?? '',
    (navigator as unknown as Record<string, unknown>).deviceMemory ?? '',
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.platform ?? '',
    navigator.vendor ?? '',
    getCanvasFingerprint(),
  ];
  const raw = components.join('###');
  return simpleHash(raw);
}

/** 짧은 표시용 ID (앞 8글자) */
export function getShortDeviceId(): string {
  return getDeviceFingerprint().slice(0, 8).toUpperCase();
}
