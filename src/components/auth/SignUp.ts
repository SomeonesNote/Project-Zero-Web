export class SignUp {
  constructor() {
    // Initialize component
  }

  render(): string {
    return `
      <div class="signup-container">
        <!-- Header Section -->
        <div class="signup-header">
          <div class="header-content">
            <div class="logo-section">
              <div class="logo-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L16 8L8 16L0 8L8 0Z" fill="#121417"/>
                </svg>
              </div>
              <h1 class="logo-text">BidSwap</h1>
            </div>
            
            <nav class="nav-menu">
              <a href="#" class="nav-item">Home</a>
              <a href="#" class="nav-item">Categories</a>
              <a href="#" class="nav-item">Auctions</a>
              <a href="#" class="nav-item">Exchange</a>
              <a href="#" class="nav-item">Community</a>
            </nav>
            
            <div class="auth-buttons">
              <button class="login-btn">Login</button>
              <div class="user-menu">
                <div class="user-avatar"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="signup-main">
          <div class="signup-form-container">
            <div class="form-header">
              <h2 class="form-title">Join BidSwap</h2>
            </div>
            
            <div class="signup-options">
              <button class="social-btn apple-btn">
                <span>Continue with Apple</span>
              </button>
              
              <button class="social-btn google-btn">
                <span>Continue with SearchEngineCo</span>
              </button>
              
              <button class="social-btn greenline-btn">
                <span>Continue with GreenLine</span>
              </button>
              
              <button class="social-btn browntalk-btn">
                <span>Continue with BrownTalk</span>
              </button>
            </div>
            
            <div class="divider">
              <span class="divider-text">or</span>
            </div>
            
            <div class="primary-signup">
              <button class="signup-btn" id="signupBtn">Sign Up</button>
            </div>
            
            <div class="signin-link">
              <span>Already have an account? <a href="#" id="signinLink">Sign in</a></span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  mount(): void {
    this.bindEvents();
  }

  private bindEvents(): void {
    const signupBtn = document.getElementById("signupBtn");
    const signinLink = document.getElementById("signinLink");

    signupBtn?.addEventListener("click", () => {
      // Handle signup button click
      console.log("Sign up clicked");
    });

    signinLink?.addEventListener("click", (e) => {
      e.preventDefault();
      // Navigate back to login
      window.dispatchEvent(new CustomEvent("navigate", { detail: { page: "login" } }));
    });

    // Handle social login buttons
    const socialButtons = document.querySelectorAll(".social-btn");
    socialButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const provider = btn.className.includes("apple") ? "Apple" :
                        btn.className.includes("google") ? "Google" :
                        btn.className.includes("greenline") ? "GreenLine" : "BrownTalk";
        console.log(`Continue with ${provider} clicked`);
      });
    });
  }
}