import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/AppContext";
import Button from "@/components/ui/Button";
import { DESIGN_TOKENS, commonStyles } from "@/constants/design-tokens";
import { useNavigation } from "@/hooks/useNavigation";

const SignInPage: React.FC = () => {
  const [, setUser] = useUser();
  const { navigateToHome, navigateToSignUp } = useNavigation();

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
