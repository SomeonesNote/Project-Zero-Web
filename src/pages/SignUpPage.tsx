import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@/store/AppContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DESIGN_TOKENS, commonStyles } from "@/constants/design-tokens";
import { useNavigation } from "@/hooks/useNavigation";

const SignUpPage: React.FC = () => {
  const [user, setUser] = useUser();
  const { navigateToHome } = useNavigation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 에러 클리어
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "이름을 입력해주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "약관에 동의해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 회원가입 API 호출 (데모)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 사용자 정보 설정
      const newUser = {
        id: Date.now().toString(),
        name: formData.fullName,
        email: formData.email,
        isAuthenticated: true,
      };

      setUser(newUser);
      navigateToHome();
    } catch (error) {
      setErrors({ general: "회원가입 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    alert(`${provider} 회원가입 기능은 준비 중입니다.`);
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
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px 0px',
          width: '960px'
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
              Create your account
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {errors.general && (
              <div style={{
                padding: '12px',
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                marginBottom: '16px',
                color: '#DC2626',
                fontSize: '14px'
              }}>
                {errors.general}
              </div>
            )}

            {/* Full Name */}
            <div style={{
              display: 'flex',
              justifyContent: 'stretch',
              alignItems: 'stretch',
              flexWrap: 'wrap',
              gap: DESIGN_TOKENS.spacing.lg,
              padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`
            }}>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={isLoading}
                error={errors.fullName}
                required
              />
            </div>

            {/* Email Address */}
            <div style={{
              display: 'flex',
              justifyContent: 'stretch',
              alignItems: 'stretch',
              flexWrap: 'wrap',
              gap: DESIGN_TOKENS.spacing.lg,
              padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`
            }}>
              <Input
                type="email"
                id="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                disabled={isLoading}
                error={errors.email}
                required
              />
            </div>

            {/* Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'stretch',
              alignItems: 'stretch',
              flexWrap: 'wrap',
              gap: DESIGN_TOKENS.spacing.lg,
              padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`
            }}>
              <Input
                type="password"
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                disabled={isLoading}
                error={errors.password}
                required
              />
            </div>

            {/* Confirm Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'stretch',
              alignItems: 'stretch',
              flexWrap: 'wrap',
              gap: DESIGN_TOKENS.spacing.lg,
              padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`
            }}>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                disabled={isLoading}
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'stretch',
              alignItems: 'stretch',
              padding: '0px 16px',
              width: '480px',
              margin: '0 auto'
            }}>
              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                gap: '12px',
                padding: '12px 0px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '20px',
                  height: '20px',
                  border: '2px solid #DBE0E5',
                  borderRadius: '4px',
                  backgroundColor: formData.agreeToTerms ? '#268CF5' : 'transparent',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                >
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                  {formData.agreeToTerms && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <span style={{
                    fontFamily: 'Work Sans',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#121417'
                  }}>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </div>
              </div>
              {errors.agreeToTerms && (
                <span style={{
                  fontSize: '12px',
                  color: '#DC2626',
                  marginTop: '4px'
                }}>
                  {errors.agreeToTerms}
                </span>
              )}
            </div>

            {/* Sign Up Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'stretch',
              alignItems: 'stretch',
              alignSelf: 'stretch',
              padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.lg}`
            }}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={isLoading}
                loading={isLoading}
                style={{ width: '100%' }}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
