import {
  RoleType,
  PlaceStatus,
  PostVisibility,
  AccessTier,
  VerificationStatus,
  TipRouteStatus,
  TreasuryFundingSource,
  ContributionType,
  ReviewDecisionOutcome,
  TaskType,
  TaskWorkStatus,
  PayableStatus,
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
  PaymentIntentDTO,
  ReportDTO,
  ContributionItemDTO,
  CreatePostInput,
  ProposeCandidatePlaceInput,
  BenefitsDTO,
  TaskSubmissionDTO,
  ExpertTaskDTO,
  ExpertPayableDTO,
  AdminReviewCaseDTO,
  AdminIntakeItemDTO,
} from './types.js';

export function generateUUIDv7(): string {
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0');
  const rand1 = Math.floor(Math.random() * 0x0fff).toString(16).padStart(3, '0');
  const rand2 = ((Math.floor(Math.random() * 0x3fff)) | 0x8000).toString(16).padStart(4, '0');
  const rand3 = Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(12, '0');
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-7${rand1}-${rand2}-${rand3}`;
}

function normalizeSearchText(str?: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

export const SHARED_BIO_TRANSLATIONS: Record<string, Record<string, string>> = {
  minh_trailguide: {
    en: 'Coastal and cliff navigation guide with over 8 years of fieldwork experience across Northeast Vietnam.',
    ja: 'ベトナム北東部で8年以上の現場実務経験を持つ、沿岸および断崖ルート案内スペシャリスト。',
    'zh-Hans': '越南东北部海岸与悬崖越野领队，具备8年以上实地探险考察与安全向导经验。',
    ko: '베트남 동북부 지역에서 8년 이상의 현장 경험을 보유한 해안 및 절벽 내비게이션 전문가.',
    fr: 'Guide de terrain littoral et falaises avec plus de 8 ans d’expérience dans le nord-est du Vietnam.',
  },
  bin_traveler: {
    en: 'Island and coastal wilderness enthusiast, dedicated to documenting 50 remote offshore islands.',
    ja: '島嶼と手つかずの自然を愛する旅人。沿岸50島の踏破・記録を目指して活動中。',
    'zh-Hans': '海岛与野外荒野探险爱好者，正致力于记录50座近岸离岛的真实生态与地貌。',
    ko: '섬과 야생 자연을 사랑하는 탐험가. 50개 연안 섬의 기록을 목표로 활동하고 있습니다.',
    fr: 'Passionné d’îles et de nature sauvage, engagé dans la documentation de 50 îles côtières isolées.',
  },
  hoang_ranger: {
    en: 'Forest ranger in charge of terrain safety and natural trails in the Northeast. 12 years of specialized conservation management and field verification.',
    ja: '北東部の地形安全および自然遊歩道を管轄する森林警備隊員。12年の特別林管理および実地検証経験。',
    'zh-Hans': '负责东北部地形安全与自然步道的森林巡护员，具备12年特种林区保护管理与实地核验经验。',
    ko: '동북부 지형 안전 및 자연 트레일을 담당하는 산림 레인저. 12년간의 특수 산림 보호구역 관리 및 현장 검증 경력.',
    fr: 'Garde forestier responsable de la sécurité des terrains et sentiers naturels du Nord-Est. 12 ans d’expérience en gestion forestière và vérification terrain.',
  },
  an_vip_explorer: {
    en: 'Annual supporting member of the Ventlore exploration and conservation fund. Passionate about alpine trekking and speleological surveys.',
    ja: 'Ventlore探検・保全基金の年間支援メンバー。アドベンチャートレッキングや洞窟探査に情熱を注ぐ。',
    'zh-Hans': 'Ventlore探险与保护基金年度资助会员，热衷于高难度徒步越野与洞穴地貌勘测。',
    ko: 'Ventlore 탐험 및 보존 기금의 연간 후원 회원. 고난도 트레킹과 동굴 지형 조사에 열정을 쏟고 있습니다.',
    fr: 'Membre bienfaiteur annuel du fonds d’exploration et de conservation Ventlore. Passionné de trekking d’aventure et de spéléologie.',
  },
  linh_admin: {
    en: 'Ventlore platform coordinator and verification process supervisor.',
    ja: 'Ventloreプラットフォームコーディネーター兼検証プロセスマネージャー。',
    'zh-Hans': 'Ventlore平台协调员与审核流程主管。',
    ko: 'Ventlore 플랫폼 코디네이터 및 검증 프로세스 총괄.',
    fr: 'Coordinatrice de la plateforme Ventlore et superviseuse des processus de vérification.',
  },
  guest_reader: {
    en: 'Independent reader exploring community verified destinations and field reports on Ventlore.',
    ja: 'Ventloreプラットフォームで検証済みスポットや現地レポートを閲覧する一般読者。',
    'zh-Hans': '在Ventlore平台上探索核验目的地与实地考察手记的自由读者。',
    ko: 'Ventlore 플랫폼에서 검증된 여행지와 현장 보고서를 탐색하는 일반 독자.',
    fr: 'Lecteur indépendant découvrant les destinations vérifiées et rapports de terrain sur Ventlore.',
  },
};

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
    admin: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08',
      handle: 'linh_admin',
      displayName: 'Linh Quản Trị Viên',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      roleAssignments: [
        {
          roleAssignmentId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e99',
          role: RoleType.ADMIN,
        },
      ],
      membership: null,
      walletBinding: {
        walletBindingId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5ea0',
        address: '0x11A...99FF',
        chainNamespace: 'eip155:421614',
        isVerified: true,
      },
      capabilities: [
        'can_read_public',
        'can_read_vip',
        'can_review_tasks',
        'can_administer_intake',
        'can_assign_tasks',
        'can_accept_work',
        'can_decide_content',
        'can_manage_treasury',
        'can_hold_content',
      ],
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
      imageUrl: '/destinations/cat-co-3.svg',
      coverImageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80',
      postsCount: 2,
      coordinates: { lat: 20.7183, lng: 107.0514 },
      translations: {
        en: {
          locale: 'en',
          name: 'Cat Co 3 Bay - Island Coastal Trail',
          regionName: 'Hai Phong / Cat Ba Island',
          summary: 'A breathtaking coastal walking trail connecting beaches and wild cliffs, ideal for day trekking.',
          description: 'The Cat Co 3 coastal trail combines rocky cliffside paths and natural tidal reefs. Moderate slopes with morning dew and rising tides require proper footwear.',
          warnings: [
            'Heavy surf and rising swell during winter months (Nov - Feb)',
            'Slippery rock ledges; never hike barefoot or with flat-soled shoes',
            'No permanent lifeguard station on duty along the trail',
          ],
          activities: ['Coastal Trekking', 'Sea Kayaking', 'Landscape Photography'],
        },
        ja: {
          locale: 'ja',
          name: 'カットコー3湾 海岸アイランドトレイル',
          regionName: 'ハイフォン / カットバ島',
          summary: '砂浜と手つかずの断崖を結ぶ絶景の海岸トレイル。日帰りハイキングに最適。',
          description: 'カットコー3の海岸トレイルは、岩場と自然の干潟が織りなすルートです。朝露や満潮時は滑りやすいため、トレッキングシューズの着用が必須です。',
          warnings: [
            '冬期（11月〜2月）は高波と満潮に注意',
            '岩肌が非常に滑りやすいため、平底靴や素足は厳禁',
            '常駐の救助員がいないエリアです',
          ],
          activities: ['海岸トレッキング', 'シーカヤック', '風景写真撮影'],
        },
        'zh-Hans': {
          locale: 'zh-Hans',
          name: '吉古3号湾 海岛沿海步道',
          regionName: '海防 / 吉婆岛',
          summary: '连接沙滩与险峻岩壁的绝美沿海徒步路线，非常适合单日探险。',
          description: '吉古3号湾沿海路线融合了悬崖步道与自然潮间带。部分路段坡度适中，但清晨受海雾与涨潮影响较为湿滑。',
          warnings: [
            '冬季（11月至次年2月）风浪较大且潮汐高涨',
            '岩石湿滑，严禁赤足或穿平底鞋穿行',
            '该区域无常驻专业救援人员',
          ],
          activities: ['沿海徒步', '皮划艇', '风景摄影'],
        },
        ko: {
          locale: 'ko',
          name: '깟꼬 3 베이 해안 아일랜드 트레일',
          regionName: '하이퐁 / 깟바섬',
          summary: '모래사장과 야생 해안 절벽을 잇는 환상적인 해안 트레킹 코스로 당일 탐방에 적합합니다.',
          description: '깟꼬 3 해안로는 바위 절벽길과 자연 조간대가 어우러진 코스입니다. 경사는 완만하지만 아침 안개와 만조 시 미끄러우니 주의하십시오.',
          warnings: [
            '겨울철(11월~2월) 높은 파도 및 조수 간만의 차 주의',
            '바위가 미끄러우므로 슬리퍼나 평평한 신발 착용 절대 금지',
            '상주 안전 요원이 없는 야생 구역입니다',
          ],
          activities: ['해안 트레킹', '카약', '풍경 사진 촬영'],
        },
        fr: {
          locale: 'fr',
          name: 'Baie de Cat Co 3 - Sentier Côtier Insulaire',
          regionName: 'Hai Phong / Île de Cat Ba',
          summary: 'Superbe sentier côtier reliant plages de sable et falaises sauvages, idéal pour une randonnée à la journée.',
          description: 'Le sentier côtier de Cat Co 3 serpente le long de parois rocheuses et d’estrans naturels. Pente modérée mais glissante au lever du jour.',
          warnings: [
            'Fortes vagues et marée haute en hiver (novembre à février)',
            'Parois glissantes ; chaussures de randonnée indispensables',
            'Aucun poste de secours permanent le long du tracé',
          ],
          activities: ['Randonnée côtière', 'Kayak de mer', 'Photographie de paysage'],
        },
      },
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
            title: 'Khảo sát luồng lạch & điểm neo thuyền hoang sơ vịnh Lan Hạ (VIP)',
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
      imageUrl: '/destinations/hang-mua.svg',
      postsCount: 0,
      coordinates: { lat: 20.7183, lng: 107.0514 },
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
      imageUrl: '/destinations/hero-coastal.svg',
      postsCount: 1,
      coordinates: { lat: 14.3541, lng: 107.9842 },
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
      imageUrl: '/destinations/co-to.svg',
      coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      postsCount: 1,
      coordinates: { lat: 20.9782, lng: 107.7554 },
      translations: {
        en: {
          locale: 'en',
          name: 'Dragon Claw Cliffs - Co To Island',
          regionName: 'Quang Ninh / Co To Island',
          summary: 'A dramatic coastal geological wonder with multi-layered sedimentary slate formations.',
          description: 'Dragon Claw Cliff is an ancient geological highlight of Co To Island. Hikers can traverse the wave-cut platform at low tide to admire millions of years of layered rock.',
          warnings: [
            'Sharp slate edges; sturdy hiking boots and gloves are highly recommended',
            'Monitor the daily tide schedule from Co To maritime station closely',
          ],
          activities: ['Scenic Walking', 'Geological Research'],
        },
        ja: {
          locale: 'ja',
          name: 'モングロン龍爪断崖 コト島',
          regionName: 'クアンニン / コト島',
          summary: '幾重にも重なる堆積岩の層が龍の爪のように海へ突き出る圧巻の奇観。',
          description: 'モングロン断崖はコト島の代表的な地質学的遺産です。干潮時には波食棚を歩いて数百〜数千万年前の地層の連なりを間近で観察できます。',
          warnings: [
            '鋭利な岩肌に注意。つま先の硬い登山靴と手袋の着用を推奨',
            'コト島気象観測所の潮汐表を必ず事前に確認してください',
          ],
          activities: ['絶景ウォーキング', '地質調査'],
        },
        'zh-Hans': {
          locale: 'zh-Hans',
          name: '姑苏岛龙爪岩壁',
          regionName: '广宁 / 姑苏岛',
          summary: '千层板岩沉积地层如巨龙利爪般延伸入海，壮观无比的天然地质奇观。',
          description: '龙爪岩壁是姑苏岛著名的自然地质景观。退潮时分，徒步者可沿海蚀平台穿行，近距离欣赏亿万年地层沉淀褶皱。',
          warnings: [
            '页岩层边缘锐利，建议穿着防穿刺徒步鞋并佩戴防滑手套',
            '请务必提前查阅姑苏岛水文气象站发布的潮汐时刻表',
          ],
          activities: ['观景漫步', '地质考察'],
        },
        ko: {
          locale: 'ko',
          name: '꼬또섬 용발톱 해안절벽',
          regionName: '꽝닌 / 꼬또섬',
          summary: '용의 발톱처럼 바다로 뻗어나간 장엄한 퇴적 편암 지층의 자연 지질 명소입니다.',
          description: '용발톱 절벽은 꼬또섬의 대표적인 지질 경관입니다. 썰물 때 바닷가 암반을 따라 걸으며 수천만 년에 걸쳐 형성된 지층을 감상할 수 있습니다.',
          warnings: [
            '날카로운 편암 모서리 주의. 앞코가 단단한 등산화와 장갑 착용 필수',
            '꼬또섬 해양기상 관측소의 조석표를 반드시 사전에 확인하십시오',
          ],
          activities: ['경관 산책', '지질 연구'],
        },
        fr: {
          locale: 'fr',
          name: 'Falaises de Mong Rong - Île de Co To',
          regionName: 'Quang Ninh / Île de Co To',
          summary: 'Splendide merveille géologique aux parois sédimentaires en schiste taillées en forme de griffes de dragon.',
          description: 'Les falaises de Mong Rong sont un chef-d’œuvre naturel de l’île de Co To. À marée basse, les randonneurs peuvent longer la plateforme d’érosion marine.',
          warnings: [
            'Arêtes rocheuses coupantes ; chaussures de marche robustes et gants fortement conseillés',
            'Consulter impérativement l’annuaire des marées de la station de Co To',
          ],
          activities: ['Balade panoramique', 'Recherche géologique'],
        },
      },
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
      imageUrl: '/destinations/tay-con-linh.svg',
      coverImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
      postsCount: 1,
      coordinates: { lat: 22.8094, lng: 104.8117 },
      translations: {
        en: {
          locale: 'en',
          name: 'Tay Con Linh Peak - Hoang Su Phi',
          regionName: 'Ha Giang / Hoang Su Phi',
          summary: 'The roof of North-Eastern Vietnam at 2,427m, trekking through ancient Shan Tuyet tea forests and alpine ecology.',
          description: 'Ascending Tay Con Linh requires strong endurance and accredited local trail guides. The ridgeline traverses mossy old-growth forests and steep mud paths.',
          warnings: [
            'Jungle leeches present year-round, particularly following rain showers',
            'Dense mountain fog severely reduces visibility after 15:00',
            'Field verification certificate is currently expired; new audit required',
          ],
          activities: ['High-altitude Mountaineering', 'Forest Camping'],
        },
        ja: {
          locale: 'ja',
          name: 'タイコンリン山頂 ホアンスーフィー',
          regionName: 'ハザン省 / ホアンスーフィー',
          summary: '標高2,427m、東北地方の最高峰。樹齢数百年の古樹茶園と苔むす原生林を抜けるトレッキング。',
          description: 'タイコンリン山頂への登頂には高い体力と現地を熟知したガイドが不可欠です。急峻で滑りやすい泥道や霧の稜線を歩きます。',
          warnings: [
            '雨上がりを中心に年間を通じてヒルに注意',
            '15時以降は濃い霧で視界が急激に悪化します',
            '本スポットの現地検証レポートは期限切れのため再審査待ちです',
          ],
          activities: ['高山登山', '森林キャンプ'],
        },
        'zh-Hans': {
          locale: 'zh-Hans',
          name: '西昆岭峰 黄树皮县',
          regionName: '河江省 / 黄树皮',
          summary: '东北部屋脊海拔2427米，穿越百年古树雪茶林与独特的温带高山植被。',
          description: '登顶西昆岭需要极佳的体能与经验丰富的当地向导。路线穿过长满苔藓的原始古树森林与陡峭湿滑的泥泞山脊。',
          warnings: [
            '热带山地旱蚂蟥常年多发，雨后尤甚',
            '午后15:00后常有浓密山雾笼罩，能见度骤降',
            '实地核实报告当前已过期，正等待新一轮专家审核',
          ],
          activities: ['高山攀登', '森林露营'],
        },
        ko: {
          locale: 'ko',
          name: '떠이꼰린 봉우리 황수피',
          regionName: '하지앙 / 황수피',
          summary: '해발 2,427m 베트남 동북부 최고봉. 백년 고목 산설차 숲과 원시 이끼 숲을 통과하는 트레킹.',
          description: '떠이꼰린 등반은 강한 체력과 현지 사정에 밝은 가이드가 필수적입니다. 이끼 낀 원시림과 가파른 산길을 통과해야 합니다.',
          warnings: [
            '연중 산거머리 주의, 특히 비 온 뒤 습한 날씨에 급증',
            '오후 15시 이후 짙은 안개로 가시거리 급격히 저하',
            '현장 검증 보고서가 만료된 상태이므로 재검토 대기 중',
          ],
          activities: ['고산 등반', '원시림 캠핑'],
        },
        fr: {
          locale: 'fr',
          name: 'Pic de Tay Con Linh - Hoang Su Phi',
          regionName: 'Ha Giang / Hoang Su Phi',
          summary: 'Toit du Nord-Est à 2 427 m d’altitude, traversant des forêts de théiers ancestraux Shan Tuyet.',
          description: 'L’ascension du Tay Con Linh exige une excellente condition physique et un guide local accrédité. Le sentier grimpe à travers forêts moussues et crêtes abruptes.',
          warnings: [
            'Sangsues présentes toute l’année, particulièrement après les pluies',
            'Brouillard épais réduisant fortement la visibilité après 15h00',
            'Rapport de vérification expiré ; en attente de nouvel audit terrain',
          ],
          activities: ['Haute montagne', 'Camping en forêt'],
        },
      },
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
        coverImageUrl: '/destinations/cat-co-3.svg',
        translations: {
          en: {
            locale: 'en',
            title: 'Practical Guide to Traversing Cat Co 3 Coastal Cliffs in Dry Season (Verified)',
            content: `The Cat Co 3 coastal trail is one of the most magnificent coastal trekking experiences on Cat Ba Island. The route spans approximately 2.8 km hugging granite cliff edges directly overlooking Lan Ha Bay.

### 1. Optimal Starting Time
Begin hiking between 06:30 and 08:30 AM before the heat intensifies and as low tide begins. Do not set out after 16:00; rock surfaces darken rapidly at dusk and afternoon high tides can submerge the base trail.

### 2. Mandatory Minimum Gear
- Sturdy hiking boots or wading shoes with high-traction rubber lugs (Vibram or equivalent).
- At least 1.5 liters of drinking water and energy rations.
- Dry bag for mobile phone and personal credentials.
- Standard first-aid kit with medical gauze and wound disinfectant.

### 3. Field Safety Caveats
- At the rocky outcrop near Km 1.4, submerged rock surfaces become slippery with algae as the tide ebbs. Proceed slowly maintaining 3 points of contact.
- **Safety notice:** No destination is "absolutely safe". Every trekker is responsible for their own navigation decisions and situational awareness.`,
            scope: 'Field inspection of trail terrain, cliff outcrop at Km 1.4, and fresh water access',
            inspectorNotes: 'Auditor Hoang Ranger completed on-site review on April 30, 2026. Trail passage confirmed clear; rock algae warning at Km 1.4 is accurate.',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c01',
                text: 'Actual trail distance is 2.8 km from Cat Co 3 beach to Dolphin Headland',
                category: 'Terrain',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c02',
                text: 'Average traversal time is 90 to 120 minutes of steady walking',
                category: 'Duration',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c03',
                text: 'No potable water refill points along trail; must pack sufficient supply',
                category: 'Supplies',
                status: 'VERIFIED',
              },
            ],
          },
          ja: {
            locale: 'ja',
            title: '乾季におけるカットコー3海岸断崖の安全横断ガイド（検証済み）',
            content: `カットコー3海岸トレイルは、カットバ島で最も息をのむような絶景を誇るトレッキングルートの一つです。花崗岩の崖沿いに約2.8km続き、ランハ湾のエメラルドの海を見渡せます。

### 1. 推奨される出発時間
気温が上がる前、かつ干潮が始まる午前06:30〜08:30の出発が最適です。日没後は足元が急速に暗くなり、夕方の満潮で足元のルートが水没する危険があるため、16:00以降の出発は避けてください。

### 2. 必須の標準装備
- グリップ力の高いビブラムソール等の登山靴またはウォーターシューズ。
- 最低1.5Lの飲料水と行動食。
- 携帯電話や貴重品用の防水ドライバッグ。
- 擦り傷や切り傷に対応できる基本的なファーストエイドキット。

### 3. 現地の安全に関する注意点
- Km 1.4付近の岩礁では、干潮時に露出する海苔や苔により足元が滑りやすくなります。3点支持を保ち慎重に進んでください。
- **安全に関する注意事項：**「絶対に安全な場所」は存在しません。すべての登山者は自己の責任において判断し行動してください。`,
            scope: 'トレイルの地形、Km 1.4地点の断崖、および飲料水アクセスの現地確認',
            inspectorNotes: 'ホアン検査官が2026年4月30日に実地審査を実施。ルートの通行可能性を確認し、Km 1.4の苔に関する注意喚起は妥当と判定。',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c01',
                text: 'カットコー3ビーチからドルフィン岬までの実測距離は約2.8km',
                category: '地形',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c02',
                text: '平均所要時間は継続的な歩行で90〜120分程度',
                category: '所要時間',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c03',
                text: '道中に給水ポイントなし。出発前に十分な飲料水の携行が必要',
                category: '補給',
                status: 'VERIFIED',
              },
            ],
          },
          'zh-Hans': {
            locale: 'zh-Hans',
            title: '旱季安全穿越吉古3号湾沿海岩壁实地指南（已核实）',
            content: `吉古3号湾沿海步道是吉婆岛最具探险魅力的海岸徒步线路之一。全程约2.8公里，依附于花岗岩峭壁之上，直面壮丽的兰哈湾。

### 1. 最佳启程时间
建议在早晨06:30至08:30之间出发，此时气温凉爽且正值退潮开始阶段。切勿在下午16:00之后出发，日落后岩壁视线受阻极快，且傍晚涨潮会淹没崖底通道。

### 2. 必备基础装备
- 具有良好防滑抓地力的登山鞋或溯溪鞋（推荐Vibram大底或同级防滑底）。
- 至少1.5升饮用水及高能便携食品。
- 保护通讯设备与随身证件的防水密封袋。
- 基础急救包（包含医用纱布及消毒杀菌药剂）。

### 3. 实地安全预警
- Km 1.4处突出的海蚀岩角在退潮时附着湿滑海苔，通过该路段时请放慢脚步并保持三点接触。
- **特别声明：** 任何自然环境均不存在所谓“绝对安全”。每位徒步者均须对自身的路线选择及实地观察承担最终责任。`,
            scope: '实地核验沿海步道地形、Km 1.4断崖通行状况及淡水补给可行性',
            inspectorNotes: '实地专家黄护林员于2026年4月30日完成现场审查。步道基本畅通，Km 1.4处海苔湿滑风险警示准确有效。',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c01',
                text: '从吉古3号沙滩至海豚岬的实测全长约为2.8公里',
                category: '地形',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c02',
                text: '匀速徒步平均耗时约为90至120分钟',
                category: '时间',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c03',
                text: '沿途无可用淡水补给点，出发前必须携带充足饮用水',
                category: '补给',
                status: 'VERIFIED',
              },
            ],
          },
          ko: {
            locale: 'ko',
            title: '건기 깟꼬 3 해안 절벽 안전 횡단 실전 가이드 (검증 완료)',
            content: `깟꼬 3 해안로는 깟바섬에서 가장 장엄한 풍경을 자랑하는 해안 트레킹 코스 중 하나입니다. 약 2.8km 길이의 화강암 절벽을 따라 란하만을 한눈에 굽어볼 수 있습니다.

### 1. 권장 출발 시간
기온이 오르기 전이자 썰물이 시작되는 오전 06:30 ~ 08:30 사이에 출발하는 것이 가장 좋습니다. 일몰 후에는 바위가 급격히 어두워지고 만조 시 바위 아래 트레일이 잠길 수 있으므로 오후 16:00 이후 출발은 삼가십시오.

### 2. 필수 기본 장비
- 바위 접지력이 우수한 등산화 또는 계곡 트레킹화 (비브람 솔 권장).
- 최소 1.5리터 이상의 식수와 비상 행동식.
- 휴대전화 및 귀중품을 보호할 수 있는 방수팩.
- 거즈와 소독약이 포함된 기본 응급처치 키트.

### 3. 현장 안전 주의사항
- Km 1.4 지점의 암초는 썰물 때 이끼로 인해 매우 미끄럽습니다. 세 지점 지지(3-point contact)를 유지하며 천천히 이동하십시오.
- **안전 주의사항:** 세상에 "절대적으로 안전한 장소"는 존재하지 않습니다. 모든 탐방객은 자신의 안전과 이동 판단에 스스로 책임을 집니다.`,
            scope: '트레일 지형, Km 1.4 암벽 노두 및 식수 확보 가능 여부 현장 실사',
            inspectorNotes: '황 삼림관이 2026년 4월 30일 현장 실사를 완료했습니다. 트레일 통행이 양호하며 Km 1.4의 이끼 주의 경고가 타당함을 확인했습니다.',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c01',
                text: '깟꼬 3 해변부터 돌고래 곶까지의 실제 거리는 약 2.8km',
                category: '지형',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c02',
                text: '일정한 속보 기준 평균 소요 시간은 90분 ~ 120분',
                category: '소요시간',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c03',
                text: '트레일 중간에 식수 보급처가 없으므로 출발 전 충분한 지참 필수',
                category: '보급',
                status: 'VERIFIED',
              },
            ],
          },
          fr: {
            locale: 'fr',
            title: 'Guide pratique pour franchir les falaises côtières de Cat Co 3 en saison sèche (Vérifié)',
            content: `Le sentier côtier de Cat Co 3 offre l’une des randonnées les plus spectaculaires de l’île de Cat Ba. Le tracé d’environ 2,8 km serpente à flanc de falaises de granit surplombant la baie de Lan Ha.

### 1. Horaires de départ recommandés
Prenez le départ entre 06h30 et 08h30 avant les fortes chaleurs et au début de la marée descendante. Évitez tout départ après 16h00 : la roche s’assombrit très vite au crépuscule et la marée montante peut submerger le sentier au pied de la falaise.

### 2. Équipement obligatoire recommandé
- Chaussures de marche ou de canyoning à semelle crantée adhérente (type Vibram).
- Au moins 1,5 litre d’eau potable et des en-cas énergétiques.
- Sac étanche pour protéger téléphone et documents personnels.
- Trousse de premiers secours avec pansements et désinfectant.

### 3. Avertissements terrain essentiels
- Au niveau de l’éperon rocheux du km 1,4, des algues glissantes recouvrent la roche mouillée à marée descendante. Ralentissez et maintenez trois points d’appui.
- **Avis de sécurité :** Aucun itinéraire sauvage n’est « absolument sûr ». Chaque randonneur demeure pleinement responsable de ses choix et de son observation sur le terrain.`,
            scope: 'Inspection de terrain du sentier, de l’éperon rocheux au km 1,4 et de l’accès à l’eau potable',
            inspectorNotes: 'L’auditeur Hoang Ranger a validé le terrain le 30 avril 2026. Passage praticable et mise en garde sur les algues au km 1,4 confirmée.',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c01',
                text: 'Longueur réelle de 2,8 km de la plage de Cat Co 3 au Cap du Dauphin',
                category: 'Terrain',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c02',
                text: 'Temps de marche moyen estimé entre 90 et 120 minutes sans interruption',
                category: 'Durée',
                status: 'VERIFIED',
              },
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c03',
                text: 'Aucun point d’eau douce sur l’itinéraire ; autonomie requise dès le départ',
                category: 'Ravitaillement',
                status: 'VERIFIED',
              },
            ],
          },
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
        coverImageUrl: '/destinations/co-to.svg',
        translations: {
          en: {
            locale: 'en',
            title: 'Sunrise Experience at Dragon Claw Cliffs, Co To Island',
            content: `Watching the sunrise from Dragon Claw Cliffs is among the most breathtaking experiences on Co To Island. Stratified sedimentary rock strata sweep like dragon talons reaching into the open sea to greet the dawn's earliest rays.

### Field Observations:
- Early morning offshore sea winds are intense; windbreaker jacket recommended.
- Cliff steps are steep with loose gravel in sections; secure each footstep carefully.
- **Publication Status:** This is a personal field observation not independently verified by an accredited expert. Travelers should review local authority alerts before setting out.`,
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c10',
                text: 'Sunrise is clearly visible from the cliffs at approximately 05:20 AM in summer',
                category: 'Natural Event',
                status: 'UNVERIFIED',
              },
            ],
          },
          ja: {
            locale: 'ja',
            title: 'コトー島・ドラゴンクロー断崖での日の出体験',
            content: `ドラゴンクロー断崖（モングロン）の日の出は、コトー島で最も壮大な絶景の一つです。幾重にも重なる堆積岩層が竜の爪のように外海へと伸び、最初の陽光を迎えます。

### 現地での観察所見：
- 早朝は海風が非常に強いため、軽量ウィンドブレーカーの携行を推奨。
- 岩段の傾斜が険しく、砂粒で滑りやすい箇所があります。三点確保で慎重に進んでください。
- **投稿ステータス：** 本稿は寄稿者による個人の実地記録であり、独立した専門家による検証は受けていません。出発前に現地の最新注意情報をご確認ください。`,
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c10',
                text: '夏季の午前5時20分頃、断崖から日の出が鮮明に確認できる',
                category: '自然現象',
                status: 'UNVERIFIED',
              },
            ],
          },
          'zh-Hans': {
            locale: 'zh-Hans',
            title: '姑苏岛龙爪绝壁日出观赏实地体验',
            content: `在龙爪绝壁（Móng Rồng）迎接破晓是姑苏岛最令人震撼的体验之一。层叠弯曲的沉积岩层宛如探入大海的龙爪，迎接清晨的第一缕曙光。

### 实地考察感触：
- 清晨海风凛冽，强烈建议携带轻便防风衣。
- 岩石层阶陡峭，部分路面碎砂易滑，行走时务必步步踏实。
- **审核状态声明：** 本记录为行者个人考察手记，尚未经独立专业人员实地复核。出行前请务必参考当地主管部门的最新安全公告。`,
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c10',
                text: '夏季清晨约05:20可自悬崖处清晰观赏日出全貌',
                category: '自然现象',
                status: 'UNVERIFIED',
              },
            ],
          },
          ko: {
            locale: 'ko',
            title: '꼬또섬 드래곤 클로 절벽 일출 감상 실측 기록',
            content: `드래곤 클로(몽롱) 절벽에서 맞이하는 일출은 꼬또섬에서 가장 경이로운 순간 중 하나입니다. 용의 발톱처럼 바다로 뻗어나간 퇴적암 층리가 아침 첫 햇살을 맞이합니다.

### 현장 관측 사항：
- 새벽 바닷바람이 매우 강하므로 가벼운 방풍 재킷 지참 필수.
- 바위 계단 경사가 가파르고 잔모래로 미끄러운 구간이 있으므로 발걸음을 안정적으로 내딛으세요.
- **게시글 상태 안내：** 이 글은 개인적인 탐방 기록으로 공인 전문가의 독립적 검증을 거치지 않았습니다. 출발 전 현지 당국의 안전 권고를 반드시 확인하세요。`,
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c10',
                text: '여름철 오전 5시 20분경 절벽에서 일출을 선명하게 관측 가능',
                category: '자연 현상',
                status: 'UNVERIFIED',
              },
            ],
          },
          fr: {
            locale: 'fr',
            title: 'Expérience du lever de soleil sur les falaises de la Griffe du Dragon à Cô Tô',
            content: `Le lever de soleil aux falaises de la Griffe du Dragon (Móng Rồng) est l’un des moments les plus spectaculaires de l’île de Cô Tô. Les strates rocheuses incurvées s’étirent comme les griffes d’un dragon vers le large pour accueillir les premières lueurs du jour.

### Observations de terrain :
- Vents marins matinaux très violents : coupe-vent léger indispensable.
- Paliers rocheux escarpés avec gravillons glissants ; progressez avec appuis assurés.
- **Statut de publication :** Il s’agit d’un compte rendu personnel non vérifié de manière indépendante par un auditeur agréé. Veuillez consulter les avis des autorités locales avant tout départ.`,
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c10',
                text: 'Lever de soleil visible distinctement depuis les falaises vers 05h20 en été',
                category: 'Phénomène naturel',
                status: 'UNVERIFIED',
              },
            ],
          },
        },
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
        coverImageUrl: '/destinations/tay-con-linh.svg',
        translations: {
          en: {
            locale: 'en',
            title: 'Winter Ascent along Tay Con Linh Trails (Expired Audit)',
            content: `Nighttime temperatures on Tay Con Linh during winter can plummet below 4°C. Trails are heavily covered in slippery moss with fragile branches broken after severe hail.

**AUDIT VALIDITY NOTICE:**
The independent verification certification for this revision expired on December 31, 2025. Due to storm damage and subsequent landslides during the recent rainy season, trail conditions may have changed substantially compared to this report. Please consult local mountain guides before departing.`,
            scope: 'Evaluation of winter conditions and camp establishment at 2,000m elevation',
            inspectorNotes: 'Certification was strictly valid for the 2025 hiking season. Re-audit mandatory following the 2026 monsoon.',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c20',
                text: 'Campground at 2000m has reliable underground water source during 2025 dry season',
                category: 'Water Source',
                status: 'EXPIRED',
              },
            ],
          },
          ja: {
            locale: 'ja',
            title: '冬季タイコンリン稜線越えトレイル（検証期限切れ）',
            content: `冬季のタイコンリン峰は夜間気温が4度未満に急低下することがあります。トレイルは滑りやすい苔に覆われ、降雹後の倒木や脆い枝が散見されます。

**検証有効期限に関する重要通知：**
本改訂版の実地検証証明は2025年12月31日をもって有効期限が切れています。直近の雨季における暴風雨や土砂崩れの影響により、実際の路面状況は本資料から大きく変化している可能性があります。出発前に現地の山岳ガイドへ必ず最新状況をお問い合わせください。`,
            scope: '標高2,000m地点における冬季気象条件およびキャンプ適地の調査評価',
            inspectorNotes: '2025年登山シーズンに限り有効と判定。2026年雨季終了後に再度の実地検証が必須。',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c20',
                text: '2025年乾季において標高2000m野営地に安定した地下水源が存在する',
                category: '水源',
                status: 'EXPIRED',
              },
            ],
          },
          'zh-Hans': {
            locale: 'zh-Hans',
            title: '西昆岭冬季穿越路线考察手记（核验已过期）',
            content: `冬季西昆岭夜间气温可骤降至4摄氏度以下。石径密布湿滑青苔，冰雹灾害后残留诸多折断朽木。

**核验时效预警：**
本版本的独立实地核验认证已于2025年12月31日届满失效。受近期雨季风暴与滑坡影响，现场实际路线状况可能已较本报告发生重大变更。启程前请务必联系当地资深向导获取最新情报。`,
            scope: '海拔2000米营地评估与冬季严寒气候风险排查',
            inspectorNotes: '该核验证书仅对2025年登山季有效。2026年雨季后必须重新组织实地勘测。',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c20',
                text: '2025年旱季期间海拔2000米营地具备稳定地下水源',
                category: '水源',
                status: 'EXPIRED',
              },
            ],
          },
          ko: {
            locale: 'ko',
            title: '겨울철 떠이꼰린 능선 횡단 여정 (검증 기한 만료)',
            content: `겨울철 떠이꼰린의 야간 기온은 4도 이하로 떨어질 수 있습니다. 등산로는 미끄러운 이끼로 덮여 있으며 우박 후 부러진 나뭇가지들이 방치되어 있습니다.

**검증 유효기간 경고:**
본 리비전에 대한 독립 현장 검증 인증은 2025년 12월 31일부로 만료되었습니다. 지난 우기 태풍 및 산사태의 영향으로 실제 트레일 상태는 이 보고서와 크게 달라졌을 수 있습니다. 출발 전 반드시 현지 가이드에게 최신 상황을 문의하세요.`,
            scope: '해발 2,000m 야영지 평가 및 겨울철 기후 조건 조사',
            inspectorNotes: '인증은 2025년 등반 시즌에 한해 유효함. 2026년 우기 이후 현장 재검토 필수.',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c20',
                text: '2025년 건기 동안 해발 2000m 야영지에 안정적인 지하수원이 존재함',
                category: '식수원',
                status: 'EXPIRED',
              },
            ],
          },
          fr: {
            locale: 'fr',
            title: 'Traversée hivernale des crêtes de Tay Con Linh (Vérification expirée)',
            content: `En hiver sur le Tay Con Linh, les températures nocturnes peuvent chuter sous les 4°C. Le sentier est envahi de mousses glissantes et jonché de branchages cassés après de violentes averses de grêle.

**AVIS DE VALIDITÉ DE L’AUDIT :**
La certification de vérification indépendante pour cette révision est expirée depuis le 31 décembre 2025. Sous l’impact des récentes tempêtes et éboulements de la dernière saison des pluies, l’état réel du sentier peut avoir considérablement évolué. Consultez impérativement les guides locaux avant de vous engager.`,
            scope: 'Évaluation des conditions hivernales et de la zone de bivouac à 2 000 m d’altitude',
            inspectorNotes: 'Certification valable uniquement pour la saison 2025. Nouvel audit terrain impératif après la mousson 2026.',
            claims: [
              {
                claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c20',
                text: 'Point d’eau souterrain stable au camp des 2000m durant la saison sèche 2025',
                category: 'Point d’eau',
                status: 'EXPIRED',
              },
            ],
          },
        },
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
        title: 'Khảo sát luồng lạch & điểm neo thuyền hoang sơ vịnh Lan Hạ (VIP)',
        content: `[NỘI DUNG ĐẶC QUYỀN VIP ĐÃ MỞ KHÓA CHO HỘI VIÊN]

Tọa độ chính xác điểm neo thuyền kín gió: 20°43'06.2"N 107°03'05.1"E.
Khu vực vụng kín nằm phía sau cụm đảo đá vôi, được che chắn hoàn toàn khỏi gió mùa đông bắc và sóng lớn.

### Hướng dẫn tiếp cận luồng lạch:
- Từ phao số 0 Vịnh Lan Hạ, bẻ lái hướng 115 độ, giữ khoảng cách tối thiểu 40m với vách đá ngầm phía đông.
- Luồng lạch có độ sâu đáy bùn cát từ 3.2m đến 6.5m khi triều kiệt, thích hợp cho thuyền buồm và kayak thám hiểm thả neo an toàn.
- Có nguồn nước ngọt rỉ tự nhiên từ khe đá tại vách phía tây.`,
        observedAt: '2026-05-10T14:30:00Z',
        accessTier: AccessTier.VIP,
        verificationStatus: VerificationStatus.VERIFIED,
        checkedAt: '2026-05-20T10:00:00Z',
        validUntil: '2027-05-20T23:59:59Z',
        scope: 'Khảo sát độ sâu luồng lạch và độ an toàn của điểm neo thuyền hoang sơ',
        inspectorNotes: 'Đã đối chiếu hải đồ độ sâu và kiểm tra độ khuất gió của vụng trong điều kiện thực địa.',
        claims: [
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c30',
            text: 'Độ sâu luồng lạch duy trì tối thiểu 3.2m khi triều kiệt',
            category: 'Độ sâu an toàn',
            status: 'VERIFIED',
          },
          {
            claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5c31',
            text: 'Điểm neo khuất gió đông bắc và sóng cồn quanh năm',
            category: 'Điều kiện neo đậu',
            status: 'VERIFIED',
          },
        ],
        sources: [
          { title: 'Hải đồ và khảo sát trắc địa đáy biển - Minh Trailguide (10/05/2026)' },
        ],
        tipRoute: {
          routeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5r02',
          status: TipRouteStatus.ACTIVE,
          beneficiaryAddress: '0x88F...42C1',
        },
        coverImageUrl: '/destinations/hero-coastal.svg',
        translations: {
          en: {
            locale: 'en',
            title: 'Channel Survey & Secluded Anchorage in Lan Ha Bay (VIP)',
            content: `[EXCLUSIVE VIP EXPLORER CONTENT UNLOCKED]

Exact coordinates for sheltered anchorage: 20°43'06.2"N 107°03'05.1"E.
This secluded cove is tucked behind limestone karsts, completely protected from northeast monsoons and ocean swells.

### Channel Navigation Waypoints:
- From Lan Ha Bay Buoy 0, steer bearing 115 degrees, maintaining at least 40m clearance from the submerged eastern reef.
- The channel maintains sandy-mud depths between 3.2m and 6.5m at low tide, ideal for safe anchoring of sailboats and exploration kayaks.
- Natural fresh water seep found along the western cliff face.`,
            scope: 'Navigational depth survey and anchorage safety verification for secluded waters',
          },
          ja: {
            locale: 'ja',
            title: 'ランハ湾の未開航路および停泊ポイント調査（VIP限定）',
            content: `【VIP会員限定コンテンツ（閲覧権限確認済み）】

遮蔽停泊ポイントの正確なGNSS座標：北緯20°43'06.2" 東経107°03'05.1"。
石灰岩カルストの背後に位置する隠れ入り江で、北東モンスーンや高波から完全に遮断されています。

### 航路進入ガイド：
- ランハ湾ブイ0番から方位115度へ操舵し、東側の暗礁から最低40mの距離を確保してください。
- 干潮時でも水深3.2m〜6.5m（砂泥底）を維持し、ヨットやシーカヤックの安全な停泊に適しています。
- 西側の崖の裂け目から自然の淡水が湧出しています。`,
            scope: '未開水域の航路水深測量および停泊地安全性の検証',
          },
          'zh-Hans': {
            locale: 'zh-Hans',
            title: '兰哈湾隐秘航道与避风锚泊点考察（VIP专属）',
            content: `【VIP探险会员专属内容（已解锁）】

避风锚泊点精细GNSS坐标：北纬 20°43'06.2"，东经 107°03'05.1"。
该隐秘小湾隐蔽于喀斯特石灰岩群峰之后，完全免受东北季风和巨浪侵袭。

### 进港航道导引：
- 从兰哈湾0号航标取航向115度进发，与东侧暗礁保持至少40米安全间距。
- 航道在退潮时泥沙底深度保持在3.2米至6.5米之间，非常适合帆船与探险皮划艇安全抛锚。
- 西侧绝壁裂隙处有天然淡水渗出点。`,
            scope: '隐秘水域通航水深测绘与锚地安全性核验',
          },
          ko: {
            locale: 'ko',
            title: '란하베이 미개척 수로 및 은밀한 정박지 실사 (VIP 전용)',
            content: `[VIP 탐험 회원 전용 콘텐츠 (잠금 해제됨)]

안전 정박지 정밀 GNSS 좌표: 북위 20°43'06.2", 동경 107°03'05.1".
석회암 카르스트 뒤편에 숨겨진 만으로, 북동 계절풍과 거친 파도로부터 완벽히 보호됩니다.

### 진입 수로 가이드:
- 란하베이 0번 부표에서 115도 방위각으로 조타하며, 동쪽 암초로부터 최소 40m 안전 거리를 유지하십시오.
- 썰물 시에도 3.2m ~ 6.5m의 사질점토 수심을 유지하여 요트 및 탐험 카약의 안전한 정박에 적합합니다.
- 서쪽 암벽 틈새에서 천연 담수가 용출됩니다.`,
            scope: '은밀 수역 항로 수심 측량 및 정박지 안전성 검증',
          },
          fr: {
            locale: 'fr',
            title: 'Relevé des chenaux et mouillage sauvage de la baie de Lan Ha (VIP)',
            content: `[CONTENU EXCLUSIF MEMBRES EXPLORATEURS VIP DÉBLOQUÉ]

Coordonnées GNSS exactes du mouillage abrité : 20°43'06.2"N 107°03'05.1"E.
Cette crique isolée est abritée derrière des pitons karstiques, totalement protégée de la mousson du nord-est et de la houle.

### Instructions de navigation dans le chenal :
- Depuis la bouée 0 de la baie de Lan Ha, cap au 115°, maintenir une distance minimale de 40 m du récif oriental immergé.
- Le chenal présente des fonds sableux et vaseux de 3,2 m à 6,5 m à marée basse, idéal pour le mouillage sécurisé de voiliers et kayaks.
- Résurgence naturelle d'eau douce située le long de la falaise ouest.`,
            scope: 'Sondage bathymétrique et vérification de sécurité du mouillage en zone isolée',
          },
        },
      },
      revisionsList: [
        {
          revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e41',
          displayCode: 'REV-000006',
          versionNumber: 1,
          title: 'Khảo sát luồng lạch & điểm neo thuyền hoang sơ vịnh Lan Hạ (VIP)',
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
          title: 'Khảo sát luồng lạch & điểm neo thuyền hoang sơ vịnh Lan Hạ (VIP)',
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
    hoang_ranger: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07',
      handle: 'hoang_ranger',
      displayName: 'Hoàng Kiểm Lâm Viên',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      bio: 'Kiểm lâm viên phụ trách an toàn địa hình và đường mòn tự nhiên vùng Đông Bắc. 12 năm kinh nghiệm quản lý tuyến rừng đặc dụng và thẩm định thực địa.',
      joinedAt: '2023-08-10T00:00:00Z',
      credentials: [
        {
          credentialId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e72',
          title: 'Chứng nhận Chuyên Gia Thẩm Định Thực Địa (Expert Reviewer)',
          badgeType: 'CONTRIBUTOR_SBT',
          issuedAt: '2024-05-12T10:00:00Z',
          tokenId: '5829104819204913',
        },
      ],
      publishedPosts: [
        {
          postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
          displayCode: 'PST-000001',
          placeName: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
          title: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng (Thẩm định viên)',
          verificationStatus: VerificationStatus.VERIFIED,
          observedAt: '2026-04-15T08:00:00Z',
        },
      ],
    },
    an_vip_explorer: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e06',
      handle: 'an_vip_explorer',
      displayName: 'An Thám Hiểm VIP',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      bio: 'Thành viên đóng góp thường niên cho quỹ khám phá và bảo tồn Ventlore. Đam mê trekking mạo hiểm và khảo sát hang động.',
      joinedAt: '2025-01-01T00:00:00Z',
      credentials: [],
      publishedPosts: [],
    },
    guest_reader: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e00',
      handle: 'guest_reader',
      displayName: 'Khách Khám Phá',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      bio: 'Độc giả tự do tìm hiểu thông tin địa điểm và bài viết trên nền tảng Ventlore.',
      joinedAt: '2026-09-01T00:00:00Z',
      credentials: [],
      publishedPosts: [],
    },
    linh_admin: {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e08',
      handle: 'linh_admin',
      displayName: 'Linh Quản Trị Viên',
      avatarUrl: '/brand/Ventlore_Avatar_Forest.png',
      bio: 'Điều phối viên nền tảng Ventlore và giám sát quy trình thẩm định thực địa độc lập.',
      joinedAt: '2024-01-01T00:00:00Z',
      credentials: [
        {
          credentialId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e75',
          title: 'Chứng nhận Quản Trị Hệ Thống (Operator Certificate)',
          badgeType: 'OPERATOR_CREDENTIAL',
          issuedAt: '2024-01-01T00:00:00Z',
          tokenId: '1000000000000001',
        },
      ],
      publishedPosts: [],
    },
  };

  // VIP plan multi-lingual translations
  private vipPlanTranslations: Record<string, { name: string; benefits: string[] }> = {
    vi: {
      name: 'Gói Hội Viên Khám Phá Thường Niên (12 Tháng)',
      benefits: [
        'Truy cập các báo cáo khảo sát trắc địa chuyên sâu, lịch sử địa chất và phân tích thực địa nâng cao',
        'Tài liệu hướng dẫn thực địa chi tiết và các phân tích địa hình được chuyên gia chuẩn hóa',
        'Huy hiệu Hội viên VIP hỗ trợ quỹ thẩm định an toàn cộng đồng',
        'Thời hạn 12 tháng lịch UTC tính từ lúc kích hoạt; gia hạn chủ động, không tự động trừ tiền',
      ],
    },
    en: {
      name: 'Annual Wilderness Explorer Membership (12 Months)',
      benefits: [
        'Full access to advanced geodetic surveys, geological formations, and specialized field reports',
        'Curated field documentation and terrain analysis standardized by accredited guides',
        'Exclusive VIP Member badge supporting independent community safety audits',
        'Valid for 12 UTC calendar months from activation; proactive manual renewal with zero auto-charge',
      ],
    },
    ja: {
      name: '年間探検家メンバーシップ（12ヶ月）',
      benefits: [
        '詳細な測地測量レポート、地質構造履歴、および高度な現地実地分析へのアクセス',
        '認定現地ガイドが標準化した詳細な現地ガイド資料と地形分析',
        'コミュニティの独立安全検証基金を支えるVIP会員バッジ',
        '有効化から12ヶ月間のUTC暦年有効。自動引き落としなしの手動更新ポリシー',
      ],
    },
    'zh-Hans': {
      name: '年度荒野探险者会员计划（12个月）',
      benefits: [
        '完整查阅高精度大地测量报告、地层地质历史及高级实地考察手记',
        '经过持证专家标准化的精细实地指导文档与地形分析',
        '专属 VIP 会员徽章，全额支持社区独立安全审核储备基金',
        '自激活起生效 12 个 UTC 自然月；到期由用户自主续费，绝无自动扣款',
      ],
    },
    ko: {
      name: '연간 황야 탐험가 멤버십 (12개월)',
      benefits: [
        '정밀 측지 측량 보고서, 지층 형성사 및 심층 현장 조사 기록 열람',
        '공인 현지 가이드가 표준화한 상세 현장 안내 문서 및 지형 분석 자료',
        '커뮤니티 독립 안전 검증 기금을 지원하는 전용 VIP 회원 뱃지',
        '활성화 시점부터 12개월 UTC 달력 기준 유효; 자동 결제 없는 수동 갱신',
      ],
    },
    fr: {
      name: 'Adhésion Annuelle Explorateur Sauvage (12 Mois)',
      benefits: [
        'Accès complet aux relevés géodésiques approfondis, formations géologiques et analyses terrain avancées',
        'Documentation de terrain détaillée et analyses topographiques standardisées par des guides agréés',
        'Badge exclusif de membre VIP soutenant le fonds d’audit indépendant de sécurité communautaire',
        'Valable 12 mois civils UTC à compter de l’activation ; renouvellement manuel proactif sans prélèvement automatique',
      ],
    },
  };

  // VIP plans fixture
  private vipPlans: VipPlanDTO[] = [
    {
      planCode: 'VIP_ANNUAL',
      name: 'Gói Hội Viên Khám Phá Thường Niên (12 Tháng)',
      priceUsdCents: 1500, // 15 USD = 1500 USD cents
      termMonths: 12,
      benefits: [
        'Truy cập các báo cáo khảo sát trắc địa chuyên sâu, lịch sử địa chất và phân tích thực địa nâng cao',
        'Tài liệu hướng dẫn thực địa chi tiết và các phân tích địa hình được chuyên gia chuẩn hóa',
        'Huy hiệu Hội viên VIP hỗ trợ quỹ thẩm định an toàn cộng đồng',
        'Thời hạn 12 tháng lịch UTC tính từ lúc kích hoạt; gia hạn chủ động, không tự động trừ tiền',
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
    locale?: string;
    includeMerged?: boolean;
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

    // Invariant: MERGED places are never displayed as standalone primary destination cards in listPlaces,
    // even when a search query matches them.
    if (!params?.includeMerged) {
      filtered = filtered.filter(p => p.status !== PlaceStatus.MERGED);
    }

    if (params?.query) {
      const qNorm = normalizeSearchText(params.query);
      filtered = filtered.filter(p => {
        const matchName = normalizeSearchText(p.name).includes(qNorm);
        const matchSummary = normalizeSearchText(p.summary).includes(qNorm);
        const matchRegion = normalizeSearchText(p.regionName).includes(qNorm);
        const matchActivities = p.activities.some(a => normalizeSearchText(a).includes(qNorm));
        let matchTranslations = false;
        if (p.translations) {
          for (const trans of Object.values(p.translations)) {
            if (
              normalizeSearchText(trans.name).includes(qNorm) ||
              normalizeSearchText(trans.summary).includes(qNorm) ||
              normalizeSearchText(trans.regionName).includes(qNorm)
            ) {
              matchTranslations = true;
              break;
            }
          }
        }
        return matchName || matchSummary || matchRegion || matchActivities || matchTranslations;
      });
    }

    if (params?.regionId && params.regionId !== 'all') {
      filtered = filtered.filter(p => p.regionId === params.regionId);
    }

    if (params?.activity && params.activity !== 'all') {
      const actNorm = normalizeSearchText(params.activity);
      filtered = filtered.filter(p =>
        p.activities.some(a => normalizeSearchText(a).includes(actNorm))
      );
    }

    const targetLocale = params?.locale;
    const items: PlaceSummaryDTO[] = filtered.map(p => {
      const cover = p.coverImageUrl || (p as any).imageUrl || '/destinations/hero-coastal.svg';
      if (targetLocale && p.translations && p.translations[targetLocale]) {
        const t = p.translations[targetLocale];
        return {
          ...p,
          name: t.name ?? p.name,
          summary: t.summary ?? p.summary,
          regionName: t.regionName ?? p.regionName,
          warnings: t.warnings ?? p.warnings,
          activities: t.activities ?? p.activities,
          coverImageUrl: cover,
          imageUrl: cover,
          isTranslated: true,
          originalLocale: 'vi',
        };
      }
      return {
        ...p,
        coverImageUrl: cover,
        imageUrl: cover,
        isTranslated: targetLocale === 'vi' || !targetLocale,
        originalLocale: 'vi',
      };
    });

    return {
      items,
      nextCursor: null,
      total: items.length,
    };
  }

  async getPlace(placeId: string, locale?: string): Promise<PlaceDetailDTO | null> {
    const rawPlace = this.places.find(p => p.placeId === placeId || p.displayCode === placeId);
    if (!rawPlace) return null;

    // Check candidate visibility
    if (rawPlace.status === PlaceStatus.CANDIDATE) {
      const session = await this.getSession();
      const canSee =
        session.capabilities.includes('can_review_tasks') ||
        session.capabilities.includes('can_propose_place');
      if (!canSee) return null;
    }

    const place: PlaceDetailDTO = JSON.parse(JSON.stringify(rawPlace));
    const cover = place.coverImageUrl || (place as any).imageUrl || '/destinations/hero-coastal.svg';
    place.coverImageUrl = cover;
    place.imageUrl = cover;

    if (locale && place.translations && place.translations[locale]) {
      const t = place.translations[locale];
      place.name = t.name ?? place.name;
      place.summary = t.summary ?? place.summary;
      place.description = t.description ?? place.description;
      place.regionName = t.regionName ?? place.regionName;
      if (t.warnings) {
        place.warnings = t.warnings;
      }
      if (t.activities) {
        place.activities = t.activities;
      }
      place.isTranslated = true;
      place.originalLocale = 'vi';
    } else {
      place.isTranslated = locale === 'vi' || !locale;
      place.originalLocale = 'vi';
    }

    // Translate post titles on destination cards if available
    if (place.posts && place.posts.length > 0 && locale && locale !== 'vi') {
      place.posts = place.posts.map(p => {
        const postEntry = this.posts[p.postId];
        const transTitle = postEntry?.revision?.translations?.[locale]?.title;
        if (transTitle) {
          return {
            ...p,
            currentRevision: {
              ...p.currentRevision,
              title: transTitle,
            },
          };
        }
        return p;
      });
    }

    return place;
  }

  async getPost(postId: string, revisionId?: string, locale?: string): Promise<PostDetailDTO | null> {
    const postEntry = Object.values(this.posts).find(p => p.postId === postId || p.displayCode === postId);
    if (!postEntry) return null;

    const session = await this.getSession();
    const isVipUser = session.membership?.isActive === true;

    // Deep clone to safely manipulate revision data without mutating source fixture
    const result: PostDetailDTO = JSON.parse(JSON.stringify(postEntry));

    // If specific revision requested, load that revision
    if (revisionId) {
      // Validate that revisionId exists in the post's revision list
      const isKnownRevision = postEntry.revisionsList.some(
        (r) => r.revisionId === revisionId || r.displayCode === revisionId
      );
      if (!isKnownRevision) {
        // Unknown or non-matching revision -> return null to show distinct revision not found state
        return null;
      }

      if (revisionId !== postEntry.currentRevisionId && revisionId !== postEntry.revision.displayCode) {
        // Find revision from fixtures or generate specific revision data
        if (result.postId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10') {
          if (revisionId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e11' || revisionId === 'REV-000001') {
            // Revision 1: UNVERIFIED
            result.revision = {
              revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e11',
              displayCode: 'REV-000001',
              postId: result.postId,
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
          } else if (revisionId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e13' || revisionId === 'REV-000003') {
            // Revision 3: NEEDS_CHANGES
            result.revision = {
              revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e13',
              displayCode: 'REV-000003',
              postId: result.postId,
              parentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
              versionNumber: 3,
              title: 'Cập nhật sạt lở mùa mưa tại vách Cát Cò 3 (Yêu cầu chỉnh sửa)',
              content: 'Bản cập nhật ngày 20/08/2026 ghi nhận sạt lở đá tảng tại km số 3 chắn ngang đường mòn cũ. Đang chờ tác giả bổ sung lộ trình đi vòng qua đỉnh đồi.\n\n### 1. Hiện trạng thực địa\nKhối đá sạt lở dài khoảng 10 mét chắn ngang mép nước. Nước biển dâng cao khiến việc lội qua mỏm đá có nguy cơ trượt chân xuống vực xoáy.\n\n### 2. Yêu cầu an toàn bổ sung\nTác giả cần trực tiếp khảo sát lối rẽ phía rừng cây bên sườn đồi để cung cấp đường đi thay thế an toàn cho cộng đồng.',
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
      result.currentRevisionId = result.revision.revisionId;
    }

    // Translate post content if translation exists for target locale
    if (locale && result.revision.translations && result.revision.translations[locale]) {
      const t = result.revision.translations[locale];
      result.revision.title = t.title ?? result.revision.title;
      result.revision.content = t.content ?? result.revision.content;
      if (t.scope) result.revision.scope = t.scope;
      if (t.inspectorNotes) result.revision.inspectorNotes = t.inspectorNotes;
      if (t.claims) result.revision.claims = t.claims;
      result.revision.isTranslated = true;
      result.revision.originalLocale = 'vi';
    } else {
      result.revision.isTranslated = locale === 'vi' || !locale;
      result.revision.originalLocale = 'vi';
    }

    // Translate place details if available
    const rawPlace = this.places.find(p => p.placeId === result.placeId);
    if (rawPlace && locale && rawPlace.translations && rawPlace.translations[locale]) {
      const placeTrans = rawPlace.translations[locale];
      result.place.name = placeTrans.name ?? result.place.name;
      result.place.regionName = placeTrans.regionName ?? result.place.regionName;
    }

    // Translate author bio using SHARED_BIO_TRANSLATIONS to keep profile and post views aligned
    if (locale && locale !== 'vi') {
      const authorBio = SHARED_BIO_TRANSLATIONS[result.author.handle]?.[locale];
      if (authorBio) {
        result.author.bio = authorBio;
      }
    }

    // Translate revisions list titles if translations exist
    if (locale && locale !== 'vi') {
      result.revisionsList = result.revisionsList.map((rev) => {
        if (rev.revisionId === result.revision.revisionId && result.revision.isTranslated) {
          return { ...rev, title: result.revision.title };
        }
        return rev;
      });
    }

    // Security invariant: If post is VIP and user does not have active VIP membership,
    // REDACT content at the adapter level! DO NOT SEND VIP CONTENT TO CLIENT DOM!
    if (result.revision.accessTier === AccessTier.VIP && !isVipUser) {
      const redactMessages: Record<string, string> = {
        vi: 'Nội dung trắc địa chuyên sâu, phân tích địa tầng và tài liệu thực địa chi tiết là đặc quyền dành riêng cho Hội viên VIP. Vui lòng đăng nhập bằng tài khoản có gói VIP hoặc nâng cấp hội viên để mở khóa.',
        en: 'In-depth geodetic surveys, stratigraphic analyses, and specialized field reports are strictly reserved for VIP Members. Please sign in with an active VIP account or upgrade membership to unlock.',
        ja: '詳細な測地測量データ、地層地質分析、および高度な現地調査記録はVIP会員限定のコンテンツです。VIPアカウントでログインするか、会員プランをアップグレードしてください。',
        'zh-Hans': '深度大地测量数据、地层地质分析与高级实地考察手记为VIP会员专属特权。请使用有效VIP账号登录或升级会员以解锁。',
        ko: '정밀 측지 측량 데이터, 지층 지질 분석 및 전문 현장 조사 기록은 VIP 회원 전용 특권입니다. 활성화된 VIP 계정으로 로그인하거나 멤버십을 업그레이드하여 잠금을 해제하세요.',
        fr: 'Les relevés géodésiques approfondis, les analyses stratigraphiques et les rapports de terrain spécialisés sont réservés aux membres VIP. Veuillez vous connecter avec un compte VIP ou mettre à niveau votre adhésion.',
      };
      result.revision.content = (locale ? redactMessages[locale] : undefined) ?? redactMessages.vi ?? '';
      result.revision.isContentRedacted = true;
      result.revision.redactedReason = 'VIP_REQUIRED';
    }

    return result;
  }

  async getUserProfile(handleOrUserId: string, locale?: string): Promise<UserProfileDTO | null> {
    const rawProfile = Object.values(this.userProfiles).find(
      p => p.handle === handleOrUserId || p.userId === handleOrUserId
    );
    if (!rawProfile) return null;

    const profile: UserProfileDTO = JSON.parse(JSON.stringify(rawProfile));
    const targetLocale = locale || 'vi';

    if (targetLocale !== 'vi') {
      const translatedBio = SHARED_BIO_TRANSLATIONS[profile.handle]?.[targetLocale];
      if (translatedBio) {
        profile.bio = translatedBio;
        profile.isOriginalBio = false;
      } else {
        profile.isOriginalBio = true;
        profile.originalBioLanguage = 'vi';
      }

      const credentialTitles: Record<string, Record<string, string>> = {
        '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e71': {
          en: 'Gold Field Verification Badge (Contributor SBT)',
          ja: 'ゴールド実地検証バッジ（貢献者SBT）',
          'zh-Hans': '黄金实地核验徽章（贡献者SBT）',
          ko: '골드 현장 검증 뱃지 (기여자 SBT)',
          fr: 'Insigne d’or de vérification terrain (SBT Contributeur)',
        },
        '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e72': {
          en: 'Accredited Field Reviewer Certificate (Expert Reviewer)',
          ja: '認定実地検証スペシャリスト証明（エキスパートレビュアー）',
          'zh-Hans': '特聘实地核验专家认证（专业审核员）',
          ko: '공인 현장 검증 전문가 자격 (전문 검토자)',
          fr: 'Certificat d’Évaluateur de Terrain Agréé (Réviseur Expert)',
        },
      };

      profile.credentials = profile.credentials.map(cred => {
        const transTitle = credentialTitles[cred.credentialId]?.[targetLocale];
        return {
          ...cred,
          title: transTitle ?? cred.title,
        };
      });

      const postTitleTranslations: Record<string, Record<string, string>> = {
        '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20': {
          en: 'Sunrise Experience at Dragon Claw Cliffs, Co To Island',
          ja: 'コトー島・ドラゴンクロー断崖での日の出体験',
          'zh-Hans': '姑苏岛龙爪绝壁日出观赏实地体验',
          ko: '꼬또섬 드래곤 클로 절벽 일출 감상 실측 기록',
          fr: 'Expérience du lever de soleil sur les falaises de la Griffe du Dragon à Cô Tô',
        },
        '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30': {
          en: 'Winter Ascent along Tay Con Linh Trails (Expired Audit)',
          ja: '冬季タイコンリン稜線越えトレイル（検証期限切れ）',
          'zh-Hans': '西昆岭冬季穿越路线考察手记（核验已过期）',
          ko: '겨울철 떠이꼰린 능선 횡단 여정 (검증 기한 만료)',
          fr: 'Traversée hivernale des crêtes de Tay Con Linh (Vérification expirée)',
        },
      };

      profile.publishedPosts = profile.publishedPosts.map(postItem => {
        const postEntry = this.posts[postItem.postId];
        const rawPlace = this.places.find(p => p.name === postItem.placeName || p.placeId === postEntry?.placeId);

        let translatedPlaceName = postItem.placeName;
        if (rawPlace?.translations?.[targetLocale]?.name) {
          translatedPlaceName = rawPlace.translations[targetLocale].name;
        }

        let translatedTitle = postItem.title;
        let isUntranslated = true;

        if (postEntry?.revision?.translations?.[targetLocale]?.title) {
          translatedTitle = postEntry.revision.translations[targetLocale].title;
          if (postItem.title.includes('Thẩm định viên')) {
            const roleNotes: Record<string, string> = {
              en: ' (Reviewer notes)',
              ja: '（検証員記録）',
              'zh-Hans': '（审核员手记）',
              ko: ' (검토자 노트)',
              fr: ' (Notes d’évaluateur)',
            };
            translatedTitle += roleNotes[targetLocale] || '';
          }
          isUntranslated = false;
        } else if (postTitleTranslations[postItem.postId]?.[targetLocale]) {
          const match = postTitleTranslations[postItem.postId]?.[targetLocale];
          if (match) {
            translatedTitle = match;
            isUntranslated = false;
          }
        }

        return {
          ...postItem,
          placeName: translatedPlaceName,
          title: translatedTitle,
          isUntranslated,
        };
      });
    } else {
      profile.isOriginalBio = false;
      profile.publishedPosts = profile.publishedPosts.map(postItem => ({
        ...postItem,
        isUntranslated: false,
      }));
    }

    return profile;
  }

  async getVipPlans(locale?: string): Promise<VipPlanDTO[]> {
    const targetLocale = locale || 'vi';
    const trans = this.vipPlanTranslations[targetLocale] ?? this.vipPlanTranslations.vi;
    return this.vipPlans.map(plan => ({
      ...plan,
      name: trans?.name ?? plan.name,
      benefits: trans?.benefits ?? plan.benefits,
    }));
  }

  async getTransparencySummary(year?: number): Promise<TransparencySummaryDTO> {
    return this.transparencySummary;
  }

  // === NEW ADAPTER STORES FOR FE FIRST V1.0 ===

  private contributions: Record<string, ContributionItemDTO[]> = {
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05': [
      {
        postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
        displayCode: 'PST-000001',
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
        placeName: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
        title: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng',
        contributionType: ContributionType.EXPERIENCE,
        currentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
        versionNumber: 2,
        observedAt: '2026-04-15T08:00:00Z',
        createdAt: '2026-04-16T10:00:00Z',
        verificationStatus: VerificationStatus.VERIFIED,
        visibility: PostVisibility.PUBLISHED,
        accessTier: AccessTier.PUBLIC,
      },
      {
        postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e40',
        displayCode: 'PST-000004',
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
        placeName: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
        title: 'Khảo sát luồng lạch & điểm neo thuyền hoang sơ vịnh Lan Hạ (VIP)',
        contributionType: ContributionType.GUIDE,
        currentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e41',
        versionNumber: 1,
        observedAt: '2026-05-10T14:30:00Z',
        createdAt: '2026-05-11T09:00:00Z',
        verificationStatus: VerificationStatus.VERIFIED,
        visibility: PostVisibility.PUBLISHED,
        accessTier: AccessTier.VIP,
      },
    ],
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01': [
      {
        postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20',
        displayCode: 'PST-000002',
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e04',
        placeName: 'Mũi Móng Rồng - Đảo Cô Tô',
        title: 'Trải nghiệm đón bình minh tại vách đá Mũi Móng Rồng',
        contributionType: ContributionType.DISCOVERY,
        currentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e21',
        versionNumber: 1,
        observedAt: '2026-05-20T05:30:00Z',
        createdAt: '2026-05-21T08:00:00Z',
        verificationStatus: VerificationStatus.VERIFIED,
        visibility: PostVisibility.PUBLISHED,
        accessTier: AccessTier.PUBLIC,
      },
    ],
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e06': [
      {
        postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
        displayCode: 'PST-000003',
        placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e03',
        placeName: 'Đỉnh Tây Côn Lĩnh Hoàng Su Phì',
        title: 'Hành trình vượt dốc Tây Côn Lĩnh mùa đông (Kiểm định hết hạn)',
        contributionType: ContributionType.EXPERIENCE,
        currentRevisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
        versionNumber: 1,
        observedAt: '2025-11-20T06:00:00Z',
        createdAt: '2025-11-21T07:00:00Z',
        verificationStatus: VerificationStatus.EXPIRED,
        visibility: PostVisibility.PUBLISHED,
        accessTier: AccessTier.PUBLIC,
      },
    ],
  };

  private reports: ReportDTO[] = [
    {
      reportId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f01',
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
      postTitle: 'Hành trình vượt dốc Tây Côn Lĩnh mùa đông',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
      claimId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e65',
      claimText: 'Độ cao ghi nhận 2.428m',
      reporterUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01',
      reporterHandle: 'bin_traveler',
      reason: 'Độ cao thực tế theo mốc trắc địa quốc gia mới là 2.431m, có sai lệch 3m so với bài viết.',
      status: 'INVESTIGATING',
      createdAt: '2026-09-20T10:15:00Z',
    },
  ];

  private payments: PaymentIntentDTO[] = [
    {
      id: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f10',
      mode: 'PROJECT',
      targetTitle: 'Quỹ Bảo Tồn & Thẩm Định Độc Lập Ventlore',
      amountAtomic: '50000000',
      amountFormatted: '50 USDC',
      asset: 'USDC',
      status: 'SIMULATED_SUCCESS',
      txHashDemo: '0xmock...treasury50',
      timestamp: '2026-09-22T14:20:00Z',
    },
    {
      id: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f11',
      mode: 'POST_TIP',
      targetTitle: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng',
      targetId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
      authorHandle: 'minh_trailguide',
      authorDisplayName: 'Minh Hướng Dẫn Viên',
      authorWalletAddress: '0x88F...42C1',
      amountAtomic: '10000000',
      amountFormatted: '10 USDC',
      asset: 'USDC',
      authorAmountAtomic: '8000000',
      treasuryAmountAtomic: '2000000',
      authorAmountFormatted: '8 USDC',
      treasuryAmountFormatted: '2 USDC',
      status: 'SIMULATED_SUCCESS',
      txHashDemo: '0xmock...tip10',
      timestamp: '2026-09-24T09:12:00Z',
    },
  ];

  private tasks: ExpertTaskDTO[] = [
    {
      taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f20',
      displayCode: 'TSK-000001',
      type: TaskType.EXISTING_PLACE_POST_REVIEW,
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e20',
      postTitle: 'Trải nghiệm đón bình minh tại vách đá Mũi Móng Rồng',
      placeName: 'Mũi Móng Rồng - Đảo Cô Tô',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e21',
      scope: 'Độ ổn định của tầng đá phiến và hiện tượng sóng ngầm chân ghềnh',
      claims: [
        { claimId: 'c1', text: 'Tầng đá phiến trầm tích không có dấu hiệu nứt tách lớn', status: 'VERIFIED' },
        { claimId: 'c2', text: 'Sóng lớn nguy hiểm từ 05:00 - 07:00 khi triều dâng', status: 'VERIFIED' },
      ],
      deadline: '2026-10-05T23:59:59Z',
      rewardAmountFormatted: '50 USDC',
      rewardAsset: 'USDC',
      workStatus: TaskWorkStatus.OFFERED,
      acceptanceCriteria: [
        'Khảo sát trực tiếp bằng thiết bị đo độ dốc và chụp ảnh vết nứt',
        'Ghi nhận bảng thủy triều thời điểm khảo sát',
        'Có nhật ký thực địa rõ ngày giờ',
      ],
      submissions: [],
    },
    {
      taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f21',
      displayCode: 'TSK-000002',
      type: TaskType.EXISTING_PLACE_POST_REVIEW,
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
      postTitle: 'Hành trình vượt dốc Tây Côn Lĩnh mùa đông (Kiểm định hết hạn)',
      placeName: 'Đỉnh Tây Côn Lĩnh Hoàng Su Phì',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
      scope: 'Tình trạng sạt lở đường mòn và điểm tiếp nước suối tự nhiên',
      claims: [
        { claimId: 'c3', text: 'Suối cạn nước từ km số 14', status: 'UNVERIFIED' },
        { claimId: 'c4', text: 'Có nguy cơ trượt đất tại dốc Gió', status: 'UNVERIFIED' },
      ],
      deadline: '2026-09-30T23:59:59Z',
      rewardAmountFormatted: '80 USDC',
      rewardAsset: 'USDC',
      workStatus: TaskWorkStatus.IN_PROGRESS,
      acceptanceCriteria: [
        'Xác minh tọa độ GPS 3 điểm lấy nước khả thi',
        'Đánh giá nguy cơ sạt lở theo thang cấp 1-4',
      ],
      submissions: [],
    },
    {
      taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f22',
      displayCode: 'TSK-000003',
      type: TaskType.EXISTING_PLACE_POST_REVIEW,
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
      postTitle: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng',
      placeName: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
      scope: 'Độ trơn trượt vách đá và phao tiêu cảnh báo',
      claims: [
        { claimId: 'c5', text: 'Vách đá bám rêu trơn trượt sáng sớm', status: 'VERIFIED' },
      ],
      deadline: '2026-09-25T23:59:59Z',
      rewardAmountFormatted: '50 USDC',
      rewardAsset: 'USDC',
      workStatus: TaskWorkStatus.SUBMITTED,
      acceptanceCriteria: ['Báo cáo thực địa có ảnh đối chứng'],
      submissions: [
        {
          submissionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f30',
          taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f22',
          submittedAt: '2026-09-24T16:00:00Z',
          expertUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07',
          expertHandle: 'hoang_ranger',
          findings: 'Đã hoàn thành kiểm tra độ trơn trượt tại 4 điểm ven ghềnh Cát Cò 3. Xác nhận khuyến nghị giày chuyên dụng là chính xác.',
          evidenceUrls: ['/evidence/catco3-survey-1.jpg'],
          claimsEvaluation: [{ claimId: 'c5', verified: true, notes: 'Khớp hoàn toàn với hiện trường.' }],
          versionNumber: 1,
        },
      ],
    },
    {
      taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f23',
      displayCode: 'TSK-000004',
      type: TaskType.EXISTING_PLACE_POST_REVIEW,
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
      postTitle: 'Khảo sát lối mòn vách vực đèo Mã Pí Lèng',
      placeName: 'Đèo Mã Pí Lèng - Hà Giang',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
      scope: 'Đo đạc độ dốc taluy âm và rào chắn an toàn',
      claims: [
        { claimId: 'c6', text: 'Đường mòn an toàn cho xe máy thông thường', status: 'REJECTED' },
      ],
      deadline: '2026-09-18T23:59:59Z',
      rewardAmountFormatted: '60 USDC',
      rewardAsset: 'USDC',
      workStatus: TaskWorkStatus.ACCEPTED_WORK,
      acceptanceCriteria: ['Nghiệm thu báo cáo khảo sát hiện trường chuyên gia'],
      submissions: [
        {
          submissionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f31',
          taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f23',
          submittedAt: '2026-09-17T11:00:00Z',
          expertUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07',
          expertHandle: 'hoang_ranger',
          findings: 'Chuyên gia Hoàng đã tiến hành trắc đạc cẩn thận. Phát hiện bài viết của tác giả tuyên bố "an toàn cho xe thông thường" là SAI NGUY HIỂM vì vực sâu không có rào chắn.',
          evidenceUrls: ['/evidence/mapileng-cliff.jpg'],
          claimsEvaluation: [{ claimId: 'c6', verified: false, notes: 'Cực kỳ nguy hiểm, không đạt chuẩn an toàn.' }],
          versionNumber: 1,
        },
      ],
      payableStatus: PayableStatus.OPEN,
    },
  ];

  private payables: ExpertPayableDTO[] = [
    {
      payableId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f40',
      taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f23',
      taskDisplayCode: 'TSK-000004',
      postTitle: 'Khảo sát lối mòn vách vực đèo Mã Pí Lèng',
      amountFormatted: '60 USDC',
      asset: 'USDC',
      status: PayableStatus.OPEN,
      acceptedAt: '2026-09-19T08:30:00Z',
    },
  ];

  private adminCases: AdminReviewCaseDTO[] = [
    {
      caseId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f50',
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
      postTitle: 'Hành trình vượt dốc Tây Côn Lĩnh mùa đông (Kiểm định hết hạn)',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
      placeName: 'Đỉnh Tây Côn Lĩnh Hoàng Su Phì',
      authorHandle: 'an_vip_explorer',
      authorUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e06',
      status: 'ASSIGNED',
      assignedExpertHandle: 'hoang_ranger',
      assignedExpertUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07',
      taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f21',
      taskWorkStatus: TaskWorkStatus.IN_PROGRESS,
      submissionCount: 0,
    },
    {
      caseId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f51',
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e10',
      postTitle: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e12',
      placeName: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
      authorHandle: 'minh_trailguide',
      authorUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
      status: 'EVALUATING',
      assignedExpertHandle: 'hoang_ranger',
      assignedExpertUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07',
      taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f22',
      taskWorkStatus: TaskWorkStatus.SUBMITTED,
      submissionCount: 1,
    },
    {
      caseId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f52',
      postId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e30',
      postTitle: 'Khảo sát lối mòn vách vực đèo Mã Pí Lèng',
      revisionId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e31',
      placeName: 'Đèo Mã Pí Lèng - Hà Giang',
      authorHandle: 'bin_traveler',
      authorUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01',
      status: 'DECIDED',
      assignedExpertHandle: 'hoang_ranger',
      assignedExpertUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07',
      taskId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f23',
      taskWorkStatus: TaskWorkStatus.ACCEPTED_WORK,
      acceptanceStatus: 'ACCEPTED_WORK',
      contentDecision: ReviewDecisionOutcome.REJECTED,
      decisionNotes: 'Chuyên gia hoàn thành xuất sắc nhiệm vụ (được trả công), nhưng bài viết bị BÁC BỎ do khuyến nghị an toàn không chính xác.',
      submissionCount: 1,
      payableId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f40',
    },
  ];

  private adminIntakes: AdminIntakeItemDTO[] = [
    {
      intakeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f60',
      type: 'PROPOSAL_NEW_PLACE',
      entityId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e04',
      title: 'Đề xuất địa điểm mới: Mũi Móng Rồng - Cô Tô',
      submittedByHandle: 'bin_traveler',
      submittedAt: '2026-09-21T08:00:00Z',
      regionName: 'Quảng Ninh / Cô Tô',
      potentialDuplicates: [],
      summary: 'Điểm vách đá trầm tích hoang sơ hướng đông nam Cô Tô, cần chuyên gia thẩm định rủi ro trượt ngã.',
      status: 'PENDING',
    },
    {
      intakeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f61',
      type: 'USER_REPORT',
      entityId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5f01',
      title: 'Khiếu nại sai lệch thông số độ cao Tây Côn Lĩnh',
      submittedByHandle: 'bin_traveler',
      submittedAt: '2026-09-20T10:15:00Z',
      summary: 'Báo cáo sai lệch 3m so với mốc trắc địa quốc gia mới.',
      status: 'PENDING',
    },
  ];

  private benefits: Record<string, BenefitsDTO> = {
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05': {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e05',
      verifiedContentCount: 2,
      sbt: {
        credentialId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e71',
        title: 'Huy hiệu Đóng Góp Thực Địa Vàng (Contributor SBT)',
        status: 'ISSUED_DEMO',
        issuedAt: '2025-01-10T09:00:00Z',
        tokenId: '4829104819204812',
      },
      nft: {
        collectibleId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e81',
        title: 'Author NFT: Cát Cò 3 First Discovery',
        postTitle: 'Kinh nghiệm vượt ghềnh Cát Cò 3 an toàn mùa nắng',
        status: 'ISSUED_DEMO',
        tokenId: '9182309128301923',
        imageUrl: '/destinations/cat-co-3.svg',
      },
      tipRoute: {
        routeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e82',
        status: TipRouteStatus.ACTIVE,
        authorPercent: 80,
        treasuryPercent: 20,
        walletAddress: '0x88F...42C1',
        consentGiven: true,
      },
    },
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01': {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01',
      verifiedContentCount: 1,
      sbt: {
        credentialId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e73',
        title: 'Huy hiệu Khám Phá Quần Đảo (Contributor SBT)',
        status: 'OFFERED',
      },
      nft: {
        collectibleId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e83',
        title: 'Author NFT: Cô Tô Dawn Report',
        postTitle: 'Trải nghiệm đón bình minh tại vách đá Mũi Móng Rồng',
        status: 'OFFERED',
        imageUrl: '/destinations/co-to.svg',
      },
      tipRoute: {
        routeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e84',
        status: TipRouteStatus.AWAITING_CONSENT,
        authorPercent: 80,
        treasuryPercent: 20,
        walletAddress: '0x71C...B29a',
        consentGiven: false,
      },
    },
    '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e06': {
      userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e06',
      verifiedContentCount: 0,
      sbt: {
        credentialId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e74',
        title: 'Huy hiệu Đóng Góp Cộng Đồng',
        status: 'NOT_ELIGIBLE',
      },
      nft: {
        collectibleId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e85',
        title: 'Author Field Note NFT',
        postTitle: 'Chưa có bài viết đủ điều kiện',
        status: 'NOT_ELIGIBLE',
      },
      tipRoute: {
        routeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e86',
        status: TipRouteStatus.PENDING,
        authorPercent: 80,
        treasuryPercent: 20,
        consentGiven: false,
      },
    },
  };

  private appHoldRevisions: Set<string> = new Set();

  // === NEW ADAPTER METHODS FOR DEMO MUTATIONS ===

  async getContributions(userId: string): Promise<ContributionItemDTO[]> {
    return this.contributions[userId] || [];
  }

  async submitContributionPost(
    input: CreatePostInput,
    authorUserId: string,
    authorHandle: string
  ): Promise<ContributionItemDTO> {
    const postId = generateUUIDv7();
    const revisionId = generateUUIDv7();
    const targetPlace = this.places.find(p => p.placeId === input.placeId);
    const placeName = targetPlace ? targetPlace.name : 'Địa điểm khảo sát';

    const newContrib: ContributionItemDTO = {
      postId,
      displayCode: `PST-00${Math.floor(1000 + Math.random() * 9000)}`,
      placeId: input.placeId,
      placeName,
      title: input.title,
      contributionType: input.contributionType,
      currentRevisionId: revisionId,
      versionNumber: 1,
      observedAt: input.observedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      verificationStatus: VerificationStatus.UNVERIFIED,
      visibility: PostVisibility.PUBLISHED,
      accessTier: input.accessTier || AccessTier.PUBLIC,
      feedbackNotes: 'Bài viết đã được xuất bản ở trạng thái CHƯA KIỂM ĐỊNH theo quy chế Ventlore.',
    };

    if (!this.contributions[authorUserId]) {
      this.contributions[authorUserId] = [];
    }
    this.contributions[authorUserId].unshift(newContrib);

    // Also register in admin intake
    this.adminIntakes.unshift({
      intakeId: generateUUIDv7(),
      type: 'NEW_POST',
      entityId: postId,
      title: `Bài viết mới: ${input.title}`,
      submittedByHandle: authorHandle,
      submittedAt: new Date().toISOString(),
      summary: `Bài viết mới tại ${placeName}. Cần phân công chuyên gia kiểm định thực địa.`,
      status: 'PENDING',
    });

    return newContrib;
  }

  async submitRevision(
    postId: string,
    input: Partial<CreatePostInput>,
    authorUserId: string
  ): Promise<ContributionItemDTO> {
    const list = this.contributions[authorUserId] || [];
    const existing = list.find(item => item.postId === postId);
    if (!existing) throw new Error('Post not found in author contributions');

    const newRevisionId = generateUUIDv7();
    const newVersion = existing.versionNumber + 1;
    existing.currentRevisionId = newRevisionId;
    existing.versionNumber = newVersion;
    if (input.title) existing.title = input.title;
    if (input.contributionType) existing.contributionType = input.contributionType;
    existing.verificationStatus = VerificationStatus.UNVERIFIED;
    existing.feedbackNotes = `Phiên bản sửa đổi v${newVersion} đã gửi. Giữ nguyên postId, sinh revisionId mới trỏ parent revision trước.`;

    if (this.posts[postId]) {
      const p = this.posts[postId];
      const parentRevId = p.currentRevisionId;
      p.currentRevisionId = newRevisionId;
      p.revisionsList.unshift({
        revisionId: newRevisionId,
        displayCode: `REV-00000${newVersion + 5}`,
        versionNumber: newVersion,
        title: input.title || p.revision.title,
        createdAt: new Date().toISOString(),
        verificationStatus: VerificationStatus.UNVERIFIED,
        accessTier: p.revision.accessTier,
      });
      p.revision = {
        ...p.revision,
        revisionId: newRevisionId,
        displayCode: `REV-00000${newVersion + 5}`,
        parentRevisionId: parentRevId,
        title: input.title || p.revision.title,
        content: input.content || p.revision.content,
        claims: input.claims ? input.claims.map((c, i) => ({ claimId: generateUUIDv7(), text: c, orderIndex: i })) : p.revision.claims,
        verificationStatus: VerificationStatus.UNVERIFIED,
      };
    }

    return existing;
  }

  async proposeCandidatePlace(
    input: ProposeCandidatePlaceInput,
    authorUserId: string,
    authorHandle: string
  ): Promise<{ place: PlaceDetailDTO; post: ContributionItemDTO }> {
    const placeId = generateUUIDv7();
    const postId = generateUUIDv7();
    const revisionId = generateUUIDv7();

    const candidatePlace: PlaceDetailDTO = {
      placeId,
      displayCode: `PLC-00${Math.floor(1000 + Math.random() * 9000)}`,
      name: input.name,
      regionId: input.regionId,
      regionName: input.regionName,
      status: PlaceStatus.CANDIDATE,
      canonicalPlaceId: null,
      summary: input.summary,
      description: input.description,
      warnings: input.warnings,
      activities: input.activities,
      postsCount: 1,
      coordinates: input.coordinates,
      posts: [],
    };

    const newContrib: ContributionItemDTO = {
      postId,
      displayCode: `PST-00${Math.floor(1000 + Math.random() * 9000)}`,
      placeId,
      placeName: input.name,
      title: input.postTitle,
      contributionType: ContributionType.DISCOVERY,
      currentRevisionId: revisionId,
      versionNumber: 1,
      observedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      verificationStatus: VerificationStatus.IN_REVIEW,
      visibility: PostVisibility.REVIEW_ONLY,
      accessTier: AccessTier.PUBLIC,
      isCandidatePlace: true,
      feedbackNotes: 'Đề xuất điểm mới đang ở trạng thái CHỜ DUYỆT (REVIEW_ONLY). Chưa hiển thị công khai trên Explore.',
    };

    this.places.push(candidatePlace);

    if (!this.contributions[authorUserId]) {
      this.contributions[authorUserId] = [];
    }
    this.contributions[authorUserId].unshift(newContrib);

    // Register in admin intake with potential duplicate comparison
    const duplicates = this.places
      .filter(p => p.placeId !== placeId && (p.name.toLowerCase().includes(input.name.toLowerCase()) || input.name.toLowerCase().includes(p.name.toLowerCase())))
      .map(p => ({ placeId: p.placeId, name: p.name, similarity: '85%' }));

    this.adminIntakes.unshift({
      intakeId: generateUUIDv7(),
      type: 'PROPOSAL_NEW_PLACE',
      entityId: placeId,
      title: `Đề xuất điểm mới: ${input.name}`,
      submittedByHandle: authorHandle,
      submittedAt: new Date().toISOString(),
      regionName: input.regionName,
      potentialDuplicates: duplicates,
      summary: input.summary,
      status: 'PENDING',
    });

    return { place: candidatePlace, post: newContrib };
  }

  async submitReport(input: {
    postId: string;
    postTitle?: string;
    revisionId: string;
    claimId?: string;
    claimText?: string;
    reason: string;
    evidenceUrl?: string;
    reporterUserId: string;
    reporterHandle: string;
  }): Promise<ReportDTO> {
    const report: ReportDTO = {
      reportId: generateUUIDv7(),
      postId: input.postId,
      postTitle: input.postTitle || 'Bài viết được báo cáo',
      revisionId: input.revisionId,
      claimId: input.claimId,
      claimText: input.claimText,
      reporterUserId: input.reporterUserId,
      reporterHandle: input.reporterHandle,
      reason: input.reason,
      evidenceUrl: input.evidenceUrl,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    this.reports.unshift(report);

    this.adminIntakes.unshift({
      intakeId: generateUUIDv7(),
      type: 'USER_REPORT',
      entityId: report.reportId,
      title: `Khiếu nại bài viết: ${report.postTitle}`,
      submittedByHandle: input.reporterHandle,
      submittedAt: report.createdAt,
      summary: input.reason,
      status: 'PENDING',
    });

    return report;
  }

  async getReports(): Promise<ReportDTO[]> {
    return this.reports;
  }

  async getBenefits(userId: string): Promise<BenefitsDTO> {
    if (this.benefits[userId]) {
      return this.benefits[userId];
    }
    return {
      userId,
      verifiedContentCount: 0,
      sbt: {
        credentialId: generateUUIDv7(),
        title: 'Huy hiệu Đóng Góp Cộng Đồng',
        status: 'NOT_ELIGIBLE',
      },
      nft: {
        collectibleId: generateUUIDv7(),
        title: 'Author Field Note NFT',
        postTitle: 'Chưa có bài viết đủ điều kiện',
        status: 'NOT_ELIGIBLE',
      },
      tipRoute: {
        routeId: generateUUIDv7(),
        status: TipRouteStatus.PENDING,
        authorPercent: 80,
        treasuryPercent: 20,
        consentGiven: false,
      },
    };
  }

  async claimBenefit(userId: string, type: 'sbt' | 'nft'): Promise<BenefitsDTO> {
    const current = await this.getBenefits(userId);
    if (current.verifiedContentCount === 0) {
      throw new Error('Chưa có bài viết được kiểm định thực địa (VERIFIED). Không đủ điều kiện nhận quyền lợi tác giả.');
    }
    if (type === 'sbt') {
      current.sbt.status = 'ISSUED_DEMO';
      current.sbt.issuedAt = new Date().toISOString();
      current.sbt.tokenId = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    } else {
      current.nft.status = 'ISSUED_DEMO';
      current.nft.tokenId = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    }
    this.benefits[userId] = current;
    return current;
  }

  async updateTipConsent(userId: string, consent: boolean): Promise<BenefitsDTO> {
    const current = await this.getBenefits(userId);
    current.tipRoute.consentGiven = consent;
    current.tipRoute.status = consent ? TipRouteStatus.ACTIVE : TipRouteStatus.AWAITING_CONSENT;
    this.benefits[userId] = current;
    return current;
  }

  async getExpertTasks(expertUserId?: string): Promise<ExpertTaskDTO[]> {
    return this.tasks;
  }

  async getExpertPayables(expertUserId?: string): Promise<ExpertPayableDTO[]> {
    return this.payables;
  }

  async acceptTask(taskId: string): Promise<ExpertTaskDTO> {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (!task) throw new Error('Task not found');
    task.workStatus = TaskWorkStatus.IN_PROGRESS;
    return task;
  }

  async declineTask(taskId: string): Promise<ExpertTaskDTO> {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (!task) throw new Error('Task not found');
    task.workStatus = TaskWorkStatus.DECLINED;
    return task;
  }

  async submitTaskEvidence(
    taskId: string,
    findings: string,
    claimsEvaluation: Array<{ claimId: string; verified: boolean; notes: string }>,
    evidenceUrls: string[]
  ): Promise<ExpertTaskDTO> {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (!task) throw new Error('Task not found');

    const submission: TaskSubmissionDTO = {
      submissionId: generateUUIDv7(),
      taskId,
      submittedAt: new Date().toISOString(),
      expertUserId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e07',
      expertHandle: 'hoang_ranger',
      findings,
      evidenceUrls,
      claimsEvaluation,
      versionNumber: task.submissions.length + 1,
    };

    task.submissions.push(submission);
    task.workStatus = TaskWorkStatus.SUBMITTED;

    // Update corresponding admin case
    const c = this.adminCases.find(ac => ac.taskId === taskId);
    if (c) {
      c.status = 'EVALUATING';
      c.taskWorkStatus = TaskWorkStatus.SUBMITTED;
      c.submissionCount = task.submissions.length;
    }

    return task;
  }

  async getAdminIntake(): Promise<AdminIntakeItemDTO[]> {
    return this.adminIntakes;
  }

  async getAdminReviewCases(): Promise<AdminReviewCaseDTO[]> {
    return this.adminCases;
  }

  async adminAssignTask(
    caseId: string,
    expertUserId: string,
    deadlineDays: number,
    rewardAmount: string
  ): Promise<AdminReviewCaseDTO> {
    const c = this.adminCases.find(ac => ac.caseId === caseId);
    if (!c) throw new Error('Case not found');

    const newTaskId = generateUUIDv7();
    const newTask: ExpertTaskDTO = {
      taskId: newTaskId,
      displayCode: `TSK-00${Math.floor(1000 + Math.random() * 9000)}`,
      type: TaskType.EXISTING_PLACE_POST_REVIEW,
      postId: c.postId,
      postTitle: c.postTitle,
      placeName: c.placeName,
      revisionId: c.revisionId,
      scope: 'Thẩm định an toàn thực địa theo yêu cầu Ban Điều Hành',
      claims: [],
      deadline: new Date(Date.now() + deadlineDays * 86400000).toISOString(),
      rewardAmountFormatted: `${rewardAmount} USDC`,
      rewardAsset: 'USDC',
      workStatus: TaskWorkStatus.OFFERED,
      acceptanceCriteria: ['Khảo sát thực địa và có bằng chứng ảnh đối chứng'],
      submissions: [],
    };

    this.tasks.unshift(newTask);
    c.status = 'ASSIGNED';
    c.assignedExpertHandle = 'hoang_ranger';
    c.assignedExpertUserId = expertUserId;
    c.taskId = newTaskId;
    c.taskWorkStatus = TaskWorkStatus.OFFERED;

    return c;
  }

  async adminAcceptWork(
    taskId: string,
    outcome: 'ACCEPTED_WORK' | 'REJECTED_WORK',
    reason?: string
  ): Promise<{ task: ExpertTaskDTO; payable?: ExpertPayableDTO }> {
    const task = this.tasks.find(t => t.taskId === taskId);
    if (!task) throw new Error('Task not found');

    task.workStatus = outcome === 'ACCEPTED_WORK' ? TaskWorkStatus.ACCEPTED_WORK : TaskWorkStatus.REJECTED_WORK;

    let payable: ExpertPayableDTO | undefined;
    if (outcome === 'ACCEPTED_WORK') {
      const payableId = generateUUIDv7();
      payable = {
        payableId,
        taskId,
        taskDisplayCode: task.displayCode,
        postTitle: task.postTitle,
        amountFormatted: task.rewardAmountFormatted,
        asset: task.rewardAsset,
        status: PayableStatus.OPEN,
        acceptedAt: new Date().toISOString(),
      };
      this.payables.unshift(payable);
      task.payableStatus = PayableStatus.OPEN;
    }

    const c = this.adminCases.find(ac => ac.taskId === taskId);
    if (c) {
      c.acceptanceStatus = outcome;
      c.taskWorkStatus = task.workStatus;
      if (payable) {
        c.payableId = payable.payableId;
      }
    }

    return { task, payable };
  }

  async adminDecideContent(
    caseId: string,
    outcome: ReviewDecisionOutcome,
    notes: string,
    scope?: string
  ): Promise<AdminReviewCaseDTO> {
    const c = this.adminCases.find(ac => ac.caseId === caseId);
    if (!c) throw new Error('Case not found');

    c.contentDecision = outcome;
    c.decisionNotes = notes;
    c.status = 'DECIDED';

    // Update post revision if present in posts
    const postEntry = this.posts[c.postId];
    if (postEntry && postEntry.revision) {
      if (outcome === ReviewDecisionOutcome.APPROVED) {
        postEntry.revision.verificationStatus = VerificationStatus.VERIFIED;
        postEntry.revision.checkedAt = new Date().toISOString();
        postEntry.revision.validUntil = '2027-12-31T23:59:59Z';
        if (scope) postEntry.revision.scope = scope;
      } else if (outcome === ReviewDecisionOutcome.REJECTED) {
        postEntry.revision.verificationStatus = VerificationStatus.REJECTED;
      } else if (outcome === ReviewDecisionOutcome.CHANGES_REQUESTED) {
        postEntry.revision.verificationStatus = VerificationStatus.NEEDS_CHANGES;
      } else {
        postEntry.revision.verificationStatus = VerificationStatus.INCONCLUSIVE;
      }
    }

    return c;
  }

  async adminToggleAppHold(revisionId: string, isHold: boolean): Promise<{ revisionId: string; isAppHold: boolean }> {
    if (isHold) {
      this.appHoldRevisions.add(revisionId);
    } else {
      this.appHoldRevisions.delete(revisionId);
    }

    const c = this.adminCases.find(ac => ac.revisionId === revisionId);
    if (c) {
      c.isAppHold = isHold;
    }

    return { revisionId, isAppHold: isHold };
  }

  isRevisionOnAppHold(revisionId: string): boolean {
    return this.appHoldRevisions.has(revisionId);
  }

  async recordPayment(intent: PaymentIntentDTO): Promise<PaymentIntentDTO> {
    const paymentId = generateUUIDv7();
    const now = new Date().toISOString();

    // Invariant: Guest can NEVER purchase or receive VIP membership
    if (intent.mode === 'MEMBERSHIP') {
      if (this.currentPersona === 'guest' || intent.payerUserId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e00') {
        throw new Error('GUEST_CANNOT_PURCHASE_VIP: Khách đọc công khai chưa đăng nhập không thể mua gói VIP. Vui lòng đăng nhập tài khoản.');
      }
    }

    // Invariant: Tip requires eligible post revision
    if (intent.mode === 'POST_TIP' && intent.revisionId) {
      const postEntry = Object.values(this.posts).find(p => p.postId === intent.targetId);
      if (postEntry) {
        // If checking Cat Co 3 specifically or general revision
        if (intent.revisionId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e13' || intent.revisionId === 'REV-000003') {
          throw new Error('POST_TIP_NOT_ELIGIBLE: Phiên bản REV-000003 (Cần chỉnh sửa) chưa đủ điều kiện nhận tip.');
        }
        if (intent.revisionId === '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e11' || intent.revisionId === 'REV-000001') {
          throw new Error('POST_TIP_NOT_ELIGIBLE: Phiên bản REV-000001 (Chưa kiểm định) không được kích hoạt tuyến nhận tip.');
        }
      }
    }

    const recorded: PaymentIntentDTO = {
      ...intent,
      id: paymentId,
      status: 'SIMULATED_SUCCESS',
      txHashDemo: undefined, // No fake blockchain hash per P1-04
      timestamp: now,
    };

    // If membership, update current persona's session entitlement if applicable (Member/Author/etc.)
    if (intent.mode === 'MEMBERSHIP') {
      const activePersona = this.currentPersona;
      const userSession = this.sessions[activePersona];
      if (userSession && userSession.userId !== '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e00') {
        const existingMembership = userSession.membership;
        const startsAt = existingMembership?.isActive ? existingMembership.startsAt : now;
        const currentEnd = existingMembership?.isActive ? new Date(existingMembership.endsAt).getTime() : Date.now();
        const newEndsAt = new Date(currentEnd + 365 * 86400000).toISOString();

        userSession.membership = {
          membershipId: existingMembership?.membershipId || generateUUIDv7(),
          planCode: 'VIP_ANNUAL',
          startsAt,
          endsAt: newEndsAt,
          isActive: true,
        };

        if (!userSession.capabilities.includes('can_read_vip')) {
          userSession.capabilities.push('can_read_vip');
        }

        recorded.payerUserId = userSession.userId;
        recorded.targetUserId = userSession.userId;
      }
    }

    this.payments.unshift(recorded);
    return recorded;
  }

  async getPaymentIntents(): Promise<PaymentIntentDTO[]> {
    return this.payments;
  }
}

export const mockApiClient = new VentloreMockAdapter();
