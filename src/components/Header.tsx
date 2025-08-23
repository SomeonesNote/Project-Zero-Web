import { useState, useEffect, useRef } from "react";
import { HeaderProps } from "@/types";
import SearchBar from "./SearchBar";
import Button from "./ui/Button";
import { DESIGN_TOKENS, commonStyles } from "@/constants/design-tokens";
import { useNavigation } from "@/hooks/useNavigation";
import { useUser } from "@/store/AppContext";
import { useToast } from "@/store/ToastContext";

const Header: React.FC<HeaderProps> = ({ onNavigate, currentUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [, setUser] = useUser();
  const { navigateToHome, navigateToSignIn, navigateToSearch } = useNavigation();
  const { showInfo } = useToast();
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = () => {
    const userName = currentUser?.name || "사용자";
    setUser(null);
    setShowUserMenu(false);
    showInfo("로그아웃", `${userName}님, 안전하게 로그아웃되었습니다.`);
    setTimeout(() => navigateToHome(), 500);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // 외부 클릭 시 드롭다운 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
              <div
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  cursor: 'pointer',
                  backgroundColor: DESIGN_TOKENS.colors.primary,
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: DESIGN_TOKENS.colors.white,
                  fontSize: '10px',
                  fontWeight: DESIGN_TOKENS.fontWeights.bold
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
                B
              </div>
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
            {/* My Bid 버튼 (로그인된 사용자에게만 표시) */}
            {currentUser && (
              <button
                style={{
                  ...commonStyles.text.body,
                  fontWeight: DESIGN_TOKENS.fontWeights.medium,
                  fontSize: DESIGN_TOKENS.fontSizes.sm,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: DESIGN_TOKENS.colors.primary
                }}
                onClick={() => handleNavigation("/my-bids")}
              >
                My Bid
              </button>
            )}
          </nav>

          {/* 사용자 액션 버튼들 */}
          <div style={{ display: 'flex', gap: DESIGN_TOKENS.spacing.sm }}>
            {currentUser ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
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
                  onClick={toggleUserMenu}
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
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling;
                        if (nextElement) {
                          (nextElement as HTMLElement).style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <span 
                    style={{ 
                      display: currentUser.avatar ? 'none' : 'block' 
                    }}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </button>

                {/* 유저 드롭다운 메뉴 */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: DESIGN_TOKENS.spacing.xs,
                    backgroundColor: DESIGN_TOKENS.colors.white,
                    border: `1px solid ${DESIGN_TOKENS.colors.border}`,
                    borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    minWidth: '180px'
                  }}>
                    <div style={{
                      padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.lg}`,
                      borderBottom: `1px solid ${DESIGN_TOKENS.colors.border}`
                    }}>
                      <div style={{
                        fontSize: DESIGN_TOKENS.fontSizes.sm,
                        fontWeight: DESIGN_TOKENS.fontWeights.medium,
                        color: DESIGN_TOKENS.colors.dark
                      }}>
                        {currentUser.name}
                      </div>
                      <div style={{
                        fontSize: DESIGN_TOKENS.fontSizes.xs,
                        color: DESIGN_TOKENS.colors.secondary
                      }}>
                        {currentUser.email}
                      </div>
                    </div>
                    <div style={{ padding: DESIGN_TOKENS.spacing.xs }}>
                      <button
                        style={{
                          width: '100%',
                          padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.lg}`,
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: DESIGN_TOKENS.fontSizes.sm,
                          color: DESIGN_TOKENS.colors.dark,
                          borderRadius: DESIGN_TOKENS.layout.borderRadius.sm
                        }}
                        onClick={() => {
                          handleNavigation('/profile');
                          setShowUserMenu(false);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.light;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Profile
                      </button>
                      <button
                        style={{
                          width: '100%',
                          padding: `${DESIGN_TOKENS.spacing.sm} ${DESIGN_TOKENS.spacing.lg}`,
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: DESIGN_TOKENS.fontSizes.sm,
                          color: DESIGN_TOKENS.colors.error,
                          borderRadius: DESIGN_TOKENS.layout.borderRadius.sm
                        }}
                        onClick={handleLogout}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.errorBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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
