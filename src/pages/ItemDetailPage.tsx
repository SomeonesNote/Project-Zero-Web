import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useItemDetail } from "@/hooks/useItems";
import LoadingSpinner from "@/components/LoadingSpinner";

const ItemDetailPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [bidAmount, setBidAmount] = useState("");
  const [isTradeMode, setIsTradeMode] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [tradeDescription, setTradeDescription] = useState("");
  const [tradeValue, setTradeValue] = useState("");
  const [tradePhoto, setTradePhoto] = useState<File | null>(null);

  const { data: item, isLoading, error } = useItemDetail(itemId!);

  // URL에 action=bid가 있으면 입찰 모달 표시
  useEffect(() => {
    if (searchParams.get("action") === "bid") {
      setShowBidModal(true);
    }
  }, [searchParams]);

  // 카운트다운 타이머
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 2, hours: 14, minutes: 30, seconds: 15 });

  useEffect(() => {
    if (!item) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(item.endTime || Date.now() + 24 * 60 * 60 * 1000).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [item]);

  const handleBidSubmit = () => {
    if (!bidAmount || !item) return;

    const amount = parseFloat(bidAmount);
    if (amount <= (item.currentBid || item.price || 450)) {
      alert("입찰가는 현재 최고가보다 높아야 합니다.");
      return;
    }

    // 여기서 실제 입찰 API 호출
    alert(`$${amount.toLocaleString()} 입찰이 제출되었습니다! (데모)`);
    setShowBidModal(false);
    setBidAmount("");
  };

  const handleTradeOffer = () => {
    if (!tradeDescription || !tradeValue) {
      alert("물품 설명과 예상 가치를 모두 입력해주세요.");
      return;
    }
    
    alert(`물물교환 제안이 제출되었습니다! (데모)\n물품: ${tradeDescription}\n예상 가치: $${tradeValue}`);
    setTradeDescription("");
    setTradeValue("");
    setTradePhoto(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTradePhoto(file);
    }
  };

  const isAuctionEnded = () => {
    return (
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    );
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner size="large" text="상품 정보를 불러오는 중..." />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>상품을 찾을 수 없습니다</h2>
          <p>요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
          <button onClick={() => navigate("/")}>메인으로 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: 'Work Sans, sans-serif'
    }}>
      {/* Main Content */}
      <main style={{ 
        width: '1280px',
        margin: '0 auto',
        padding: '20px 160px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}>

          {/* Title Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '288px'
            }}>
              <h2 style={{
                fontFamily: 'Work Sans',
                fontWeight: 700,
                fontSize: '32px',
                lineHeight: '40px',
                color: '#121417',
                margin: 0
              }}>
                Auction Item
              </h2>
            </div>
          </div>

          {/* Product Image Section */}
          <div style={{
            display: 'flex',
            alignSelf: 'stretch',
            padding: '16px'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              width: '100%'
            }}>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                height: '619px',
                flex: 1,
                overflow: 'hidden'
              }}>
                <img 
                  src={item.image || item.imageUrl || (item.images && item.images[0]) || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5QjlDQTAiLz4KPHBhdGggZD0iTTIwMCAxNTBMMTg1IDE2NUgyMTVMMjAwIDE1MFoiIGZpbGw9IiM2ODcwNzYiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY4NzA3NiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4='} 
                  alt={item.title || item.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDIyNVYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5QjlDQTAiLz4KPHBhdGggZD0iTTIwMCAxNTBMMTg1IDE2NUgyMTVMMjAwIDE1MFoiIGZpbGw9IiM2ODcwNzYiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY4NzA3NiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4=';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Title */}
          <div style={{
            display: 'flex',
            alignSelf: 'stretch',
            padding: '20px 16px 12px'
          }}>
            <h3 style={{
              fontFamily: 'Work Sans',
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: '28px',
              color: '#121417',
              margin: 0
            }}>
              {item.title || item.name || 'Vintage Chronograph Watch'}
            </h3>
          </div>

          {/* Product Description */}
          <div style={{
            display: 'flex',
            alignSelf: 'stretch',
            padding: '4px 16px 12px'
          }}>
            <p style={{
              fontFamily: 'Work Sans',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#121417',
              margin: 0
            }}>
              {item.description || 'A rare vintage chronograph watch in excellent condition. Features a stainless steel case, original band, and all functions working perfectly. A collector\'s dream.'}
            </p>
          </div>

          {/* Bid Type Toggle */}
          <div style={{
            display: 'flex',
            alignSelf: 'stretch',
            padding: '12px 16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '4px',
              width: '100%',
              height: '40px',
              backgroundColor: '#F0F2F5',
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'stretch',
                padding: '0px 8px',
                width: '466px',
                backgroundColor: !isTradeMode ? '#FFFFFF' : 'transparent',
                borderRadius: '8px',
                boxShadow: !isTradeMode ? '0px 0px 4px 0px rgba(0, 0, 0, 0.1)' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setIsTradeMode(false)}
              >
                <span style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: '#121417'
                }}>
                  Monetary Bid
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'stretch',
                padding: '0px 8px',
                width: '454px',
                backgroundColor: isTradeMode ? '#FFFFFF' : 'transparent',
                borderRadius: '8px',
                boxShadow: isTradeMode ? '0px 0px 4px 0px rgba(0, 0, 0, 0.1)' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setIsTradeMode(true)}
              >
                <span style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '21px',
                  color: isTradeMode ? '#121417' : '#61758A'
                }}>
                  Trade Offer
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Content Based on Toggle */}
          {!isTradeMode ? (
            // Monetary Bid Mode
            <>
              {/* Current Bid */}
              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '16px 16px 8px'
              }}>
                <span style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '23px',
                  color: '#121417',
                  margin: 0
                }}>
                  Current Bid
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '20px 16px 12px'
              }}>
                <span style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 700,
                  fontSize: '22px',
                  lineHeight: '28px',
                  color: '#121417',
                  margin: 0
                }}>
                  ${(item.currentBid || item.price || 450).toLocaleString()}
                </span>
              </div>

              {/* Bid History */}
              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '16px 16px 8px'
              }}>
                <span style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '23px',
                  color: '#121417',
                  margin: 0
                }}>
                  Bid History
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '12px 16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignSelf: 'stretch',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DBE0E5',
                  borderRadius: '8px',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: 'stretch',
                    width: '100%'
                  }}>
                    {/* Table Header */}
                    <div style={{
                      display: 'flex',
                      alignSelf: 'stretch',
                      backgroundColor: '#FFFFFF'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignSelf: 'stretch',
                        padding: '12px 16px',
                        width: '33.33%'
                      }}>
                        <span style={{
                          fontFamily: 'Work Sans',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '21px',
                          color: '#121417'
                        }}>
                          Bidder
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignSelf: 'stretch',
                        padding: '12px 16px',
                        width: '33.33%'
                      }}>
                        <span style={{
                          fontFamily: 'Work Sans',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '21px',
                          color: '#121417'
                        }}>
                          Amount
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignSelf: 'stretch',
                        padding: '12px 16px',
                        width: '33.33%'
                      }}>
                        <span style={{
                          fontFamily: 'Work Sans',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '21px',
                          color: '#121417'
                        }}>
                          Time
                        </span>
                      </div>
                    </div>
                    
                    {/* Table Rows */}
                    {[
                      { bidder: 'Ethan Walker', amount: '$400', time: '2 hours ago' },
                      { bidder: 'Sophia Bennett', amount: '$350', time: '3 hours ago' },
                      { bidder: 'Liam Carter', amount: '$300', time: '4 hours ago' }
                    ].map((bid, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignSelf: 'stretch',
                        borderTop: '1px solid #E5E8EB'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '8px 16px',
                          width: '33.33%',
                          height: '72px'
                        }}>
                          <span style={{
                            fontFamily: 'Work Sans',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '21px',
                            color: '#121417'
                          }}>
                            {bid.bidder}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '8px 16px',
                          width: '33.33%',
                          height: '72px'
                        }}>
                          <span style={{
                            fontFamily: 'Work Sans',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '21px',
                            color: '#61758A'
                          }}>
                            {bid.amount}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '8px 16px',
                          width: '33.33%',
                          height: '72px'
                        }}>
                          <span style={{
                            fontFamily: 'Work Sans',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '21px',
                            color: '#61758A'
                          }}>
                            {bid.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Remaining */}
              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '16px 16px 8px'
              }}>
                <span style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '23px',
                  color: '#121417',
                  margin: 0
                }}>
                  Time Remaining
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                gap: '16px',
                padding: '24px 16px'
              }}>
                {[
                  { value: timeLeft.days.toString().padStart(2, '0'), label: 'Days' },
                  { value: timeLeft.hours.toString().padStart(2, '0'), label: 'Hours' },
                  { value: timeLeft.minutes.toString().padStart(2, '0'), label: 'Minutes' },
                  { value: timeLeft.seconds.toString().padStart(2, '0'), label: 'Seconds' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    flex: 1
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '0px 12px',
                      height: '56px',
                      backgroundColor: '#F0F2F5',
                      borderRadius: '8px'
                    }}>
                      <span style={{
                        fontFamily: 'Work Sans',
                        fontWeight: 700,
                        fontSize: '18px',
                        lineHeight: '23px',
                        color: '#121417'
                      }}>
                        {item.value}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontFamily: 'Work Sans',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '21px',
                        color: '#121417'
                      }}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bid Form */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '12px 16px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignSelf: 'stretch',
                    padding: '0px 0px 8px'
                  }}>
                    <span style={{
                      fontFamily: 'Work Sans',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#121417'
                    }}>
                      Your Bid
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    padding: '15px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DBE0E5',
                    borderRadius: '8px'
                  }}>
                    <input
                      type="text"
                      placeholder="Enter your bid"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontFamily: 'Work Sans',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#61758A'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Place Bid Button */}
              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '12px 16px'
              }}>
                <button style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0px 16px',
                  height: '40px',
                  backgroundColor: '#268CF5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: 'none'
                }}
                onClick={() => setShowBidModal(true)}
                >
                  <span style={{
                    fontFamily: 'Work Sans',
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '21px',
                    textAlign: 'center',
                    color: '#FFFFFF'
                  }}>
                    Place Bid
                  </span>
                </button>
              </div>
            </>
          ) : (
            // Trade Offer Mode
            <>
              {/* Your Trade Offer */}
              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '16px 16px 8px'
              }}>
                <span style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '23px',
                  color: '#121417',
                  margin: 0
                }}>
                  Your Trade Offer
                </span>
              </div>

              {/* Item Description */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '12px 16px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignSelf: 'stretch',
                    padding: '0px 0px 8px'
                  }}>
                    <span style={{
                      fontFamily: 'Work Sans',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#121417'
                    }}>
                      Item Description
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    padding: '15px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DBE0E5',
                    borderRadius: '8px'
                  }}>
                    <input
                      type="text"
                      placeholder="Describe the item you are offering"
                      value={tradeDescription}
                      onChange={(e) => setTradeDescription(e.target.value)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontFamily: 'Work Sans',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#61758A'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Estimated Value */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '12px 16px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignSelf: 'stretch',
                    padding: '0px 0px 8px'
                  }}>
                    <span style={{
                      fontFamily: 'Work Sans',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: '#121417'
                    }}>
                      Estimated Value
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    padding: '15px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #DBE0E5',
                    borderRadius: '8px'
                  }}>
                    <input
                      type="text"
                      placeholder="Enter the estimated value of your item"
                      value={tradeValue}
                      onChange={(e) => setTradeValue(e.target.value)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontFamily: 'Work Sans',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#61758A'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Upload Item Photo */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'stretch',
                padding: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  gap: '24px',
                  padding: '56px 24px',
                  backgroundColor: '#FFFFFF',
                  border: '2px dashed #DBE0E5',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontFamily: 'Work Sans',
                        fontWeight: 700,
                        fontSize: '18px',
                        lineHeight: '23px',
                        textAlign: 'center',
                        color: '#121417'
                      }}>
                        Upload Item Photo
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontFamily: 'Work Sans',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '21px',
                        textAlign: 'center',
                        color: '#121417'
                      }}>
                        {tradePhoto ? tradePhoto.name : 'Drag and drop or click to upload'}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px 16px',
                    width: '84px',
                    height: '40px',
                    backgroundColor: '#F0F2F5',
                    borderRadius: '8px'
                  }}>
                    <label style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}>
                      <span style={{
                        fontFamily: 'Work Sans',
                        fontWeight: 700,
                        fontSize: '14px',
                        lineHeight: '21px',
                        textAlign: 'center',
                        color: '#121417'
                      }}>
                        Upload
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Trade Offer Button */}
              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '12px 16px'
              }}>
                <button style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0px 16px',
                  height: '40px',
                  backgroundColor: '#268CF5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: 'none'
                }}
                onClick={handleTradeOffer}
                >
                  <span style={{
                    fontFamily: 'Work Sans',
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '21px',
                    textAlign: 'center',
                    color: '#FFFFFF'
                  }}>
                    Submit Trade Offer
                  </span>
                </button>
              </div>

              {/* Other Trade Offers */}
              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '16px 16px 8px'
              }}>
                <span style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 700,
                  fontSize: '18px',
                  lineHeight: '23px',
                  color: '#121417',
                  margin: 0
                }}>
                  Other Trade Offers
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignSelf: 'stretch',
                padding: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: '12px',
                  width: '100%'
                }}>
                  {[
                    {
                      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
                      title: 'Vintage Camera',
                      description: 'A vintage camera in good condition',
                      color: '#FF6B6B'
                    },
                    {
                      image: 'https://images.unsplash.com/photo-1622544221926-50c4840a1a30?w=400',
                      title: 'Antique Coin Set',
                      description: 'A set of antique coins',
                      color: '#4ECDC4'
                    },
                    {
                      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
                      title: 'Signed Baseball',
                      description: 'A signed baseball',
                      color: '#45B7D1'
                    }
                  ].map((offer, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignSelf: 'stretch',
                      gap: '16px',
                      flex: 1,
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        height: '135px',
                        backgroundColor: offer.color,
                        borderRadius: '8px'
                      }} />
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <span style={{
                            fontFamily: 'Work Sans',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#121417'
                          }}>
                            {offer.title}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <span style={{
                            fontFamily: 'Work Sans',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '21px',
                            color: '#61758A'
                          }}>
                            {offer.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* 입찰 모달 */}
      {showBidModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontFamily: 'Work Sans',
                fontWeight: 700,
                fontSize: '18px',
                color: '#121417',
                margin: 0
              }}>입찰 확인</h3>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => setShowBidModal(false)}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontFamily: 'Work Sans',
                fontSize: '14px',
                color: '#121417',
                marginBottom: '16px'
              }}>다음 금액으로 입찰하시겠습니까?</p>
              <div style={{
                padding: '16px',
                backgroundColor: '#F0F2F5',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#121417'
                }}>{item.title || item.name}</div>
                <div style={{
                  fontFamily: 'Work Sans',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#268CF5'
                }}>
                  ${parseFloat(bidAmount || "0").toLocaleString()}
                </div>
              </div>
              <p style={{
                fontFamily: 'Work Sans',
                fontSize: '12px',
                color: '#61758A'
              }}>* 입찰은 취소할 수 없습니다.</p>
            </div>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#F0F2F5',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Work Sans',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#121417',
                  cursor: 'pointer'
                }}
                onClick={() => setShowBidModal(false)}
              >
                취소
              </button>
              <button 
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#268CF5',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'Work Sans',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onClick={handleBidSubmit}
              >
                입찰하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;