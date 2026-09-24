import {
  RoleType,
  PlaceStatus,
  PostVisibility,
  AccessTier,
  VerificationStatus,
  TipRouteStatus,
  TreasuryFundingSource,
} from '@ventlore/domain';

import {
  UserSessionDTO,
  PlaceSummaryDTO,
  PlaceDetailDTO,
  PostDetailDTO,
  UserProfileDTO,
  VipPlanDTO,
  TransparencySummaryDTO,
  DemoPersona,
} from './types.js';

export class VentloreMockAdapter {
  private currentPersona: DemoPersona = 'guest';

  // Demo sessions
  private sessions: Record<DemoPersona, UserSessionDTO> = {
    guest: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e00',
      handle: 'guest_reader',
      displayName: 'Khách Đọc Công Khai',
      roleAssignments: [],
      membership: null,
      walletBinding: null,
      capabilities: ['can_read_public'],
    },
    member: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01',
      handle: 'bin_traveler',
      displayName: 'Bin Khám Phá',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      roleAssignments: [
        {
          roleAssignmentId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e90',
          role: RoleType.MEMBER,
        },
      ],
      membership: null,
      walletBinding: {
        walletBindingId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e91',
        address: '0x71C...B29a',
        chainNamespace: 'eip155:421614',
        isVerified: true,
      },
      capabilities: ['can_read_public', 'can_propose_place', 'can_submit_post', 'can_donate'],
    },
    author: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
      handle: 'minh_trailguide',
      displayName: 'Minh Hướng Dẫn Viên',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      roleAssignments: [
        {
          roleAssignmentId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e92',
          role: RoleType.MEMBER,
        },
      ],
      membership: null,
      walletBinding: {
        walletBindingId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e93',
        address: '0x88F...42C1',
        chainNamespace: 'eip155:421614',
        isVerified: true,
      },
      capabilities: ['can_read_public', 'can_submit_post', 'can_claim_nft', 'can_receive_tip'],
    },
    vip: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e06',
      handle: 'an_vip_explorer',
      displayName: 'An Thám Hiểm VIP',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      roleAssignments: [
        {
          roleAssignmentId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e94',
          role: RoleType.MEMBER,
        },
      ],
      membership: {
        membershipId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e95',
        planCode: 'VIP_ANNUAL',
        startsAt: '2026-01-01T00:00:00Z',
        endsAt: '2026-12-31T23:59:59Z',
        isActive: true,
      },
      walletBinding: {
        walletBindingId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e96',
        address: '0x99A...13D8',
        chainNamespace: 'eip155:421614',
        isVerified: true,
      },
      capabilities: ['can_read_public', 'can_read_vip', 'can_propose_place', 'can_donate'],
    },
    expert: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07',
      handle: 'hoang_ranger',
      displayName: 'Hoàng Kiểm Lâm Viên',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      roleAssignments: [
        {
          roleAssignmentId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e97',
          role: RoleType.EXPERT,
          regionId: 'reg-north-east',
          scope: 'Địa hình vách đá & an toàn đường thủy',
          validUntil: '2027-12-31T23:59:59Z',
        },
      ],
      membership: null,
      walletBinding: {
        walletBindingId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e98',
        address: '0x33C...99B4',
        chainNamespace: 'eip155:421614',
        isVerified: true,
      },
      capabilities: ['can_read_public', 'can_review_tasks', 'can_submit_evidence'],
    },
  };

  // Places fixtures
  private places: PlaceDetailDTO[] = [
    {
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
      displayCode: 'PLC-000001',
      name: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
      regionId: 'reg-north-coast',
      regionName: 'Hải Phòng / Cát Bà',
      status: PlaceStatus.ACTIVE,
      canonicalPlaceId: null,
      summary: 'Tuyến đường đi bộ ven biển tuyệt đẹp nối bãi tắm và vách đá hoang sơ, thích hợp khám phá trong ngày.',
      description: 'Cung đường ven biển Cát Cò 3 là hành trình kết hợp giữa đường mòn vách đá và bãi triều tự nhiên. Khu vực có độ dốc trung bình nhưng trơn trượt vào sáng sớm do sương mù và triều dâng.',
      warnings: [
        'Sóng lớn và triều cường dâng cao vào mùa đông (tháng 11 - tháng 2)',
        'Vách đá trơn trượt; tuyệt đối không đi chân trần hoặc giày đế nhẵn',
        'Khu vực không có nhân viên cứu hộ túc trực thường xuyên',
      ],
      activities: ['Trekking', 'Chèo Kayak', 'Chụp ảnh phong cảnh'],
      imageUrl: '/brand/Ventlore_Identity_Board.png',
      postsCount: 2,
      coordinates: { lat: 20.7183, lng: 107.0514 },
      posts: [
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
          displayCode: 'PST-000001',
          author: {
            userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
            handle: 'minh_trailguide',
            displayName: 'Minh Hướng Dẫn Viên',
            avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
          },
          currentRevision: {
            revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
            displayCode: 'REV-000002',
            title: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng',
            observedAt: '2026-04-15T08:00:00Z',
            verificationStatus: VerificationStatus.VERIFIED,
            accessTier: AccessTier.PUBLIC,
          },
        },
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40',
          displayCode: 'PST-000004',
          author: {
            userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
            handle: 'minh_trailguide',
            displayName: 'Minh Hướng Dẫn Viên',
            avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
          },
          currentRevision: {
            revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e41',
            displayCode: 'REV-000006',
            title: 'Tọa độ hốc trú bão tự nhiên phía sau Vịnh Cát Cò (VIP)',
            observedAt: '2026-05-10T14:30:00Z',
            verificationStatus: VerificationStatus.VERIFIED,
            accessTier: AccessTier.VIP,
          },
        },
      ],
    },
    {
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e04',
      displayCode: 'PLC-000003',
      name: 'Cung Đường Trek Cát Bà Cũ (Đã gộp)',
      regionId: 'reg-north-coast',
      regionName: 'Hải Phòng / Cát Bà',
      status: PlaceStatus.MERGED,
      canonicalPlaceId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
      canonicalPlace: {
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
        displayCode: 'PLC-000001',
        name: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
      },
      summary: 'Địa điểm trùng lặp đã được Hội đồng chuyên môn sáp nhập vào Vịnh Cát Cò 3.',
      description: 'Hồ sơ cũ được lập trước đợt chuẩn hóa địa danh. Dữ liệu và các bài đánh giá đã được chuyển tiếp sang địa điểm chuẩn.',
      warnings: ['Hồ sơ đã sáp nhập, vui lòng tra cứu và đóng góp tại địa điểm chuẩn.'],
      activities: ['Trekking'],
      postsCount: 0,
      posts: [],
    },
    {
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e03',
      displayCode: 'PLC-000002',
      name: 'Thác Rêu Xanh Thượng Nguồn (Ứng viên chờ duyệt)',
      regionId: 'reg-central-highlands',
      regionName: 'Tây Nguyên / Kon Tum',
      status: PlaceStatus.CANDIDATE,
      canonicalPlaceId: null,
      summary: 'Điểm mạo hiểm mới do thành viên đề xuất; đang trong quy trình phân công chuyên gia kiểm tra thực địa.',
      description: 'Hồ sơ riêng tư của thành viên đề xuất; chưa mở công khai cho độc giả cho đến khi có ít nhất một báo cáo thẩm định đạt yêu cầu.',
      warnings: [
        'Khu vực rừng rậm trũng ngập vào mùa mưa',
        'Có nguy cơ lũ quét cục bộ không báo trước',
      ],
      activities: ['Khám phá rừng', 'Lội suối'],
      postsCount: 1,
      posts: [],
    },
    {
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08',
      displayCode: 'PLC-000004',
      name: 'Vách Đá Móng Rồng Đảo Cô Tô',
      regionId: 'reg-north-island',
      regionName: 'Quảng Ninh / Cô Tô',
      status: PlaceStatus.ACTIVE,
      canonicalPlaceId: null,
      summary: 'Hệ thống trầm tích vách đá uốn lượn ngoạn mục với những lớp đá phiến muôn hình vạn trạng.',
      description: 'Vách đá Móng Rồng là kỳ quan địa chất tự nhiên của Cô Tô. Du khách có thể đi bộ ven vách khi thủy triều rút để chiêm ngưỡng các tầng địa chất triệu năm.',
      warnings: [
        'Đá phiến sắc nhọn; cần mang giày bọc mũi và găng tay khi bám vách',
        'Theo dõi kỹ lịch thủy triều của trạm khí tượng thủy văn đảo Cô Tô',
      ],
      activities: ['Đi bộ ngắm cảnh', 'Nghiên cứu địa chất'],
      postsCount: 1,
      coordinates: { lat: 20.9782, lng: 107.7554 },
      posts: [
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20',
          displayCode: 'PST-000002',
          author: {
            userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01',
            handle: 'bin_traveler',
            displayName: 'Bin Khám Phá',
            avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
          },
          currentRevision: {
            revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e21',
            displayCode: 'REV-000004',
            title: 'Trải nghiệm đón bình minh tại Vách Đá Móng Rồng Cô Tô',
            observedAt: '2026-06-02T05:15:00Z',
            verificationStatus: VerificationStatus.UNVERIFIED,
            accessTier: AccessTier.PUBLIC,
          },
        },
      ],
    },
    {
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09',
      displayCode: 'PLC-000005',
      name: 'Đỉnh Tây Côn Lĩnh Hoàng Su Phì',
      regionId: 'reg-north-mountain',
      regionName: 'Hà Giang / Hoàng Su Phì',
      status: PlaceStatus.ACTIVE,
      canonicalPlaceId: null,
      summary: 'Nóc nhà Đông Bắc cao 2.427m xuyên qua rừng trà Shan tuyết cổ thụ và thảm thực vật ôn đới độc đáo.',
      description: 'Hành trình chinh phục Tây Côn Lĩnh đòi hỏi thể lực bền bỉ và người dẫn đường am hiểu địa phương. Đường đi xuyên qua rừng cổ thụ rêu phong và các dốc đứng trơn trợt.',
      warnings: [
        'Vắt rừng nhiều quanh năm, đặc biệt sau cơn mưa ẩm',
        'Sương mù dày đặc che khuất tầm nhìn từ sau 15h00',
        'Hồ sơ kiểm định thực địa đã hết hạn, cần đoàn thẩm định mới rà soát',
      ],
      activities: ['Leo núi cao', 'Cắm trại trong rừng'],
      postsCount: 1,
      coordinates: { lat: 22.8094, lng: 104.8117 },
      posts: [
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
          displayCode: 'PST-000003',
          author: {
            userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
            handle: 'minh_trailguide',
            displayName: 'Minh Hướng Dẫn Viên',
            avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
          },
          currentRevision: {
            revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
            displayCode: 'REV-000005',
            title: 'Hành trình vượt dốc Tây Côn Lĩnh mùa đông (Kiểm định hết hạn)',
            observedAt: '2025-11-20T06:00:00Z',
            verificationStatus: VerificationStatus.EXPIRED,
            accessTier: AccessTier.PUBLIC,
          },
        },
      ],
    },
  ];

  // Posts fixtures with full revision history
  private posts: Record<string, PostDetailDTO> = {
    // 1. Post 1: Multi-revision post
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10': {
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
      displayCode: 'PST-000001',
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
      place: {
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
        displayCode: 'PLC-000001',
        name: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
        regionName: 'Hải Phòng / Cát Bà',
      },
      author: {
        userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
        handle: 'minh_trailguide',
        displayName: 'Minh Hướng Dẫn Viên',
        avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
        bio: 'Chuyên gia dẫn đường ven biển và vách đá với hơn 8 năm kinh nghiệm thực địa tại vùng Đông Bắc.',
      },
      currentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
      visibility: PostVisibility.PUBLISHED,
      revision: {
        revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
        displayCode: 'REV-000002',
        postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
        parentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e11',
        versionNumber: 2,
        title: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng (Bản đã kiểm định)',
        content: `Cung đường ven biển Cát Cò 3 là một trong những trải nghiệm ngoạn mục nhất tại đảo Cát Bà. Lộ trình dài khoảng 2.8 km bám men theo vách đá hoa cương nhìn thẳng ra vịnh Lan Hạ.

### 1. Thời điểm xuất phát lý tưởng
Nên bắt đầu di chuyển từ 06:30 đến 08:30 sáng khi nắng chưa gắt và thủy triều bắt đầu rút. Không nên đi sau 16:00 chiều vì khi hoàng hôn xuống, mặt đá khuất bóng tối rất nhanh và sóng biển dâng cao che lấp lối mòn dưới chân vách.

### 2. Trang thiết bị tối thiểu bắt buộc
- Giày leo núi hoặc giày lội nước có gai cao su bám đá tốt (vibram hoặc tương đương).
- Tối thiểu 1.5 lít nước uống và thanh năng lượng.
- Túi chống nước bảo vệ điện thoại và giấy tờ tùy thân.
- Bộ sơ cứu cơ bản gồm băng gạc y tế và thuốc sát khuẩn vết thương trầy xước.

### 3. Cảnh báo rủi ro thực địa
- Tại mỏm đá Km 1.4 có hiện tượng rêu trơn bám mặt đá ngầm khi triều rút. Bước chậm và giữ 3 điểm tiếp xúc khi qua đoạn này.
- **Lưu ý an toàn:** Không có bất kỳ địa điểm nào là "an toàn tuyệt đối". Mọi cá nhân tự chịu trách nhiệm về quyết định di chuyển và quan sát thực địa của bản thân.`,
        observedAt: '2026-04-15T08:00:00Z',
        accessTier: AccessTier.PUBLIC,
        verificationStatus: VerificationStatus.VERIFIED,
        checkedAt: '2026-05-01T10:00:00Z',
        validUntil: '2027-05-01T23:59:59Z',
        scope: 'Kiểm tra thực địa địa hình lối mòn, vách đá km 1.4 và khả năng tiếp cận nước sạch',
        inspectorNotes: 'Chuyên gia Hoàng Kiểm Lâm đã trực tiếp rà soát thực địa ngày 30/04/2026. Lối đi thông suốt, cảnh báo rêu đá tại Km 1.4 là chính xác.',
        claims: [
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c01',
            text: 'Cung đường có chiều dài thực tế 2.8 km từ bãi tắm Cát Cò 3 đến Mũi Cá heo',
            category: 'Địa hình',
            status: 'VERIFIED',
          },
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c02',
            text: 'Thời gian di chuyển trung bình khoảng 90 đến 120 phút đi bộ liên tục',
            category: 'Thời gian',
            status: 'VERIFIED',
          },
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c03',
            text: 'Không có điểm tiếp tế nước ngọt trên đường; cần mang đủ từ điểm khởi hành',
            category: 'Tiếp tế',
            status: 'VERIFIED',
          },
        ],
        sources: [
          { title: 'Nhật ký thực địa cá nhân - Minh Trailguide (15/04/2026)' },
          { title: 'Biên bản kiểm tra độc lập - Chuyên gia Hoàng Kiểm Lâm (01/05/2026)' },
        ],
        tipRoute: {
          routeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5r01',
          status: TipRouteStatus.ACTIVE,
          beneficiaryAddress: '0x88F...42C1',
        },
      },
      revisionsList: [
        {
          revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e11',
          displayCode: 'REV-000001',
          versionNumber: 1,
          title: 'Kinh nghiệm vượt ghềnh Cát Cò 3 (Bản nháp ban đầu)',
          createdAt: '2026-03-10T14:00:00Z',
          verificationStatus: VerificationStatus.UNVERIFIED,
          accessTier: AccessTier.PUBLIC,
        },
        {
          revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
          displayCode: 'REV-000002',
          versionNumber: 2,
          title: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng (Bản đã kiểm định)',
          createdAt: '2026-04-16T09:00:00Z',
          verificationStatus: VerificationStatus.VERIFIED,
          accessTier: AccessTier.PUBLIC,
        },
        {
          revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e13',
          displayCode: 'REV-000003',
          versionNumber: 3,
          title: 'Cập nhật sạt lở mùa mưa tại vách Cát Cò 3 (Yêu cầu chỉnh sửa)',
          createdAt: '2026-08-20T11:00:00Z',
          verificationStatus: VerificationStatus.NEEDS_CHANGES,
          accessTier: AccessTier.PUBLIC,
        },
      ],
    },

    // 2. Post 2: Unverified post
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20': {
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20',
      displayCode: 'PST-000002',
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08',
      place: {
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08',
        displayCode: 'PLC-000004',
        name: 'Vách Đá Móng Rồng Đảo Cô Tô',
        regionName: 'Quảng Ninh / Cô Tô',
      },
      author: {
        userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01',
        handle: 'bin_traveler',
        displayName: 'Bin Khám Phá',
        avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
        bio: 'Đam mê khám phá các cung đường ven biển hoang sơ và ghi chép trải nghiệm.',
      },
      currentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e21',
      visibility: PostVisibility.PUBLISHED,
      revision: {
        revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e21',
        displayCode: 'REV-000004',
        postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20',
        parentRevisionId: null,
        versionNumber: 1,
        title: 'Trải nghiệm đón bình minh tại Vách Đá Móng Rồng Cô Tô',
        content: `Bình minh tại vách đá Móng Rồng là một trong những khoảnh khắc đẹp nhất khi tới Cô Tô. Những phiến đá xếp tầng uốn cong như móng vuốt rồng vươn ra biển đón những tia nắng đầu tiên.

### Cảm nhận thực tế:
- Sáng sớm gió biển rất lớn, cần mang áo khoác nhẹ cản gió.
- Các tầng đá khá dốc, một số chỗ có cát vụn dễ trượt. Hãy bước chắc từng chân.
- **Trạng thái bài viết:** Đây là ghi chép cá nhân chưa qua kiểm định của chuyên gia độc lập. Độc giả nên tham khảo thêm khuyến cáo của cơ quan địa phương trước khi khởi hành.`,
        observedAt: '2026-06-02T05:15:00Z',
        accessTier: AccessTier.PUBLIC,
        verificationStatus: VerificationStatus.UNVERIFIED,
        checkedAt: null,
        validUntil: null,
        scope: null,
        inspectorNotes: null,
        claims: [
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c10',
            text: 'Mặt trời mọc nhìn rõ từ vách đá vào khoảng 05:20 sáng mùa hè',
            category: 'Hiện tượng tự nhiên',
            status: 'UNVERIFIED',
          },
        ],
        sources: [
          { title: 'Ảnh chụp cá nhân có định vị GPS ngày 02/06/2026' },
        ],
        tipRoute: null,
      },
      revisionsList: [
        {
          revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e21',
          displayCode: 'REV-000004',
          versionNumber: 1,
          title: 'Trải nghiệm đón bình minh tại Vách Đá Móng Rồng Cô Tô',
          createdAt: '2026-06-03T10:00:00Z',
          verificationStatus: VerificationStatus.UNVERIFIED,
          accessTier: AccessTier.PUBLIC,
        },
      ],
    },

    // 3. Post 3: Expired verification post
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30': {
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
      displayCode: 'PST-000003',
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09',
      place: {
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e09',
        displayCode: 'PLC-000005',
        name: 'Đỉnh Tây Côn Lĩnh Hoàng Su Phì',
        regionName: 'Hà Giang / Hoàng Su Phì',
      },
      author: {
        userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
        handle: 'minh_trailguide',
        displayName: 'Minh Hướng Dẫn Viên',
        avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
        bio: 'Chuyên gia dẫn đường ven biển và vách đá với hơn 8 năm kinh nghiệm thực địa tại vùng Đông Bắc.',
      },
      currentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
      visibility: PostVisibility.PUBLISHED,
      revision: {
        revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
        displayCode: 'REV-000005',
        postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
        parentRevisionId: null,
        versionNumber: 1,
        title: 'Hành trình vượt dốc Tây Côn Lĩnh mùa đông (Kiểm định hết hạn)',
        content: `Tây Côn Lĩnh mùa đông nhiệt độ có thể xuống dưới 4 độ C vào ban đêm. Lối mòn mọc đầy rêu và các nhánh cây mục gãy sau các đợt mưa đá.

**CẢNH BÁO HIỆU LỰC KIỂM ĐỊNH:**  
Chứng nhận kiểm định cho bài viết này đã hết hạn vào ngày 31/12/2025. Do ảnh hưởng của bão và sạt lở trong mùa mưa vừa qua, tình trạng đường đi thực tế có thể đã thay đổi đáng kể so với tài liệu này. Vui lòng liên hệ hướng dẫn viên bản địa trước khi khởi hành.`,
        observedAt: '2025-11-20T06:00:00Z',
        accessTier: AccessTier.PUBLIC,
        verificationStatus: VerificationStatus.EXPIRED,
        checkedAt: '2025-11-30T10:00:00Z',
        validUntil: '2025-12-31T23:59:59Z',
        scope: 'Đánh giá điều kiện thời tiết mùa đông và điểm hạ trại tại độ cao 2.000m',
        inspectorNotes: 'Chứng nhận chỉ có hiệu lực cho mùa leo núi 2025. Cần kiểm tra lại sau mùa mưa 2026.',
        claims: [
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c20',
            text: 'Điểm hạ trại 2000m có nguồn nước ngầm ổn định trong mùa khô 2025',
            category: 'Nguồn nước',
            status: 'EXPIRED',
          },
        ],
        sources: [
          { title: 'Báo cáo thẩm định mùa đông 2025 - Tổ Chuyên môn Ventlore' },
        ],
        tipRoute: null,
      },
      revisionsList: [
        {
          revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
          displayCode: 'REV-000005',
          versionNumber: 1,
          title: 'Hành trình vượt dốc Tây Côn Lĩnh mùa đông (Kiểm định hết hạn)',
          createdAt: '2025-11-22T08:00:00Z',
          verificationStatus: VerificationStatus.EXPIRED,
          accessTier: AccessTier.PUBLIC,
        },
      ],
    },

    // 4. Post 4: VIP Exclusive Post (AccessGate Demo)
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40': {
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40',
      displayCode: 'PST-000004',
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
      place: {
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
        displayCode: 'PLC-000001',
        name: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
        regionName: 'Hải Phòng / Cát Bà',
      },
      author: {
        userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
        handle: 'minh_trailguide',
        displayName: 'Minh Hướng Dẫn Viên',
        avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
        bio: 'Chuyên gia dẫn đường ven biển và vách đá với hơn 8 năm kinh nghiệm thực địa tại vùng Đông Bắc.',
      },
      currentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e41',
      visibility: PostVisibility.PUBLISHED,
      revision: {
        revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e41',
        displayCode: 'REV-000006',
        postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40',
        parentRevisionId: null,
        versionNumber: 1,
        title: 'Tọa độ hốc trú bão tự nhiên phía sau Vịnh Cát Cò (VIP)',
        content: `[NỘI DUNG ĐẶC QUYỀN VIP ĐÃ MỞ KHÓA CHO HỘI VIÊN]

Tọa độ chính xác cửa hang: 20°43'06.2"N 107°03'05.1"E.
Cửa hang nằm ẩn sau bụi dứa dại cách mép nước 15m. Độ cao nền hang cao hơn mực nước triều cường kỷ lục 3.5m, hoàn toàn khô ráo ngay cả khi giông bão cấp 8.

### Bản đồ tiếp cận khẩn cấp:
- Từ mũi Cá Heo rẽ trái 45 độ theo khe nứt đá vôi.
- Có túi sơ cứu dự phòng và nước sạch đóng chai được các hướng dẫn viên địa phương tiếp tế định kỳ hàng tháng.
- Sóng điện thoại Viettel đạt 2 vạch tại cửa hốc.`,
        observedAt: '2026-05-10T14:30:00Z',
        accessTier: AccessTier.VIP,
        verificationStatus: VerificationStatus.VERIFIED,
        checkedAt: '2026-05-20T10:00:00Z',
        validUntil: '2027-05-20T23:59:59Z',
        scope: 'Khảo sát địa chất hốc trú ẩn và kiểm tra an toàn trong điều kiện mưa bão',
        inspectorNotes: 'Đã xác nhận hốc đá chịu lực vững chắc, không có hiện tượng nứt vỡ trần hang.',
        claims: [
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c30',
            text: 'Nền hang cao hơn triều dâng kỷ lục 3.5 mét',
            category: 'Độ cao an toàn',
            status: 'VERIFIED',
          },
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c31',
            text: 'Có sóng viễn thông khẩn cấp tại miệng hang',
            category: 'Liên lạc',
            status: 'VERIFIED',
          },
        ],
        sources: [
          { title: 'Tọa độ đo đạc GNSS độ chính xác cao - Minh Trailguide (10/05/2026)' },
        ],
        tipRoute: {
          routeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5r02',
          status: TipRouteStatus.ACTIVE,
          beneficiaryAddress: '0x88F...42C1',
        },
      },
      revisionsList: [
        {
          revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e41',
          displayCode: 'REV-000006',
          versionNumber: 1,
          title: 'Tọa độ hốc trú bão tự nhiên phía sau Vịnh Cát Cò (VIP)',
          createdAt: '2026-05-12T16:00:00Z',
          verificationStatus: VerificationStatus.VERIFIED,
          accessTier: AccessTier.VIP,
        },
      ],
    },
  };

  // User profiles
  private userProfiles: Record<string, UserProfileDTO> = {
    minh_trailguide: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
      handle: 'minh_trailguide',
      displayName: 'Minh Hướng Dẫn Viên',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      bio: 'Chuyên gia dẫn đường ven biển và vách đá với hơn 8 năm kinh nghiệm thực địa tại vùng Đông Bắc Việt Nam.',
      joinedAt: '2024-03-15T00:00:00Z',
      credentials: [
        {
          credentialId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e71',
          title: 'Huy hiệu Đóng Góp Thực Địa Vàng (Contributor SBT)',
          badgeType: 'CONTRIBUTOR_SBT',
          issuedAt: '2025-01-10T09:00:00Z',
          tokenId: '4829104819204812',
        },
      ],
      publishedPosts: [
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
          displayCode: 'PST-000001',
          placeName: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
          title: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng',
          verificationStatus: VerificationStatus.VERIFIED,
          observedAt: '2026-04-15T08:00:00Z',
        },
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
          displayCode: 'PST-000003',
          placeName: 'Đỉnh Tây Côn Lĩnh Hoàng Su Phì',
          title: 'Hành trình vượt dốc Tây Côn Lĩnh mùa đông (Kiểm định hết hạn)',
          verificationStatus: VerificationStatus.EXPIRED,
          observedAt: '2025-11-20T06:00:00Z',
        },
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40',
          displayCode: 'PST-000004',
          placeName: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
          title: 'Tọa độ hốc trú bão tự nhiên phía sau Vịnh Cát Cò (VIP)',
          verificationStatus: VerificationStatus.VERIFIED,
          observedAt: '2026-05-10T14:30:00Z',
        },
      ],
    },
    bin_traveler: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01',
      handle: 'bin_traveler',
      displayName: 'Bin Khám Phá',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      bio: 'Người yêu biển đảo và khám phá thiên nhiên hoang dã. Đang thực hiện mục tiêu ghi dấu 50 đảo ven bờ.',
      joinedAt: '2025-06-20T00:00:00Z',
      credentials: [],
      publishedPosts: [
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20',
          displayCode: 'PST-000002',
          placeName: 'Vách Đá Móng Rồng Đảo Cô Tô',
          title: 'Trải nghiệm đón bình minh tại Vách Đá Móng Rồng Cô Tô',
          verificationStatus: VerificationStatus.UNVERIFIED,
          observedAt: '2026-06-02T05:15:00Z',
        },
      ],
    },
  };

  // VIP plans fixture
  private vipPlans: VipPlanDTO[] = [
    {
      planCode: 'VIP_ANNUAL',
      name: 'Gói Hội Viên Thám Hiểm Thường Niên (12 Tháng)',
      priceUsdCents: 1500, // 15 USD = 1500 USD cents
      termMonths: 12,
      benefits: [
        'Truy cập toàn bộ tọa độ khẩn cấp, bản đồ 3D và hốc trú ẩn chuyên sâu',
        'Tải về dữ liệu ngoại tuyến (Offline GPS tracks & GPX) không giới hạn',
        'Huy hiệu Hội viên VIP hỗ trợ quỹ thẩm định an toàn cộng đồng',
        'Thời hạn 12 tháng lịch UTC tính từ lúc kích hoạt; gia hạn chủ động, không tự động trừ thẻ',
      ],
      status: 'AVAILABLE',
    },
  ];

  // Transparency ledger fixture
  private transparencySummary: TransparencySummaryDTO = {
    year: 2026,
    balances: [
      {
        asset: 'USDC',
        availableAtomic: '2450000000', // 2,450.00 USDC
        reservedAtomic: '600000000', // 600.00 USDC
        spentAtomic: '1850000000', // 1,850.00 USDC
        availableFormatted: '2,450.00 USDC',
        reservedFormatted: '600.00 USDC',
        spentFormatted: '1,850.00 USDC',
      },
      {
        asset: 'ETH',
        availableAtomic: '1250000000000000000', // 1.25 ETH
        reservedAtomic: '300000000000000000', // 0.30 ETH
        spentAtomic: '950000000000000000', // 0.95 ETH
        availableFormatted: '1.25 ETH',
        reservedFormatted: '0.30 ETH',
        spentFormatted: '0.95 ETH',
      },
    ],
    sources: [
      {
        sourceType: TreasuryFundingSource.OWNER_FUNDING,
        amountFormatted: '3,000.00 USDC',
        asset: 'USDC',
        description: 'Vốn đối ứng khởi tạo quỹ thẩm định từ Ban sáng lập Ventlore',
      },
      {
        sourceType: TreasuryFundingSource.VIP_REVENUE,
        amountFormatted: '1,200.00 USDC',
        asset: 'USDC',
        description: '80 gói Hội viên VIP đã kích hoạt (15 USD/gói chuyển vào quỹ)',
      },
      {
        sourceType: TreasuryFundingSource.PROJECT_DONATION,
        amountFormatted: '0.70 ETH',
        asset: 'ETH',
        description: 'Đóng góp công khai trực tiếp từ cộng đồng vào ví quỹ dự án',
      },
      {
        sourceType: TreasuryFundingSource.POST_TIP_SHARE,
        amountFormatted: '0.25 ETH',
        asset: 'ETH',
        description: '20% trích từ tiền tip bạn đọc gửi tới các tác giả bài viết được duyệt',
      },
    ],
    recentDisbursements: [
      {
        payoutId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5p01',
        displayCode: 'PAY-000001',
        purpose: 'Thù lao thẩm định thực địa Vịnh Cát Cò 3 (Chuyên gia Hoàng)',
        asset: 'USDC',
        amountFormatted: '150.00 USDC',
        date: '2026-05-02T14:00:00Z',
        txHash: '0x3a4b...89fc',
      },
      {
        payoutId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5p02',
        displayCode: 'PAY-000002',
        purpose: 'Thù lao thẩm định địa mạo Vách Đá Móng Rồng Cô Tô',
        asset: 'USDC',
        amountFormatted: '120.00 USDC',
        date: '2026-06-10T09:30:00Z',
        txHash: '0x9c1d...44ab',
      },
    ],
  };

  // Methods
  async getSession(): Promise<UserSessionDTO> {
    return this.sessions[this.currentPersona];
  }

  setPersona(persona: DemoPersona): void {
    this.currentPersona = persona;
  }

  getCurrentPersona(): DemoPersona {
    return this.currentPersona;
  }

  async listPlaces(params?: {
    query?: string;
    regionId?: string;
    activity?: string;
    cursor?: string;
  }): Promise<{ items: PlaceSummaryDTO[]; nextCursor: string | null; total: number }> {
    // PUBLIC explore: filter out CANDIDATE (private candidates only shown to authorized roles)
    const session = await this.getSession();
    const canSeeCandidates =
      session.capabilities.includes('can_review_tasks') ||
      session.capabilities.includes('can_propose_place');

    let filtered = this.places.filter(p => {
      if (p.status === PlaceStatus.CANDIDATE && !canSeeCandidates) {
        return false;
      }
      return true;
    });

    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.regionName.toLowerCase().includes(q)
      );
    }

    if (params?.regionId && params.regionId !== 'all') {
      filtered = filtered.filter(p => p.regionId === params.regionId);
    }

    if (params?.activity && params.activity !== 'all') {
      filtered = filtered.filter(p =>
        p.activities.some(a => a.toLowerCase().includes(params.activity!.toLowerCase()))
      );
    }

    return {
      items: filtered,
      nextCursor: null,
      total: filtered.length,
    };
  }

  async getPlace(placeId: string): Promise<PlaceDetailDTO | null> {
    const place = this.places.find(p => p.placeId === placeId);
    if (!place) return null;

    // Check candidate visibility
    if (place.status === PlaceStatus.CANDIDATE) {
      const session = await this.getSession();
      const canSee =
        session.capabilities.includes('can_review_tasks') ||
        session.capabilities.includes('can_propose_place');
      if (!canSee) return null;
    }

    return place;
  }

  async getPost(postId: string, revisionId?: string): Promise<PostDetailDTO | null> {
    const post = this.posts[postId];
    if (!post) return null;

    const session = await this.getSession();
    const isVipUser = session.membership?.isActive === true;

    // Deep clone to safely manipulate revision data without mutating source fixture
    const result: PostDetailDTO = JSON.parse(JSON.stringify(post));

    // If specific revision requested, load that revision
    if (revisionId && revisionId !== post.currentRevisionId) {
      // Find revision from fixtures or generate specific revision data
      if (postId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10') {
        if (revisionId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e11') {
          // Revision 1: UNVERIFIED
          result.revision = {
            revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e11',
            displayCode: 'REV-000001',
            postId,
            parentRevisionId: null,
            versionNumber: 1,
            title: 'Kinh nghiệm vượt ghềnh Cát Cò 3 (Bản nháp ban đầu)',
            content: 'Bản ghi chép ban đầu được nộp vào tháng 3/2026. Lối đi chưa được xác nhận độc lập. Vui lòng tham khảo bản sửa đổi mới nhất.',
            observedAt: '2026-03-10T14:00:00Z',
            accessTier: AccessTier.PUBLIC,
            verificationStatus: VerificationStatus.UNVERIFIED,
            checkedAt: null,
            validUntil: null,
            scope: null,
            inspectorNotes: null,
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c01',
                text: 'Cung đường có chiều dài ước tính khoảng 3km',
                category: 'Địa hình',
                status: 'UNVERIFIED',
              },
            ],
            sources: [{ title: 'Ghi chép tự do của tác giả' }],
            tipRoute: null, // Note: UNVERIFIED has NO tip route!
          };
        } else if (revisionId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e13') {
          // Revision 3: NEEDS_CHANGES
          result.revision = {
            revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e13',
            displayCode: 'REV-000003',
            postId,
            parentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
            versionNumber: 3,
            title: 'Cập nhật sạt lở mùa mưa tại vách Cát Cò 3 (Yêu cầu chỉnh sửa)',
            content: 'Bản cập nhật ngày 20/08/2026 ghi nhận sạt lở đá tảng tại km số 3 chắn ngang đường mòn cũ. Đang chờ tác giả bổ sung lộ trình đi vòng qua đỉnh đồi.',
            observedAt: '2026-08-20T11:00:00Z',
            accessTier: AccessTier.PUBLIC,
            verificationStatus: VerificationStatus.NEEDS_CHANGES,
            checkedAt: '2026-08-25T15:00:00Z',
            validUntil: null,
            scope: 'Kiểm tra điểm sạt lở km 3 sau đợt bão số 2',
            inspectorNotes: 'Hội đồng yêu cầu tác giả vẽ lại sơ đồ tránh điểm đá rơi trước khi phê duyệt phiên bản này.',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c05',
                text: 'Đá tảng sạt lở che lấp 10 mét đường mòn sát mép biển',
                category: 'Rủi ro',
                status: 'NEEDS_CHANGES',
              },
            ],
            sources: [{ title: 'Ảnh chụp hiện trường sạt lở ngày 20/08/2026' }],
            tipRoute: null, // Does NOT inherit route of revision 2!
          };
        }
      }
    }

    // Security invariant: If post is VIP and user does not have active VIP membership,
    // REDACT content at the adapter level! DO NOT SEND VIP CONTENT TO CLIENT DOM!
    if (result.revision.accessTier === AccessTier.VIP && !isVipUser) {
      result.revision.content =
        'Nội dung chi tiết bao gồm tọa độ GNSS chính xác, bản đồ hốc trú bão 3D và dữ liệu cứu hộ ngoại tuyến là đặc quyền dành riêng cho Hội viên VIP. Vui lòng đăng nhập bằng tài khoản có gói VIP hoặc nâng cấp hội viên để mở khóa.';
      result.revision.isContentRedacted = true;
      result.revision.redactedReason = 'VIP_REQUIRED';
    }

    return result;
  }

  async getUserProfile(handleOrUserId: string): Promise<UserProfileDTO | null> {
    const profile = Object.values(this.userProfiles).find(
      p => p.handle === handleOrUserId || p.userId === handleOrUserId
    );
    return profile || null;
  }

  async getVipPlans(): Promise<VipPlanDTO[]> {
    return this.vipPlans;
  }

  async getTransparencySummary(year?: number): Promise<TransparencySummaryDTO> {
    return this.transparencySummary;
  }
}

export const mockApiClient = new VentloreMockAdapter();
