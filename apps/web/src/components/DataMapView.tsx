'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DATA_MAP_ROWS,
  KEY_DECISIONS,
  RAW_FE_DATA_MAP_MD,
  DataMapRow,
} from '@/lib/data-map-data';
import {
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  SearchIcon,
  TableIcon,
  FileTextIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ExternalLink,
} from '@/components/Icons';
import { useI18n } from '@/lib/i18n';

export function DataMapView() {
  const { getLocalizedPath } = useI18n();
  const [activeTab, setActiveTab] = useState<'table' | 'raw' | 'decisions'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter rows
  const filteredRows = useMemo(() => {
    return DATA_MAP_ROWS.filter((row) => {
      const matchesSource =
        selectedSource === 'ALL' ||
        row.targetSource.includes(selectedSource) ||
        row.currentSource.includes(selectedSource);

      if (!matchesSource) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        row.route.toLowerCase().includes(q) ||
        row.actor.toLowerCase().includes(q) ||
        row.component.toLowerCase().includes(q) ||
        row.fieldGroup.toLowerCase().includes(q) ||
        row.demoValue.toLowerCase().includes(q) ||
        row.decisionNeeded.toLowerCase().includes(q) ||
        row.targetSource.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedSource]);

  // Handle direct file download
  const handleDownloadMd = () => {
    try {
      const blob = new Blob([RAW_FE_DATA_MAP_MD], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'FE_DATA_MAP.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback to static URL
      window.open('/docs/FE_DATA_MAP.md', '_blank');
    }
  };

  // Handle copy markdown
  const handleCopyMd = () => {
    navigator.clipboard.writeText(RAW_FE_DATA_MAP_MD).then(() => {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2500);
    });
  };

  // Handle copy link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  const getSourceBadgeClass = (source: string) => {
    if (source.includes('BE_DYNAMIC')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (source.includes('CHAIN_VIA_BE')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    if (source.includes('WALLET_PUBLIC_READ')) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (source.includes('FE_LOCAL_STATE')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Breadcrumb & Back Link */}
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <Link
          href={getLocalizedPath('/')}
          className="inline-flex items-center gap-1.5 hover:text-forest transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" />
          <span>Quay lại Trang chủ Ventlore</span>
        </Link>
        <span className="font-mono">docs/FE_DATA_MAP.md &bull; v1.0</span>
      </div>

      {/* 2. Top Header Hero Card */}
      <div className="rounded-card border-2 border-forest bg-surface-card p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-forest text-white text-[11px] font-bold px-4 py-1 rounded-bl-control flex items-center gap-1.5">
          <SparklesIcon className="w-3.5 h-3.5 text-amber" />
          <span>Hồ Sơ Chốt Backend (FE-First)</span>
        </div>

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-bold uppercase tracking-wider">
            <TableIcon className="w-3.5 h-3.5" />
            <span>Ma Trận 16 Cột Chuẩn Hóa</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Ventlore · FE Data Map (Bản Đồ Dữ Liệu Tĩnh & Động)
          </h1>

          <p className="text-sm text-ink-secondary leading-relaxed">
            Tài liệu này xác lập chi tiết từng component và 39 nhóm trường dữ liệu trên toàn bộ giao diện Front-End Ventlore.
            Đây là cơ sở kỹ thuật cốt lõi để Chủ dự án (Bin) nghiệm thu và bàn giao cho Đội ngũ Backend, Database, Indexer &amp; Smart Contract phát triển tiếp.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-sage/50 text-ink font-semibold">
              39 Nhóm Trường
            </span>
            <span className="px-2 py-0.5 rounded bg-sage/50 text-ink font-semibold">
              23 Components
            </span>
            <span className="px-2 py-0.5 rounded bg-sage/50 text-ink font-semibold">
              16 Cột Phân Tích
            </span>
            <span className="px-2 py-0.5 rounded bg-amber/20 text-ink font-semibold border border-amber/40">
              5 Quyết Định Cần Chốt
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-6 pt-5 border-t border-sage/60 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadMd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control text-xs font-bold text-ink bg-amber hover:bg-amber-light active:scale-[0.98] transition-all shadow-sm"
          >
            <DownloadIcon className="w-4 h-4 text-ink" />
            <span>Tải file FE_DATA_MAP.md (.md)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMd}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-control text-xs font-semibold text-ink bg-surface-canvas hover:bg-sage/40 border border-sage transition-colors shadow-xs"
          >
            {copiedMd ? (
              <>
                <CheckIcon className="w-4 h-4 text-status-success" />
                <span className="text-status-success font-bold">Đã sao chép Markdown!</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 text-ink-secondary" />
                <span>Sao chép Markdown</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-control text-xs font-semibold text-ink bg-surface-canvas hover:bg-sage/40 border border-sage transition-colors shadow-xs"
          >
            {copiedLink ? (
              <>
                <CheckIcon className="w-4 h-4 text-status-success" />
                <span className="text-status-success font-bold">Đã sao chép link!</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 text-ink-secondary" />
                <span>Sao chép link trang</span>
              </>
            )}
          </button>

          <a
            href="https://github.com/kinbu3487-afk/Ventlore/blob/feat/fe-01-round-5-single-hero-home/docs/FE_DATA_MAP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-control text-xs font-semibold text-ink-secondary hover:text-ink transition-colors ml-auto"
          >
            <span>Xem trên GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-sage/60 pb-1 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('table')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-control border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'table'
              ? 'border-forest text-forest bg-surface-card font-bold'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Bảng ma trận tương tác (16 cột)</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-forest/10 text-forest text-[11px] font-mono">
            {filteredRows.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('decisions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-control border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'decisions'
              ? 'border-forest text-forest bg-surface-card font-bold'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <SparklesIcon className="w-4 h-4 text-amber" />
          <span>5 Quyết định cần Bin chốt</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber/20 text-ink text-[11px] font-mono">
            5
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('raw')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-control border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'raw'
              ? 'border-forest text-forest bg-surface-card font-bold'
              : 'border-transparent text-ink-secondary hover:text-ink'
          }`}
        >
          <FileTextIcon className="w-4 h-4" />
          <span>Xem mã Markdown gốc (.md)</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE TABLE */}
      {activeTab === 'table' && (
        <div className="space-y-4">
          {/* Controls: Search and Source Filters */}
          <div className="bg-surface-card border border-sage rounded-card p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo route, component, trường dữ liệu, quyết định..."
                  className="w-full pl-9 pr-4 py-2 rounded-control border border-sage bg-surface-canvas text-xs text-ink focus:outline-none focus:ring-2 focus:ring-forest"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Counter */}
              <div className="text-xs text-ink-secondary">
                Hiển thị <strong>{filteredRows.length}</strong> / {DATA_MAP_ROWS.length} mục
              </div>
            </div>

            {/* Source Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-sage/40 text-xs">
              <span className="text-[11px] font-bold text-ink-muted mr-1 uppercase">Nguồn đích:</span>
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'BE_DYNAMIC', label: 'BE_DYNAMIC' },
                { id: 'FE_STATIC', label: 'FE_STATIC' },
                { id: 'FE_LOCAL_STATE', label: 'FE_LOCAL_STATE' },
                { id: 'WALLET_PUBLIC_READ', label: 'WALLET_PUBLIC_READ' },
                { id: 'CHAIN_VIA_BE', label: 'CHAIN_VIA_BE' },
              ].map((src) => (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => setSelectedSource(src.id)}
                  className={`px-2.5 py-1 rounded-control font-mono text-[11px] transition-colors ${
                    selectedSource === src.id
                      ? 'bg-forest text-white font-bold'
                      : 'bg-surface-canvas border border-sage text-ink hover:bg-sage/40'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container with Horizontal Scroll */}
          <div className="border border-sage rounded-card bg-surface-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left text-xs border-collapse font-sans min-w-[2000px]">
                <thead className="bg-[#173F35] text-white sticky top-0 z-20 font-semibold shadow-xs">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center font-mono">#</th>
                    <th className="py-3 px-3 w-36">Page / Route</th>
                    <th className="py-3 px-3 w-32">Actor</th>
                    <th className="py-3 px-3 w-48">Component</th>
                    <th className="py-3 px-4 w-60">Field / Data group</th>
                    <th className="py-3 px-4 w-72">Giá trị demo</th>
                    <th className="py-3 px-3 w-36">Nguồn đang dùng</th>
                    <th className="py-3 px-3 w-40">Nguồn đích đề xuất</th>
                    <th className="py-3 px-3 w-40">ID đầu vào</th>
                    <th className="py-3 px-3 w-44">ID tạo / sử dụng lại</th>
                    <th className="py-3 px-3 w-32">Ai xem</th>
                    <th className="py-3 px-3 w-32">Ai sửa</th>
                    <th className="py-3 px-3 w-44">Khi nào tải / làm mới</th>
                    <th className="py-3 px-3 w-44">Trạng thái lỗi / rỗng</th>
                    <th className="py-3 px-3 w-40">Client state / persist</th>
                    <th className="py-3 px-3 w-40">Gợi ý cache / render</th>
                    <th className="py-3 px-4 w-80 bg-amber-900/60 text-amber-200 font-bold border-l border-amber-600">
                      ★ Quyết định cần Bin chốt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage/60">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={17} className="py-12 text-center text-ink-muted">
                        Không tìm thấy mục dữ liệu nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-sage/20 transition-colors ${
                          idx % 2 === 0 ? 'bg-surface-card' : 'bg-surface-canvas/60'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono text-ink-muted font-semibold">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-ink">
                          {row.route}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-sage/60 text-ink font-medium">
                            {row.actor}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-forest font-mono">
                          {row.component}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-ink">
                          {row.fieldGroup}
                        </td>
                        <td className="py-2.5 px-4 text-ink-secondary truncate max-w-xs" title={row.demoValue}>
                          {row.demoValue}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className="px-2 py-0.5 rounded border text-[11px] bg-slate-100 text-slate-700 border-slate-300">
                            {row.currentSource}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${getSourceBadgeClass(row.targetSource)}`}>
                            {row.targetSource}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-ink-secondary">
                          {row.inputId}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-ink">
                          {row.outputId}
                        </td>
                        <td className="py-2.5 px-3 text-ink-secondary">
                          {row.viewers}
                        </td>
                        <td className="py-2.5 px-3 text-ink-secondary">
                          {row.modifiers}
                        </td>
                        <td className="py-2.5 px-3 text-ink-secondary">
                          {row.fetchTrigger}
                        </td>
                        <td className="py-2.5 px-3 text-ink-secondary">
                          {row.errorStates}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-ink-secondary">
                          {row.clientState}
                        </td>
                        <td className="py-2.5 px-3 text-ink-secondary font-medium">
                          {row.cacheStrategy}
                        </td>
                        <td className="py-2.5 px-4 bg-amber-50/70 text-ink font-semibold border-l border-amber-200">
                          {row.decisionNeeded}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KEY DECISIONS */}
      {activeTab === 'decisions' && (
        <div className="space-y-6">
          <div className="p-4 rounded-card bg-amber-50 border border-amber-200 text-ink space-y-1">
            <h2 className="font-bold text-sm text-amber-900 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-amber-700" />
              <span>5 Quyết Định Kỹ Thuật Trọng Tâm Cần Bin Phê Duyệt Trước BE-01</span>
            </h2>
            <p className="text-xs text-amber-800">
              Các quyết định này ảnh hưởng trực tiếp đến thiết kế cơ sở dữ liệu PostgreSQL, quy tắc API và logic hợp đồng thông minh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KEY_DECISIONS.map((item) => (
              <div
                key={item.number}
                className="rounded-card border-2 border-sage bg-surface-card p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-forest text-white font-mono font-bold text-xs flex items-center justify-center">
                    {item.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    Cần chốt cho BE
                  </span>
                </div>

                <h3 className="font-bold text-sm text-ink">{item.title}</h3>

                <p className="text-xs text-ink-secondary leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-sage/60">
                  <div className="text-[11px] font-bold text-forest uppercase tracking-wider mb-1">
                    Khuyến nghị từ Kỹ thuật:
                  </div>
                  <p className="text-xs text-forest/90 font-medium italic">
                    &ldquo;{item.recommendation}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RAW MARKDOWN */}
      {activeTab === 'raw' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-ink-muted font-mono">
              Hiển thị nguyên bản tệp <code>docs/FE_DATA_MAP.md</code>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold bg-surface-canvas hover:bg-sage/40 border border-sage text-ink transition-colors"
              >
                {copiedMd ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 text-status-success" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5 text-ink-secondary" />
                    <span>Sao chép toàn bộ</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDownloadMd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-bold bg-amber hover:bg-amber-light text-ink transition-colors"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>Tải .md</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-card bg-[#111827] text-gray-100 text-xs font-mono overflow-x-auto leading-relaxed max-h-[75vh] border border-gray-800 shadow-inner">
            <code>{RAW_FE_DATA_MAP_MD}</code>
          </pre>
        </div>
      )}

      {/* 4. Bottom Reference Links */}
      <div className="rounded-card border border-sage bg-surface-card p-5 text-xs text-ink-secondary flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="w-4 h-4 text-forest shrink-0" />
          <span>Hồ sơ này tuân thủ nghiêm ngặt Hợp đồng định danh (ID Contract UUIDv7) và 5 Bất biến kiến trúc Ventlore.</span>
        </div>
        <div className="flex items-center gap-3 font-semibold text-forest">
          <a href="/docs/FE_DATA_MAP.md" download="FE_DATA_MAP.md" className="hover:underline">
            Tải trực tiếp file .md
          </a>
          <span>&bull;</span>
          <Link href={getLocalizedPath('/transparency')} className="hover:underline">
            Sổ cái minh bạch
          </Link>
          <span>&bull;</span>
          <Link href={getLocalizedPath('/account')} className="hover:underline">
            Tài khoản cá nhân
          </Link>
        </div>
      </div>
    </div>
  );
}
