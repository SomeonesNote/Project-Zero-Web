import { useState } from "react";
import { HeaderProps } from "@/types";
import SearchBar from "./SearchBar";
import Button from "./ui/Button";
import { DESIGN_TOKENS, commonStyles } from "@/constants/design-tokens";
import { useNavigation } from "@/hooks/useNavigation";

const Header: React.FC<HeaderProps> = ({ onNavigate, currentUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigateToHome, navigateToSignIn, navigateToSearch } = useNavigation();

  const handleLogoClick = () => {
    navigateToHome();
    setIsMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  const handleSearch = (searchTerm: string) => {
    navigateToSearch(searchTerm);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={commonStyles.header} id="mainHeader">
      <div style={{
        ...commonStyles.container,
        padding: DESIGN_TOKENS.layout.headerPadding,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* 로고 섹션 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: DESIGN_TOKENS.spacing['3xl']
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: DESIGN_TOKENS.spacing.lg
          }}>
            <div style={{ width: '16px', height: '16px' }}>
              <img
                src="/images/logo.svg"
                alt="BidSwap Logo"
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                onClick={handleLogoClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleLogoClick();
                  }
                }}
              />
            </div>
            <h1
              style={{ 
                ...commonStyles.text.heading,
                fontSize: DESIGN_TOKENS.fontSizes.lg,
                lineHeight: DESIGN_TOKENS.lineHeights.tight,
                cursor: 'pointer'
              }}
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleLogoClick();
                }
              }}
            >
              BidSwap
            </h1>
          </div>
        </div>

        {/* 우측 섹션 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: DESIGN_TOKENS.spacing['3xl']
        }}>
          {/* 데스크톱 네비게이션 */}
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '36px' 
          }}>
            <button
              style={{
                ...commonStyles.text.body,
                fontWeight: DESIGN_TOKENS.fontWeights.medium,
                fontSize: DESIGN_TOKENS.fontSizes.sm,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation("/how-it-works")}
            >
              How it Works
            </button>
            <button
              style={{
                ...commonStyles.text.body,
                fontWeight: DESIGN_TOKENS.fontWeights.medium,
                fontSize: DESIGN_TOKENS.fontSizes.sm,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigation("/contact")}
            >
              Contact
            </button>
          </nav>

          {/* 사용자 액션 버튼들 */}
          <div style={{ display: 'flex', gap: DESIGN_TOKENS.spacing.sm }}>
            {currentUser ? (
              <div className="relative">
                <button
                  style={{
                    width: DESIGN_TOKENS.spacing['4xl'],
                    height: DESIGN_TOKENS.spacing['4xl'],
                    backgroundColor: DESIGN_TOKENS.colors.primary,
                    color: DESIGN_TOKENS.colors.white,
                    borderRadius: DESIGN_TOKENS.layout.borderRadius.full,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: DESIGN_TOKENS.fontWeights.semibold,
                    cursor: 'pointer',
                    transition: DESIGN_TOKENS.layout.transitions.normal,
                  }}
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: DESIGN_TOKENS.layout.borderRadius.full,
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span>{currentUser.name.charAt(0).toUpperCase()}</span>
                  )}
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="medium"
                onClick={navigateToSignIn}
                style={{ width: '84px' }}
              >
                Log In
              </Button>
            )}
          </div>

        </div>
      </div>

    </header>
  );
};

export default Header;
