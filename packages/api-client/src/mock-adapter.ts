import { UserSessionDTO, PlaceSummaryDTO, PostDetailDTO } from './types.js';
import { PlaceStatus, PostVisibility, AccessTier, VerificationStatus } from '@ventlore/domain';

export class VentloreMockAdapter {
  private userSession: UserSessionDTO = {
    userId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e01',
    handle: 'bin_traveler',
    displayName: 'Bin Khám Phá',
    roleAssignments: [],
    membership: null,
    capabilities: ['can_read_public', 'can_propose_place', 'can_submit_post']
  };

  private places: PlaceSummaryDTO[] = [
    {
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e02',
      displayCode: 'PLC-000001',
      name: 'Vịnh Cát Cò 3 - Hải Trình Ven Đảo',
      status: PlaceStatus.ACTIVE,
      summary: 'Tuyến đường đi bộ ven biển tuyệt đẹp nối bãi tắm và vách đá hoang sơ.',
      warnings: ['Sóng lớn vào mùa đông', 'Đường trơn trượt khi mưa']
    },
    {
      placeId: '018e3a2b-8a4c-7c0a-9f5b-1a2b3c4d5e03',
      displayCode: 'PLC-000002',
      name: 'Thác Rêu Xanh Thượng Nguồn',
      status: PlaceStatus.CANDIDATE,
      summary: 'Điểm mới do thành viên đề xuất; đang trong vòng kiểm tra thực địa.',
      warnings: ['Khu vực trũng ngập', 'Cần người bản địa dẫn đường']
    }
  ];

  async getSession(): Promise<UserSessionDTO> {
    return this.userSession;
  }

  async listPlaces(query?: string): Promise<{ items: PlaceSummaryDTO[]; nextCursor: string | null }> {
    let items = this.places.filter(p => p.status === PlaceStatus.ACTIVE);
    if (query) {
      items = items.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }
    return {
      items,
      nextCursor: null
    };
  }

  async getPlace(placeId: string): Promise<PlaceSummaryDTO | null> {
    return this.places.find(p => p.placeId === placeId) || null;
  }
}
