import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/AppContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DESIGN_TOKENS, commonStyles } from "@/constants/design-tokens";
import { useNavigation } from "@/hooks/useNavigation";
import { authenticateUser } from "@/data/users";

const SignInPage: React.FC = () => {
  const [, setUser] = useUser();
  const { navigateToHome, navigateToSignUp } = useNavigation();
  
  // 이메일 로그인 상태
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = (provider: string) => {
    // 데모용 로그인 처리
    setUser({
      id: "1",
      name: "Demo User",
      email: `user@${provider.toLowerCase()}.com`,
      isAuthenticated: true,
    });
    navigateToHome();
  };

  const handleSignUp = () => {
    navigateToSignUp();
  };

  const handleSignIn = () => {
    // 기존 계정으로 로그인 로직 (현재는 데모)
    setUser({
      id: "1",
      name: "Demo User",
      email: "demo@bidhub.com",
      isAuthenticated: true,
    });
    navigateToHome();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 검증
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    }
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // 사용자 인증
      const user = authenticateUser(formData.email, formData.password);
      
      if (user) {
        setUser(user);
        navigateToHome();
      } else {
        setErrors({ general: "이메일 또는 비밀번호가 잘못되었습니다." });
      }
    } catch (error) {
      setErrors({ general: "로그인 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: DESIGN_TOKENS.colors.white,
      minHeight: '100vh',
      fontFamily: DESIGN_TOKENS.fonts.primary
    }}>
      {/* Main Content */}
      <main style={{
        ...commonStyles.container,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'stretch'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 0px',
          width: '960px',
          height: '695px'
        }}>
          {/* Title */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'stretch',
            padding: '20px 16px 12px'
          }}>
            <h2 style={{
              ...commonStyles.text.heading,
              fontSize: DESIGN_TOKENS.fontSizes['2xl'],
              lineHeight: DESIGN_TOKENS.lineHeights.tight,
              textAlign: 'center'
            }}>
              Join BidSwap
            </h2>
          </div>

          {/* Social Login Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'stretch',
            alignItems: 'stretch',
            alignSelf: 'stretch'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '12px 16px',
              width: '100%'
            }}>
              {[
                'Continue with Apple',
                'Continue with SearchEngineCo', 
                'Continue with GreenLine',
                'Continue with BrownTalk'
              ].map((text, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="medium"
                  onClick={() => handleSocialLogin(text.split(' ')[2])}
                  style={{ width: '100%' }}
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>

          {/* Or Divider */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'stretch',
            padding: `${DESIGN_TOKENS.spacing.xs} ${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`
          }}>
            <span style={{
              ...commonStyles.text.secondary,
              fontSize: DESIGN_TOKENS.fontSizes.sm,
              textAlign: 'center'
            }}>
              or
            </span>
          </div>

          {/* Email Login Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`
          }}>
            <Button
              variant="outline"
              size="medium"
              onClick={() => setShowEmailLogin(!showEmailLogin)}
              style={{ width: '450px' }}
            >
              {showEmailLogin ? 'Hide Email Login' : 'Email Login'}
            </Button>
          </div>

          {/* Email Login Form */}
          {showEmailLogin && (
            <form onSubmit={handleEmailLogin} style={{
              padding: `0 ${DESIGN_TOKENS.spacing.lg}`,
              marginBottom: DESIGN_TOKENS.spacing.lg
            }}>
              {errors.general && (
                <div style={{
                  padding: DESIGN_TOKENS.spacing.md,
                  backgroundColor: DESIGN_TOKENS.colors.errorBg,
                  border: `1px solid ${DESIGN_TOKENS.colors.errorBorder}`,
                  borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
                  marginBottom: DESIGN_TOKENS.spacing.lg,
                  color: DESIGN_TOKENS.colors.error,
                  fontSize: DESIGN_TOKENS.fontSizes.sm,
                  textAlign: 'center'
                }}>
                  {errors.general}
                </div>
              )}

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: DESIGN_TOKENS.spacing.lg,
                maxWidth: '450px',
                margin: '0 auto'
              }}>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  error={errors.email}
                  required
                />

                <Input
                  type="password"
                  id="password"
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  error={errors.password}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  disabled={isLoading}
                  loading={isLoading}
                  style={{ width: '100%' }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In with Email'}
                </Button>

                {/* Test Account Info */}
                <div style={{
                  padding: DESIGN_TOKENS.spacing.md,
                  backgroundColor: DESIGN_TOKENS.colors.light,
                  borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
                  fontSize: DESIGN_TOKENS.fontSizes.sm,
                  color: DESIGN_TOKENS.colors.secondary
                }}>
                  <div style={{ marginBottom: DESIGN_TOKENS.spacing.xs, fontWeight: DESIGN_TOKENS.fontWeights.medium }}>
                    Test Accounts:
                  </div>
                  <div>📧 minsu@test.com / password123</div>
                  <div>📧 john@test.com / password123</div>
                  <div>📧 sarah@test.com / password123</div>
                </div>
              </div>
            </form>
          )}

          {/* Sign Up Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`
          }}>
            <Button
              variant="primary"
              size="medium"
              onClick={handleSignUp}
              style={{ width: '450px' }}
            >
              Sign Up
            </Button>
          </div>

          {/* Sign In Link */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'stretch',
            padding: `${DESIGN_TOKENS.spacing.xs} ${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            onClick={handleSignIn}
            >
              <span style={{
                ...commonStyles.text.secondary,
                fontSize: DESIGN_TOKENS.fontSizes.sm,
                textAlign: 'center'
              }}>
                Already have an account? Sign in
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
