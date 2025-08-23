import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DESIGN_TOKENS, commonStyles } from '@/constants/design-tokens';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchUserBids, fetchUserListings } from '@/services/apiService';
import { useUser } from '@/store/AppContext';
import { useToast } from '@/store/ToastContext';

interface BidItem {
  id: string;
  itemId: string;
  itemName: string;
  status: 'Active' | 'Won' | 'Lost' | 'Pending';
  bidAmount: number;
  currentBid: number;
  timeLeft: string;
  itemImage: string;
  createdAt: string;
}

interface ListingItem {
  id: string;
  itemName: string;
  status: 'Active' | 'Sold' | 'Expired';
  currentBid: number;
  timeLeft: string;
  itemImage: string;
  createdAt: string;
  bidsCount: number;
}

const MyBidPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bidding' | 'listings'>('bidding');
  const [user] = useUser();
  const { showError } = useToast();

  // API를 통한 데이터 페칭
  const {
    data: userBids = [],
    isLoading: bidsLoading,
    error: bidsError
  } = useQuery({
    queryKey: ['user-bids', user?.id],
    queryFn: fetchUserBids,
    enabled: !!user?.id && activeTab === 'bidding',
    onError: (error) => {
      console.error('입찰 내역 로딩 실패:', error);
      showError('오류', '입찰 내역을 불러오는데 실패했습니다.');
    }
  });

  const {
    data: userListings = [],
    isLoading: listingsLoading,
    error: listingsError
  } = useQuery({
    queryKey: ['user-listings', user?.id],
    queryFn: fetchUserListings,
    enabled: !!user?.id && activeTab === 'listings',
    onError: (error) => {
      console.error('등록 상품 로딩 실패:', error);
      showError('오류', '등록 상품을 불러오는데 실패했습니다.');
    }
  });

  const isLoading = activeTab === 'bidding' ? bidsLoading : listingsLoading;
  const currentData = activeTab === 'bidding' ? userBids : userListings;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return DESIGN_TOKENS.colors.success;
      case 'Won':
      case 'Sold':
        return DESIGN_TOKENS.colors.primary;
      case 'Lost':
      case 'Expired':
        return DESIGN_TOKENS.colors.error;
      default:
        return DESIGN_TOKENS.colors.secondary;
    }
  };

  const TableRow: React.FC<{ item: any; type: 'bidding' | 'listings' }> = ({ item, type }) => (
    <tr style={{
      borderBottom: `1px solid ${DESIGN_TOKENS.colors.border}`,
    }}>
      <td style={{
        padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
        display: 'flex',
        alignItems: 'center',
        gap: DESIGN_TOKENS.spacing.md
      }}>
        <img
          src={item.itemImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxOEgyOFYyNkgyMFYxOFoiIGZpbGw9IiM5QjlDQTAiLz4KPHA2aCBkPSJNMjQgMjJMMjEgMjVIMjdMMjQgMjJaIiBmaWxsPSIjNjg3MDc2Ii8+Cjx0ZXh0IHg9IjI0IiB5PSIzNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY4NzA3NiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='}
          alt={item.itemName}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxOEgyOFYyNkgyMFYxOFoiIGZpbGw9IiM5QjlDQTAiLz4KPHBhdGggZD0iTTI0IDIyTDIxIDI1SDI3TDI0IDIyWiIgZmlsbD0iIzY4NzA3NiIvPgo8dGV4dCB4PSIyNCIgeT0iMzQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2ODcwNzYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4Ij5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4=';
          }}
        />
        <span style={{
          ...commonStyles.text.body,
          fontWeight: DESIGN_TOKENS.fontWeights.medium,
          fontSize: DESIGN_TOKENS.fontSizes.sm
        }}>
          {item.itemName}
        </span>
      </td>
      <td style={{
        padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
        textAlign: 'center'
      }}>
        <span style={{
          padding: `${DESIGN_TOKENS.spacing.xs} ${DESIGN_TOKENS.spacing.sm}`,
          borderRadius: DESIGN_TOKENS.layout.borderRadius.full,
          backgroundColor: `${getStatusColor(item.status)}20`,
          color: getStatusColor(item.status),
          fontSize: DESIGN_TOKENS.fontSizes.xs,
          fontWeight: DESIGN_TOKENS.fontWeights.medium
        }}>
          {item.status}
        </span>
      </td>
      <td style={{
        padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
        textAlign: 'center',
        ...commonStyles.text.body,
        fontWeight: DESIGN_TOKENS.fontWeights.semibold,
        fontSize: DESIGN_TOKENS.fontSizes.sm
      }}>
        ${(item.currentBid || 0).toLocaleString()}
      </td>
      <td style={{
        padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
        textAlign: 'center',
        ...commonStyles.text.secondary,
        fontSize: DESIGN_TOKENS.fontSizes.sm
      }}>
        {item.timeLeft}
      </td>
      <td style={{
        padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
        textAlign: 'center'
      }}>
        {item.status === 'Active' && (
          <Button
            variant="outline"
            size="small"
            onClick={() => {}}
          >
            {type === 'bidding' ? 'View' : 'Edit'}
          </Button>
        )}
      </td>
    </tr>
  );

  // 사용자 인증이 필요한 페이지
  if (!user) {
    return (
      <div style={{
        backgroundColor: DESIGN_TOKENS.colors.white,
        minHeight: '100vh',
        fontFamily: DESIGN_TOKENS.fonts.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          padding: DESIGN_TOKENS.spacing['4xl'],
          backgroundColor: DESIGN_TOKENS.colors.light,
          borderRadius: DESIGN_TOKENS.layout.borderRadius.lg,
          maxWidth: '400px'
        }}>
          <h2 style={{
            ...commonStyles.text.heading,
            fontSize: DESIGN_TOKENS.fontSizes['2xl'],
            marginBottom: DESIGN_TOKENS.spacing.lg
          }}>
            로그인이 필요합니다
          </h2>
          <p style={{
            ...commonStyles.text.secondary,
            marginBottom: DESIGN_TOKENS.spacing.xl
          }}>
            입찰 내역과 등록 상품을 보려면 로그인해주세요.
          </p>
          <Button
            variant="primary"
            size="medium"
            onClick={() => window.location.href = '/signin'}
          >
            로그인하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: DESIGN_TOKENS.colors.white,
      minHeight: '100vh',
      fontFamily: DESIGN_TOKENS.fonts.primary
    }}>
      <main style={{
        ...commonStyles.container,
        padding: `${DESIGN_TOKENS.spacing['4xl']} ${DESIGN_TOKENS.spacing.lg}`,
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 페이지 타이틀 */}
        <div style={{
          marginBottom: DESIGN_TOKENS.spacing['4xl']
        }}>
          <h1 style={{
            ...commonStyles.text.heading,
            fontSize: DESIGN_TOKENS.fontSizes['3xl'],
            lineHeight: DESIGN_TOKENS.lineHeights.tight,
            marginBottom: DESIGN_TOKENS.spacing.sm
          }}>
            My Activity
          </h1>
          <p style={{
            ...commonStyles.text.secondary,
            fontSize: DESIGN_TOKENS.fontSizes.lg
          }}>
            Track your bidding activity and manage your listings
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div style={{
          borderBottom: `1px solid ${DESIGN_TOKENS.colors.border}`,
          marginBottom: DESIGN_TOKENS.spacing['4xl']
        }}>
          <div style={{
            display: 'flex',
            gap: DESIGN_TOKENS.spacing['3xl']
          }}>
            <button
              style={{
                padding: `${DESIGN_TOKENS.spacing.lg} 0`,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: DESIGN_TOKENS.fontSizes.lg,
                fontWeight: DESIGN_TOKENS.fontWeights.medium,
                color: activeTab === 'bidding' ? DESIGN_TOKENS.colors.primary : DESIGN_TOKENS.colors.secondary,
                borderBottom: activeTab === 'bidding' ? `2px solid ${DESIGN_TOKENS.colors.primary}` : '2px solid transparent',
                transition: DESIGN_TOKENS.layout.transitions.normal
              }}
              onClick={() => setActiveTab('bidding')}
            >
              Bidding History
            </button>
            <button
              style={{
                padding: `${DESIGN_TOKENS.spacing.lg} 0`,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: DESIGN_TOKENS.fontSizes.lg,
                fontWeight: DESIGN_TOKENS.fontWeights.medium,
                color: activeTab === 'listings' ? DESIGN_TOKENS.colors.primary : DESIGN_TOKENS.colors.secondary,
                borderBottom: activeTab === 'listings' ? `2px solid ${DESIGN_TOKENS.colors.primary}` : '2px solid transparent',
                transition: DESIGN_TOKENS.layout.transitions.normal
              }}
              onClick={() => setActiveTab('listings')}
            >
              My Listings
            </button>
          </div>
        </div>

        {/* 테이블 컨텐츠 */}
        <div style={{
          backgroundColor: DESIGN_TOKENS.colors.white,
          border: `1px solid ${DESIGN_TOKENS.colors.border}`,
          borderRadius: DESIGN_TOKENS.layout.borderRadius.lg,
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead style={{
              backgroundColor: DESIGN_TOKENS.colors.light
            }}>
              <tr>
                <th style={{
                  padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
                  textAlign: 'left',
                  ...commonStyles.text.body,
                  fontWeight: DESIGN_TOKENS.fontWeights.semibold,
                  fontSize: DESIGN_TOKENS.fontSizes.sm,
                  color: DESIGN_TOKENS.colors.dark
                }}>
                  Item
                </th>
                <th style={{
                  padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
                  textAlign: 'center',
                  ...commonStyles.text.body,
                  fontWeight: DESIGN_TOKENS.fontWeights.semibold,
                  fontSize: DESIGN_TOKENS.fontSizes.sm,
                  color: DESIGN_TOKENS.colors.dark
                }}>
                  Status
                </th>
                <th style={{
                  padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
                  textAlign: 'center',
                  ...commonStyles.text.body,
                  fontWeight: DESIGN_TOKENS.fontWeights.semibold,
                  fontSize: DESIGN_TOKENS.fontSizes.sm,
                  color: DESIGN_TOKENS.colors.dark
                }}>
                  Current Bid
                </th>
                <th style={{
                  padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
                  textAlign: 'center',
                  ...commonStyles.text.body,
                  fontWeight: DESIGN_TOKENS.fontWeights.semibold,
                  fontSize: DESIGN_TOKENS.fontSizes.sm,
                  color: DESIGN_TOKENS.colors.dark
                }}>
                  Time Left
                </th>
                <th style={{
                  padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
                  textAlign: 'center',
                  ...commonStyles.text.body,
                  fontWeight: DESIGN_TOKENS.fontWeights.semibold,
                  fontSize: DESIGN_TOKENS.fontSizes.sm,
                  color: DESIGN_TOKENS.colors.dark
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{
                    padding: `${DESIGN_TOKENS.spacing['4xl']} ${DESIGN_TOKENS.spacing.md}`,
                    textAlign: 'center'
                  }}>
                    <LoadingSpinner size="medium" text="데이터를 불러오는 중..." />
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item: any) => (
                  <TableRow key={item.id} item={item} type={activeTab} />
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{
                    padding: `${DESIGN_TOKENS.spacing['4xl']} ${DESIGN_TOKENS.spacing.md}`,
                    textAlign: 'center',
                    ...commonStyles.text.secondary,
                    fontSize: DESIGN_TOKENS.fontSizes.lg
                  }}>
                    {activeTab === 'bidding' ? 'No bidding history yet' : 'No listings yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 빈 상태일 때 액션 버튼 */}
        {!isLoading && currentData.length === 0 && (
          <div style={{
            textAlign: 'center',
            marginTop: DESIGN_TOKENS.spacing['3xl']
          }}>
            <Button
              variant="primary"
              size="medium"
              onClick={() => {}}
            >
              {activeTab === 'bidding' ? 'Start Bidding' : 'Create Listing'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBidPage;