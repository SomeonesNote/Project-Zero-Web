import { EventBusInterface, EventCallback } from '../types';

export class EventBus implements EventBusInterface {
  private events: Record<string, EventCallback[]>;

  constructor() {
    this.events = {};
  }

  on<T>(event: string, callback: EventCallback<T>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off<T>(event: string, callback: EventCallback<T>): void {
    if (!this.events[event]) return;
    
    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  emit<T>(event: string, data: T): void {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`이벤트 처리 중 오류 발생 (${event}):`, error);
      }
    });
  }

  clear(): void {
    this.events = {};
  }

  // 특정 이벤트의 리스너 수 반환
  getListenerCount(event: string): number {
    return this.events[event] ? this.events[event].length : 0;
  }

  // 모든 이벤트 목록 반환
  getEventNames(): string[] {
    return Object.keys(this.events);
  }

  // 특정 이벤트가 존재하는지 확인
  hasEvent(event: string): boolean {
    return event in this.events && this.events[event].length > 0;
  }

  // 특정 이벤트의 모든 리스너 제거
  removeAllListeners(event: string): void {
    if (this.events[event]) {
      delete this.events[event];
    }
  }

  // 이벤트 버스 상태 정보 반환
  getStats(): { totalEvents: number; totalListeners: number } {
    const totalEvents = Object.keys(this.events).length;
    const totalListeners = Object.values(this.events).reduce((sum, listeners) => sum + listeners.length, 0);
    
    return { totalEvents, totalListeners };
  }
}

// 전역 이벤트 버스 인스턴스
export const globalEventBus = new EventBus();
