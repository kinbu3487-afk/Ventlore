import React from 'react';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

/**
 * Clean, safe Markdown renderer for field reports.
 * Supports headings (###, ##), bold (**text**), bullet lists (- item), and paragraphs.
 */
export function MarkdownView({ content, className = '' }: MarkdownViewProps) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key} className="space-y-1.5 my-3 pl-5 list-disc text-ink-secondary text-sm sm:text-base leading-relaxed">
          {currentList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatInline = (text: string): string => {
    // Escape raw HTML entities first
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Bold: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>');
    // Inline code: `text`
    escaped = escaped.replace(/`([^`]+)`/g, '<code class="font-mono text-xs bg-sage/50 px-1 py-0.5 rounded text-forest">$1</code>');
    return escaped;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check for bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.slice(2));
      return;
    }

    // Flush any pending list
    flushList(`list-${idx}`);

    // Empty line -> spacing
    if (!trimmed) {
      return;
    }

    // Heading 3: ###
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${idx}`}
          className="text-lg sm:text-xl font-bold text-ink mt-6 mb-2 tracking-tight"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(4)) }}
        />
      );
      return;
    }

    // Heading 2: ##
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${idx}`}
          className="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3 tracking-tight border-b border-sage/40 pb-1"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(3)) }}
        />
      );
      return;
    }

    // Heading 1: #
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1
          key={`h1-${idx}`}
          className="text-2xl sm:text-3xl font-extrabold text-ink mt-8 mb-4 tracking-tight"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }}
        />
      );
      return;
    }

    // Regular paragraph
    elements.push(
      <p
        key={`p-${idx}`}
        className="my-3 text-ink-secondary text-sm sm:text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
      />
    );
  });

  // Flush remaining list
  flushList('list-end');

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
