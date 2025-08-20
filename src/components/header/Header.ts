import { Component } from '../../types';

export class Header implements Component {
  private container: HTMLElement;

  constructor() {
    this.container = document.querySelector('.header') as HTMLElement;
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    // 네비게이션 링크 이벤트
    const navLinks = this.container.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });

    // 로그인/회원가입 버튼 이벤트
    const loginBtn = this.container.querySelector('.btn-login');
    const signupBtn = this.container.querySelector('.btn-signup');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', this.handleLogin.bind(this));
    }
    
    if (signupBtn) {
      signupBtn.addEventListener('click', this.handleSignup.bind(this));
    }

    // 헤더 검색 이벤트
    const searchInput = this.container.querySelector('.search-input') as HTMLInputElement;
    const searchBtn = this.container.querySelector('.search-btn');
    
    if (searchInput) {
      searchInput.addEventListener('input', this.handleSearchInput.bind(this));
      searchInput.addEventListener('keypress', this.handleSearchKeypress.bind(this));
    }
    
    if (searchBtn) {
      searchBtn.addEventListener('click', this.handleSearchSubmit.bind(this));
    }

    // 스크롤 이벤트
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleNavClick(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLAnchorElement;
    const text = target.textContent || '';
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('navigation', {
      detail: { text, href: target.href }
    });
    document.dispatchEvent(event);
  }

  private handleLogin(): void {
    // 커스텀 이벤트 발생
    const event = new CustomEvent('login');
    document.dispatchEvent(event);
  }

  private handleSignup(): void {
    // 커스텀 이벤트 발생
    const event = new CustomEvent('signup');
    document.dispatchEvent(event);
  }

  private handleSearchInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const term = target.value;
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('headerSearch', {
      detail: { term }
    });
    document.dispatchEvent(event);
  }

  private handleSearchKeypress(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.handleSearchSubmit();
    }
  }

  private handleSearchSubmit(): void {
    const searchInput = this.container.querySelector('.search-input') as HTMLInputElement;
    const term = searchInput.value;
    
    // 커스텀 이벤트 발생
    const event = new CustomEvent('headerSearchSubmit', {
      detail: { term }
    });
    document.dispatchEvent(event);
  }

  private handleScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      this.container.classList.add('scrolled');
    } else {
      this.container.classList.remove('scrolled');
    }
  }

  render(): void {
    // 헤더는 이미 HTML에 존재하므로 추가 렌더링 불필요
  }

  destroy(): void {
    // 이벤트 리스너 정리
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
}
