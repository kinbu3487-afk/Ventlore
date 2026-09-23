/**
 * Các truy vấn tra cứu chuẩn Q01–Q10
 * Dựa trên Ventlore_Logic_ID_DB_v0_3.pdf Mục 21.1.
 * Luôn bind tham số $1::uuid hoặc $1::text; không bao giờ nối chuỗi trực tiếp.
 */

export const SQL_LOOKUP_QUERIES = {
  // Q01: post_id -> tác giả, địa điểm, các phiên bản
  Q01_POST_REVISIONS: `
    SELECT p.post_id, p.display_code AS post_code, p.place_id, p.author_user_id,
           r.revision_id, r.display_code AS revision_code, r.version_number, r.title, r.verification_status
    FROM posts p
    JOIN revisions r ON r.post_id = p.post_id
    WHERE p.post_id = $1::uuid
    ORDER BY r.version_number ASC;
  `,

  // Q02: revision_id -> các vòng kiểm tra và quyết định đúng phiên bản
  Q02_REVISION_CASES_DECISION: `
    SELECT r.revision_id, rc.review_case_id, rc.status AS case_status,
           d.decision_id, d.outcome AS decision_outcome, d.valid_until
    FROM revisions r
    JOIN review_cases rc ON rc.revision_id = r.revision_id
    LEFT JOIN decisions d ON d.review_case_id = rc.review_case_id
    WHERE r.revision_id = $1::uuid;
  `,

  // Q03: task_id -> người làm, nghiệm thu, khoản phải trả và lệnh chi
  Q03_TASK_ACCEPTANCE_PAYABLE: `
    SELECT t.task_id, t.assignee_user_id, t.work_status,
           a.acceptance_id, a.accepted_by_user_id,
           p.payable_id, p.amount, p.status AS payable_status,
           po.payout_id, po.action_id
    FROM tasks t
    LEFT JOIN acceptances a ON a.task_id = t.task_id
    LEFT JOIN payables p ON p.acceptance_id = a.acceptance_id
    LEFT JOIN payouts po ON po.payable_id = p.payable_id
    WHERE t.task_id = $1::uuid;
  `,

  // Q04: donation_id -> route, phiên bản, bài, quyết định, tác giả và receipt
  Q04_DONATION_FULL_CHAIN: `
    SELECT d.donation_id, d.kind, d.amount_atomic, d.asset,
           r.route_id, r.beneficiary_binding_id,
           rev.revision_id, rev.title,
           p.post_id, p.author_user_id,
           dec.decision_id, dec.outcome
    FROM donations d
    LEFT JOIN tip_routes r ON r.route_id = d.route_id
    LEFT JOIN revisions rev ON rev.revision_id = r.revision_id
    LEFT JOIN posts p ON p.post_id = rev.post_id
    LEFT JOIN decisions dec ON dec.decision_id = r.decision_id
    WHERE d.donation_id = $1::uuid;
  `,

  // Q05: user_id -> quyền VIP còn hiệu lực
  Q05_USER_VIP_ENTITLEMENT: `
    SELECT m.membership_id, m.user_id, m.plan_code,
           vp.payment_id, vp.status AS payment_status
    FROM memberships m
    JOIN vip_payments vp ON vp.membership_id = m.membership_id
    WHERE m.user_id = $1::uuid AND vp.status = 'CONFIRMED'
    ORDER BY vp.created_at DESC
    LIMIT 1;
  `,

  // Q06: PST-000001 -> post_id để tiếp tục tra bằng UUID
  Q06_DISPLAY_CODE_LOOKUP: `
    SELECT post_id FROM posts WHERE display_code = $1::varchar;
  `,

  // Q07: routeKey + deploymentId -> route_id rồi đi theo FK về hồ sơ
  Q07_ROUTE_KEY_LOOKUP: `
    SELECT r.route_id, r.revision_id, r.decision_id, r.status
    FROM tip_routes r
    WHERE r.route_key = $1::varchar;
  `,

  // Q08: Một UUID bất kỳ -> loại đối tượng / bảng trong entity_lookup nội bộ
  Q08_ENTITY_LOOKUP: `
    SELECT 'posts' AS entity_table, post_id AS entity_id FROM posts WHERE post_id = $1::uuid
    UNION ALL
    SELECT 'revisions' AS entity_table, revision_id AS entity_id FROM revisions WHERE revision_id = $1::uuid
    UNION ALL
    SELECT 'places' AS entity_table, place_id AS entity_id FROM places WHERE place_id = $1::uuid
    LIMIT 1;
  `,

  // Q09: place_id đã gộp -> địa điểm canonical cuối cùng
  Q09_CANONICAL_PLACE: `
    WITH RECURSIVE place_tree AS (
      SELECT place_id, canonical_place_id, 1 AS depth
      FROM places
      WHERE place_id = $1::uuid
      UNION ALL
      SELECT p.place_id, p.canonical_place_id, pt.depth + 1
      FROM places p
      JOIN place_tree pt ON p.place_id = pt.canonical_place_id
      WHERE pt.canonical_place_id IS NOT NULL AND pt.depth < 10
    )
    SELECT place_id AS final_canonical_place_id
    FROM place_tree
    WHERE canonical_place_id IS NULL OR canonical_place_id = place_id
    LIMIT 1;
  `,

  // Q10: collectible_id -> NFT, tác giả ban đầu và quyết định nguồn
  Q10_AUTHOR_COLLECTIBLE: `
    SELECT c.collectible_id, c.collectible_key, c.post_id, c.original_author_user_id,
           c.source_revision_id, c.source_decision_id,
           p.display_code AS post_code, u.handle AS author_handle
    FROM author_collectibles c
    JOIN posts p ON p.post_id = c.post_id
    JOIN users u ON u.user_id = c.original_author_user_id
    WHERE c.collectible_id = $1::uuid;
  `
};
