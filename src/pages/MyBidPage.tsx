import { useState } from 'react';
import { DESIGN_TOKENS, commonStyles } from '@/constants/design-tokens';
import Button from '@/components/ui/Button';

interface BidItem {
  id: string;
  item: string;
  status: 'Active' | 'Won' | 'Lost' | 'Pending';
  currentBid: string;
  timeLeft: string;
  image: string;
}

interface ListingItem {
  id: string;
  item: string;
  status: 'Active' | 'Sold' | 'Expired';
  currentBid: string;
  timeLeft: string;
  image: string;
}

const MyBidPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bidding' | 'listings'>('bidding');

  // 더미 데이터
  const biddingHistory: BidItem[] = [
    {
      id: '1',
      item: 'Vintage Camera',
      status: 'Active',
      currentBid: '$250',
      timeLeft: '2d 14h',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400'
    },
    {
      id: '2',
      item: 'Antique Clock',
      status: 'Won',
      currentBid: '$180',
      timeLeft: 'Ended',
      image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400'
    },
    {
      id: '3',
      item: 'Rare Coin Collection',
      status: 'Lost',
      currentBid: '$520',
      timeLeft: 'Ended',
      image: 'https://images.unsplash.com/photo-1622544221926-50c4840a1a30?w=400'
    }
  ];

  const myListings: ListingItem[] = [
    {
      id: '1',
      item: 'Designer Watch',
      status: 'Active',
      currentBid: '$420',
      timeLeft: '1d 8h',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'
    },
    {
      id: '2',
      item: 'Art Painting',
      status: 'Sold',
      currentBid: '$1,200',
      timeLeft: 'Ended',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    }
  ];

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

  const TableRow: React.FC<{ item: BidItem | ListingItem; type: 'bidding' | 'listings' }> = ({ item, type }) => (
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
          src={item.image}
          alt={item.item}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: DESIGN_TOKENS.layout.borderRadius.md,
            objectFit: 'cover'
          }}
        />
        <span style={{
          ...commonStyles.text.body,
          fontWeight: DESIGN_TOKENS.fontWeights.medium,
          fontSize: DESIGN_TOKENS.fontSizes.sm
        }}>
          {item.item}
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
        {item.currentBid}
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
              {activeTab === 'bidding' ? (
                biddingHistory.length > 0 ? (
                  biddingHistory.map((item) => (
                    <TableRow key={item.id} item={item} type="bidding" />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{
                      padding: `${DESIGN_TOKENS.spacing['4xl']} ${DESIGN_TOKENS.spacing.md}`,
                      textAlign: 'center',
                      ...commonStyles.text.secondary,
                      fontSize: DESIGN_TOKENS.fontSizes.lg
                    }}>
                      No bidding history yet
                    </td>
                  </tr>
                )
              ) : (
                myListings.length > 0 ? (
                  myListings.map((item) => (
                    <TableRow key={item.id} item={item} type="listings" />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{
                      padding: `${DESIGN_TOKENS.spacing['4xl']} ${DESIGN_TOKENS.spacing.md}`,
                      textAlign: 'center',
                      ...commonStyles.text.secondary,
                      fontSize: DESIGN_TOKENS.fontSizes.lg
                    }}>
                      No listings yet
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* 빈 상태일 때 액션 버튼 */}
        {((activeTab === 'bidding' && biddingHistory.length === 0) || 
          (activeTab === 'listings' && myListings.length === 0)) && (
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